package com.sidms.backend.controller;

import com.sidms.backend.entity.ArcgisSensorReading;
import com.sidms.backend.repository.ArcgisSensorReadingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * REST controller for ArcGIS water-level and rainfall sensor telemetry.
 * Ported from Disaster-Management-master DisasterDataController (/api/disaster-data → /api/v1/sensor-readings).
 * Read-only — data is ingested by the ArcGIS sync scheduler (Step 4b / future).
 */
@RestController
@RequestMapping("/api/v1/sensor-readings")
public class ArcgisSensorReadingController {

    private final ArcgisSensorReadingRepository repo;

    public ArcgisSensorReadingController(ArcgisSensorReadingRepository repo) {
        this.repo = repo;
    }

    /** Latest reading per (location_name, hazard_type) station pair. */
    @GetMapping("/latest")
    public ResponseEntity<List<ArcgisSensorReading>> getLatest() {
        return ResponseEntity.ok(repo.findLatestReadings());
    }

    /** Historical readings for a specific station and hazard type over N days. */
    @GetMapping("/history")
    public ResponseEntity<List<ArcgisSensorReading>> getHistory(
            @RequestParam String locationName,
            @RequestParam String hazardType,
            @RequestParam(defaultValue = "7") int daysBack) {
        LocalDateTime after = LocalDateTime.now().minusDays(daysBack);
        return ResponseEntity.ok(
                repo.findByLocationNameAndHazardTypeAndObservationTimeAfterOrderByObservationTimeAsc(
                        locationName, hazardType, after));
    }
}
