package com.sidms.backend.service;

import com.sidms.backend.entity.SpatialUnit;
import com.sidms.backend.entity.SpatialUnitWeatherNodeMapping;
import com.sidms.backend.entity.WeatherNode;
import com.sidms.backend.repository.SpatialUnitRepository;
import com.sidms.backend.repository.SpatialUnitWeatherNodeMappingRepository;
import com.sidms.backend.repository.WeatherNodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@Slf4j
@RequiredArgsConstructor
public class IdwComputationService {

    private final SpatialUnitRepository spatialUnitRepository;
    private final WeatherNodeRepository weatherNodeRepository;
    private final SpatialUnitWeatherNodeMappingRepository mappingRepository;
    private final TransactionTemplate transactionTemplate;

    // ── CHANGE: Use 6 nodes instead of 4 for better accuracy in complex terrain ──
    private static final int TOP_N = 6;  // Was: 4
    private static final int BATCH_SIZE = 500;
    private static final double EARTH_RADIUS_KM = 6371.0;

    private final AtomicInteger progress = new AtomicInteger(0);
    private final AtomicInteger total = new AtomicInteger(0);
    private final AtomicBoolean running = new AtomicBoolean(false);
    private volatile String currentStatus = "IDLE";

    // ──────────────────────────────────────────────
    // Public API
    // ──────────────────────────────────────────────

    @Async
    public CompletableFuture<Void> computeAll() {
        if (running.get()) {
            log.warn("IDW computation already running – skipping duplicate call");
            return CompletableFuture.completedFuture(null);
        }

        running.set(true);
        currentStatus = "COMPUTING";
        progress.set(0);

        try {
            log.info("Starting IDW computation");
            long startTime = System.currentTimeMillis();

            List<SpatialUnit> spatialUnits = spatialUnitRepository.findAll();
            List<WeatherNode> weatherNodes = weatherNodeRepository.findByIsActiveTrue();

            total.set(spatialUnits.size());
            log.info("Computing IDW for {} spatial units against {} weather nodes",
                    spatialUnits.size(), weatherNodes.size());

            List<SpatialUnitWeatherNodeMapping> batch = new ArrayList<>(BATCH_SIZE * TOP_N);

            for (SpatialUnit su : spatialUnits) {
                List<SpatialUnitWeatherNodeMapping> mappings = computeMappingsForUnit(su, weatherNodes);
                batch.addAll(mappings);

                if (batch.size() >= BATCH_SIZE * TOP_N) {
                    // ── WRAP IN TRANSACTION TEMPLATE ──────────────
                    transactionTemplate.execute(new TransactionCallbackWithoutResult() {
                        @Override
                        protected void doInTransactionWithoutResult(TransactionStatus status) {
                            saveBatchInternal(batch);
                        }
                    });
                    // ──────────────────────────────────────────────
                }

                int current = progress.incrementAndGet();
                if (current % 500 == 0) {
                    log.info("  IDW progress: {}/{} ({}%)", current, total.get(),
                            (current * 100) / total.get());
                }
            }

            // Save remaining batch
            if (!batch.isEmpty()) {
                transactionTemplate.execute(new TransactionCallbackWithoutResult() {
                    @Override
                    protected void doInTransactionWithoutResult(TransactionStatus status) {
                        saveBatchInternal(batch);
                    }
                });
            }

            long elapsed = System.currentTimeMillis() - startTime;
            currentStatus = "COMPLETE";
            log.info("✅ IDW computation completed in {} ms – {} units processed, {} mappings created",
                    elapsed, total.get(), total.get() * TOP_N);

        } catch (Exception e) {
            currentStatus = "FAILED: " + e.getMessage();
            log.error("IDW computation failed: {}", e.getMessage(), e);
        } finally {
            running.set(false);
        }

        return CompletableFuture.completedFuture(null);
    }

    public Map<String, Object> getStatus() {
        int t = total.get();
        int p = progress.get();
        int pct = t > 0 ? (p * 100) / t : 0;

        Map<String, Object> status = new LinkedHashMap<>();
        status.put("status", currentStatus);
        status.put("progress", p);
        status.put("total", t);
        status.put("percentComplete", pct);
        return status;
    }

    // ──────────────────────────────────────────────
    // IDW computation per spatial unit
    // ──────────────────────────────────────────────

