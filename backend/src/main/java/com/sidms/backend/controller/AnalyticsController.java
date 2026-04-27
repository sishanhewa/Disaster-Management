package com.sidms.backend.controller;

import com.sidms.backend.dto.analytics.*;
import com.sidms.backend.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/overview/{spatialUnitId}")
    public ResponseEntity<AnalyticsOverviewResponse> getOverview(@PathVariable UUID spatialUnitId) {
        return ResponseEntity.ok(analyticsService.getOverview(spatialUnitId));
    }

    @GetMapping("/forecast-accuracy/{spatialUnitId}")
    public ResponseEntity<ForecastAccuracyDto> getForecastAccuracy(
            @PathVariable UUID spatialUnitId,
            @RequestParam(required = false, defaultValue = "30") Integer days,
            @RequestParam(required = false, defaultValue = "all") String metric) {
        return ResponseEntity.ok(analyticsService.getForecastAccuracy(spatialUnitId, days, metric));
    }

    @GetMapping("/forecast-history/{spatialUnitId}/{metric}")
    public ResponseEntity<List<ForecastHistoryPointDto>> getForecastHistory(
            @PathVariable UUID spatialUnitId,
            @PathVariable String metric,
            @RequestParam(required = false, defaultValue = "30") Integer days) {
        return ResponseEntity.ok(analyticsService.getForecastHistoryPoints(spatialUnitId, metric, days));
    }

    // ── NEW: Satellite Rainfall Comparison (JAXA vs Station vs Model) ─

    @GetMapping("/satellite-rain/{spatialUnitId}")
    public ResponseEntity<List<SatelliteRainfallDto>> getSatelliteRainfall(
            @PathVariable UUID spatialUnitId,
            @RequestParam(required = false, defaultValue = "7") Integer days) {
        return ResponseEntity.ok(analyticsService.getSatelliteRainfallComparison(spatialUnitId, days));
    }

    // ── NEW: Station Comparison (Ground Truth vs Model Interpolation) ─

    @GetMapping("/station-comparison/{spatialUnitId}")
    public ResponseEntity<List<StationComparisonDto>> getStationComparison(
            @PathVariable UUID spatialUnitId) {
        return ResponseEntity.ok(analyticsService.getStationComparison(spatialUnitId));
    }

    // ── NEW: Hourly Trend (Detailed time-series for charts) ─

    @GetMapping("/hourly-trend/{spatialUnitId}")
    public ResponseEntity<List<HourlyTrendDto>> getHourlyTrend(
            @PathVariable UUID spatialUnitId,
            @RequestParam(required = false, defaultValue = "72") Integer hours,
            @RequestParam(required = false, defaultValue = "temperature") String metric) {
        return ResponseEntity.ok(analyticsService.getHourlyTrend(spatialUnitId, hours, metric));
    }
}
