package com.sidms.backend.controller;

import com.sidms.backend.dto.flood.FloodDashboardResponse;
import com.sidms.backend.dto.flood.RivernetDeviceDto;
import com.sidms.backend.service.FloodService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/flood")
public class FloodController {

    private final FloodService floodService;

    public FloodController(FloodService floodService) {
        this.floodService = floodService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<FloodDashboardResponse> getDashboard() {
        return ResponseEntity.ok(floodService.getDashboard());
    }

    // ── ArcGIS live endpoints ────────────────────────────────

    @GetMapping("/arcgis/geojson/{layerName}")
    public ResponseEntity<JsonNode> getArcGISGeoJSON(@PathVariable String layerName) {
        return ResponseEntity.ok(floodService.getArcGISGeoJSON(layerName));
    }

    @GetMapping("/arcgis/summary")
    public ResponseEntity<Map<String, Object>> getArcGISAlertSummary() {
        return ResponseEntity.ok(floodService.getArcGISAlertSummary());
    }

    @GetMapping("/arcgis/stations")
    public ResponseEntity<List<Map<String, Object>>> getArcGISStations() {
        return ResponseEntity.ok(floodService.getArcGISStations());
    }

    @GetMapping("/arcgis/gauges/{name}/history")
    public ResponseEntity<List<Map<String, Object>>> getArcGISGaugeHistory(@PathVariable String name) {
        return ResponseEntity.ok(floodService.getArcGISGaugeHistory(name));
    }

    @GetMapping("/arcgis/rainfall/top")
    public ResponseEntity<List<Map<String, Object>>> getArcGISRainfallTop(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(floodService.getArcGISRainfallTop(limit));
    }

    // ── Rivernet live endpoints ──────────────────────────────

    @GetMapping("/rivernet/devices")
    public ResponseEntity<JsonNode> getRivernetDeviceConfig() {
        return ResponseEntity.ok(floodService.getRivernetDeviceConfig());
    }

    @GetMapping("/rivernet/status")
    public ResponseEntity<List<RivernetDeviceDto>> getRivernetStatus() {
        return ResponseEntity.ok(floodService.getRivernetStatus());
    }

    @GetMapping("/rivernet/live-status")
    public ResponseEntity<JsonNode> getRivernetLiveStatus(
            @RequestParam(defaultValue = "water_level") String deviceType,
            @RequestParam List<String> keys) {
        return ResponseEntity.ok(floodService.getRivernetLiveStatus(deviceType, keys));
    }

    @GetMapping("/rivernet/chart/{deviceKey}")
    public ResponseEntity<JsonNode> getRivernetChartData(
            @PathVariable String deviceKey,
            @RequestParam long start,
            @RequestParam long end) {
        return ResponseEntity.ok(floodService.getRivernetChartData(deviceKey, start, end));
    }

    @PostMapping("/rivernet/sync")
    public ResponseEntity<Map<String, String>> syncRivernetDevices() {
        floodService.syncRivernetDevices();
        return ResponseEntity.ok(Map.of("message", "Rivernet devices synced successfully"));
    }
}