    // ── CHANGE: Updated computeMappingsForUnit with proper 3D IDW ──
    private List<SpatialUnitWeatherNodeMapping> computeMappingsForUnit(
            SpatialUnit su, List<WeatherNode> weatherNodes) {

        double suElev = su.getElevationM() != null ? su.getElevationM() : 0.0;

        // Compute 3D effective distances to ALL weather nodes
        List<NodeDistance3D> distances = new ArrayList<>(weatherNodes.size());
        for (WeatherNode node : weatherNodes) {
            double horizDist = haversine(su.getLat(), su.getLng(), node.getLat(), node.getLng());
            double nodeElev = node.getElevationM() != null ? node.getElevationM().doubleValue() : 0.0;
            double elevDiff = suElev - nodeElev;

            // 3D effective distance: 100m elevation ≈ 1km horizontal for interpolation weight
            double vertDist = Math.abs(elevDiff) / 100.0;
            double effectiveDist = Math.sqrt(
                    horizDist * horizDist + vertDist * vertDist
            );

            distances.add(new NodeDistance3D(node, horizDist, effectiveDist, elevDiff));
        }

        // Sort by effective distance (not horizontal!) and take top N
        distances.sort(Comparator.comparingDouble(nd -> nd.effectiveDistance));
        List<NodeDistance3D> topN = distances.subList(0, Math.min(TOP_N, distances.size()));

        // Compute IDW weights using EFFECTIVE distance: w = 1 / eff_dist²
        double sumWeights = 0.0;
        double[] rawWeights = new double[topN.size()];
        for (int i = 0; i < topN.size(); i++) {
            double effDist = topN.get(i).effectiveDistance;
            if (effDist < 0.001) effDist = 0.001; // guard against division by zero
            rawWeights[i] = 1.0 / (effDist * effDist);
            sumWeights += rawWeights[i];
        }

        // Build mappings with PRE-COMPUTED values (runtime uses these directly)
        List<SpatialUnitWeatherNodeMapping> mappings = new ArrayList<>(TOP_N);
        LocalDateTime now = LocalDateTime.now();

        for (int i = 0; i < topN.size(); i++) {
            NodeDistance3D nd = topN.get(i);
            double normalizedWeight = rawWeights[i] / sumWeights;

            mappings.add(SpatialUnitWeatherNodeMapping.builder()
                    .spatialUnitId(su.getId())
                    .weatherNodeId(nd.node.getId())
                    .rank(i + 1)
                    .distanceKm(nd.horizontalDistance)      // Keep horizontal for reference/debug
                    .idwWeight(normalizedWeight)             // ← Pre-computed 3D weight
                    .effectiveDistance(nd.effectiveDistance) // ← Store 3D distance
                    .elevationDiffM(nd.elevationDiff)        // ← Store elevation delta
                    .isPrimary(i == 0)
                    .createdAt(now)
                    .build());
        }
        return mappings;
    }

    /**
     * Internal batch save logic - NO @Transactional annotation.
     * Call this via transactionTemplate.execute() from async context.
     */
    private void saveBatchInternal(List<SpatialUnitWeatherNodeMapping> batch) {
        if (batch.isEmpty()) return;

        Set<UUID> spatialUnitIds = new HashSet<>();
        for (SpatialUnitWeatherNodeMapping m : batch) {
            spatialUnitIds.add(m.getSpatialUnitId());
        }

        // Delete existing mappings for these spatial units
        for (UUID suId : spatialUnitIds) {
            mappingRepository.deleteBySpatialUnitId(suId);
        }

        // ── CRITICAL FIX: Force DELETEs to execute before INSERTs ──
        mappingRepository.flush();
        // ─────────────────────────────────────────────────────────

        mappingRepository.saveAll(batch);
        mappingRepository.flush();
        batch.clear();
    }

    // ──────────────────────────────────────────────
    // Haversine distance formula
    // ──────────────────────────────────────────────

    private double haversine(double lat1, double lng1, double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    // ──────────────────────────────────────────────
    // Helper record
    // ──────────────────────────────────────────────

    private static class NodeDistance {
        final WeatherNode node;
        final double distance;

        NodeDistance(WeatherNode node, double distance) {
            this.node = node;
            this.distance = distance;
        }
    }

    // ── CHANGE: New helper record for 3D distance calculation ──
    private static class NodeDistance3D {
        final WeatherNode node;
        final double horizontalDistance;  // Pure haversine km
        final double effectiveDistance;   // 3D: sqrt(horiz² + (elev_diff/100)²)
        final double elevationDiff;       // Unit elev - Node elev (meters)

        NodeDistance3D(WeatherNode node, double horiz, double eff, double elevDiff) {
            this.node = node;
            this.horizontalDistance = horiz;
            this.effectiveDistance = eff;
            this.elevationDiff = elevDiff;
        }
    }
}
