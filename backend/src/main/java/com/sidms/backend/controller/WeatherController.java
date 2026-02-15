package com.sidms.backend.controller;

import com.sidms.backend.dto.disaster.WarningResponse;
import com.sidms.backend.dto.weather.SpatialUnitSearchResult;
import com.sidms.backend.dto.weather.advanced.AdvancedForecastResponse;
import com.sidms.backend.service.DisasterWarningService;
import com.sidms.backend.service.WeatherService;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/weather")
@Validated
public class WeatherController {

    private final WeatherService weatherService;
    private final DisasterWarningService disasterWarningService;

    public WeatherController(WeatherService weatherService,
            DisasterWarningService disasterWarningService) {
        this.weatherService = weatherService;
        this.disasterWarningService = disasterWarningService;
    }

    @GetMapping("/spatial-unit/{id}")
    public ResponseEntity<AdvancedForecastResponse> getWeatherForSpatialUnit(@PathVariable UUID id) {
        return ResponseEntity.ok(weatherService.getWeatherForSpatialUnit(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<SpatialUnitSearchResult>> searchSpatialUnits(
            @RequestParam @Size(min = 2, max = 100, message = "q must be between 2 and 100 characters") String q) {
        return ResponseEntity.ok(weatherService.searchSpatialUnits(q));
    }

    @GetMapping("/exact")
    public ResponseEntity<AdvancedForecastResponse> getNearestSpatialUnit(
            @RequestParam @DecimalMin(value = "-90.0", message = "lat must be >= -90") @DecimalMax(value = "90.0", message = "lat must be <= 90") Double lat,
            @RequestParam @DecimalMin(value = "-180.0", message = "lng must be >= -180") @DecimalMax(value = "180.0", message = "lng must be <= 180") Double lng) {
        return ResponseEntity.ok(weatherService.getNearestSpatialUnit(lat, lng));
    }

    @GetMapping("/active-warnings/{spatialUnitId}")
    public ResponseEntity<List<WarningResponse>> getActiveWarnings(@PathVariable UUID spatialUnitId) {
        return ResponseEntity.ok(disasterWarningService.getActiveWarningsForSpatialUnit(spatialUnitId));
    }



    @GetMapping("/celestial")
    public ResponseEntity<com.sidms.backend.dto.weather.advanced.CelestialEventsResponse> getCelestialEvents(
            @RequestParam @DecimalMin(value = "-90.0", message = "lat must be >= -90") @DecimalMax(value = "90.0", message = "lat must be <= 90") Double lat,
            @RequestParam @DecimalMin(value = "-180.0", message = "lng must be >= -180") @DecimalMax(value = "180.0", message = "lng must be <= 180") Double lng) {
        return ResponseEntity.ok(weatherService.getCelestialEvents(lat, lng));
    }

    @GetMapping("/tracked")
    public ResponseEntity<List<AdvancedForecastResponse>> getAllTrackedWeather() {
        return ResponseEntity.ok(weatherService.getAllTrackedWeather());
    }
}
