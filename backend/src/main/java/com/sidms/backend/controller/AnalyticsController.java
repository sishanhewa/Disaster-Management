package com.sidms.backend.controller;

import com.sidms.backend.dto.analytics.AnalyticsOverviewResponse;
import com.sidms.backend.dto.analytics.ForecastAccuracyDto;
import com.sidms.backend.dto.analytics.ForecastHistoryPointDto;
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
}
