package com.sidms.backend.controller;

import com.sidms.backend.dto.admin.WeatherNodeDto;
import com.sidms.backend.dto.admin.WeatherNodeTelemetrySummaryDto;
import com.sidms.backend.entity.WeatherNodeLiveCache;
import com.sidms.backend.service.WeatherNodeAdminService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/weather-nodes")
@PreAuthorize("hasRole('ADMIN')")
public class WeatherNodeAdminController {

    private final WeatherNodeAdminService weatherNodeAdminService;

    public WeatherNodeAdminController(WeatherNodeAdminService weatherNodeAdminService) {
        this.weatherNodeAdminService = weatherNodeAdminService;
    }

    @GetMapping
    public ResponseEntity<Page<WeatherNodeDto>> getAllWeatherNodes(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(required = false, name = "q") String query,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Boolean isVolatile,
            @RequestParam(required = false) Boolean isCoastal,
            @RequestParam(required = false) Boolean isMountain) {
        return ResponseEntity.ok(weatherNodeAdminService.getAllWeatherNodes(
                pageable, query, isActive, isVolatile, isCoastal, isMountain));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WeatherNodeDto> getWeatherNodeById(@PathVariable UUID id) {
        return ResponseEntity.ok(weatherNodeAdminService.getWeatherNodeById(id));
    }

    @PostMapping
    public ResponseEntity<WeatherNodeDto> createWeatherNode(@Valid @RequestBody WeatherNodeDto dto) {
        return ResponseEntity.ok(weatherNodeAdminService.createWeatherNode(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WeatherNodeDto> updateWeatherNode(@PathVariable UUID id,
            @Valid @RequestBody WeatherNodeDto dto) {
        return ResponseEntity.ok(weatherNodeAdminService.updateWeatherNode(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWeatherNode(@PathVariable UUID id) {
        weatherNodeAdminService.deleteWeatherNode(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/live-data")
    public ResponseEntity<WeatherNodeLiveCache> getLiveTelemetry(@PathVariable UUID id) {
        return ResponseEntity.ok(weatherNodeAdminService.getLiveTelemetry(id));
    }

    @GetMapping("/{id}/live-data/summary")
    public ResponseEntity<WeatherNodeTelemetrySummaryDto> getLiveTelemetrySummary(@PathVariable UUID id) {
        return ResponseEntity.ok(weatherNodeAdminService.getLiveTelemetrySummary(id));
    }
}
