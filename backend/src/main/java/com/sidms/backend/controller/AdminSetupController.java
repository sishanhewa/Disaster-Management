package com.sidms.backend.controller;

import com.sidms.backend.dto.admin.SchedulerWorkerStatusDto;
import com.sidms.backend.scheduler.HistoricalBackfillScheduler;
import com.sidms.backend.service.IdwComputationService;
import com.sidms.backend.service.SchedulerAdminService;
import com.sidms.backend.service.SpatialImportService;
import com.sidms.backend.service.WeatherNodeGeneratorService;
import com.sidms.backend.scheduler.WeatherSyncScheduler;
import com.sidms.backend.scheduler.MeteoSyncScheduler;
import com.sidms.backend.scheduler.FloodSyncScheduler;
import com.sidms.backend.scheduler.CacheWarmingScheduler;
import com.sidms.backend.scheduler.AlertRuleEvaluator;
import com.sidms.backend.scheduler.ArcGisSyncScheduler;
import com.sidms.backend.scheduler.MetCelestialSyncScheduler;
import com.sidms.backend.scheduler.YrNoSyncScheduler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/v1/admin/setup")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Slf4j
public class AdminSetupController {

    private final Set<String> runningWorkers = ConcurrentHashMap.newKeySet();

    private final SpatialImportService spatialImportService;
    private final WeatherNodeGeneratorService weatherNodeGeneratorService;
    private final IdwComputationService idwComputationService;
    private final HistoricalBackfillScheduler historicalBackfillScheduler;
    private final SchedulerAdminService schedulerAdminService;

    // ──────────────────────────────────────────────
    // Spatial import
    // ──────────────────────────────────────────────

    @PostMapping("/import-spatial")
    public ResponseEntity<Map<String, Object>> importSpatial() {
        if (spatialImportService.isAlreadyImported()) {
            return ResponseEntity.ok(Map.of(
                    "status", "ALREADY_IMPORTED",
                    "counts", spatialImportService.getImportStatus()));
        }

        // Run async so the HTTP request returns immediately
        CompletableFuture.runAsync(() -> {
            try {
                spatialImportService.importAll();
            } catch (Exception e) {
                log.error("Async spatial import failed: {}", e.getMessage());
            }
        });

        return ResponseEntity.accepted().body(Map.of(
                "status", "IMPORT_STARTED",
                "message", "Spatial unit import started in background. Poll /import-status for progress."));
    }

    @GetMapping("/import-status")
    public ResponseEntity<Map<String, Object>> importStatus() {
        Map<String, Long> counts = spatialImportService.getImportStatus();
        boolean imported = spatialImportService.isAlreadyImported();
        return ResponseEntity.ok(Map.of(
                "imported", imported,
                "counts", counts));
    }

    // ──────────────────────────────────────────────
    // Weather node generation
    // ──────────────────────────────────────────────

    @PostMapping("/generate-nodes")
    public ResponseEntity<Map<String, Object>> generateNodes() {
        if (weatherNodeGeneratorService.isAlreadyGenerated()) {
            return ResponseEntity.ok(Map.of(
                    "status", "ALREADY_GENERATED",
                    "message", "Weather nodes already exist."));
        }

        CompletableFuture.runAsync(() -> {
            try {
                weatherNodeGeneratorService.generateNodes();
            } catch (Exception e) {
                log.error("Async weather node generation failed: {}", e.getMessage());
            }
        });

        return ResponseEntity.accepted().body(Map.of(
                "status", "GENERATION_STARTED",
                "message", "Weather node generation started in background."));
    }

    // ──────────────────────────────────────────────
    // IDW computation
    // ──────────────────────────────────────────────

    @PostMapping("/compute-idw")
    public ResponseEntity<Map<String, Object>> computeIdw() {
        Map<String, Object> status = idwComputationService.getStatus();
        if ("COMPUTING".equals(status.get("status"))) {
            return ResponseEntity.ok(Map.of(
                    "status", "ALREADY_RUNNING",
                    "progress", status));
        }

        idwComputationService.computeAll();

        return ResponseEntity.accepted().body(Map.of(
                "status", "IDW_COMPUTATION_STARTED",
                "message", "IDW computation started in background. Poll /idw-status for progress."));
    }

    @GetMapping("/idw-status")
    public ResponseEntity<Map<String, Object>> idwStatus() {
        return ResponseEntity.ok(idwComputationService.getStatus());
    }

    // ──────────────────────────────────────────────
    // Historical backfill
    // ──────────────────────────────────────────────

    @PostMapping("/backfill-history")
    public ResponseEntity<Map<String, Object>> backfillHistory(
            @RequestParam(defaultValue = "730") int days) {
        CompletableFuture.runAsync(() -> {
            try {
                historicalBackfillScheduler.backfillLastNDays(days);
            } catch (Exception e) {
                log.error("Async historical backfill failed: {}", e.getMessage());
            }
        });

        return ResponseEntity.accepted().body(Map.of(
                "status", "BACKFILL_STARTED",
                "days", days,
                "message", "Historical backfill started for the last " + days + " days."));
    }



    @GetMapping("/workers/status")
    public ResponseEntity<List<SchedulerWorkerStatusDto>> getWorkerStatuses() {
        return ResponseEntity.ok(schedulerAdminService.getWorkerStatuses());
    }

    @PostMapping("/workers/run/{workerKey}")
    public ResponseEntity<Map<String, Object>> runWorkerNow(
            @PathVariable String workerKey,
            @RequestParam(required = false, defaultValue = "730") Integer days) {
        String normalized = workerKey == null ? "" : workerKey.trim().toLowerCase();

        if (!runningWorkers.add(normalized)) {
            return ResponseEntity.status(409).body(Map.of(
                    "status", "ALREADY_RUNNING",
                    "workerKey", normalized,
                    "message", "Worker is already running."));
        }

        Runnable task;
        switch (normalized) {
            case "import-spatial" -> task = spatialImportService::importAll;
            case "generate-nodes" -> task = weatherNodeGeneratorService::generateNodes;
            case "compute-idw" -> task = idwComputationService::computeAll;
            case "backfill-history" -> task = () -> historicalBackfillScheduler.backfillLastNDays(days);
            default -> {
                return ResponseEntity.badRequest().body(Map.of(
                        "status", "UNKNOWN_WORKER",
                        "workerKey", workerKey,
                        "message", "Unsupported worker key."));
            }
        }

        CompletableFuture.runAsync(() -> {
            try {
                task.run();
            } catch (Exception e) {
                log.error("Manual worker run failed ({}): {}", normalized, e.getMessage());
            } finally {
                runningWorkers.remove(normalized);
            }
        });

        return ResponseEntity.accepted().body(Map.of(
                "status", "RUN_STARTED",
                "workerKey", normalized,
                "message", "Worker run started in background."));
    }
}
