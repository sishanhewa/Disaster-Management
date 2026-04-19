package com.sidms.backend.controller;

import com.sidms.backend.dto.meteo.MetBulletinDto;
import com.sidms.backend.service.MeteoScraperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/meteo")
public class MeteoController {

    private final MeteoScraperService meteoScraperService;

    public MeteoController(MeteoScraperService meteoScraperService) {
        this.meteoScraperService = meteoScraperService;
    }

    @GetMapping("/bulletins")
    public ResponseEntity<List<MetBulletinDto>> getLatestBulletins() {
        return ResponseEntity.ok(meteoScraperService.getLatestBulletins());
    }

    @GetMapping("/forecast")
    public ResponseEntity<Map<String, Object>> getPublicForecast() {
        return ResponseEntity.ok(meteoScraperService.getPublicForecast());
    }

    @GetMapping("/marine")
    public ResponseEntity<Map<String, Object>> getMarineForecast() {
        return ResponseEntity.ok(meteoScraperService.getMarineForecast());
    }

    @GetMapping("/fleet")
    public ResponseEntity<Map<String, Object>> getFleetForecast() {
        return ResponseEntity.ok(meteoScraperService.getFleetForecast());
    }

    @GetMapping("/advisories")
    public ResponseEntity<Map<String, Object>> getAdvisories() {
        return ResponseEntity.ok(meteoScraperService.getAdvisories());
    }

    @GetMapping("/graphics")
    public ResponseEntity<Map<String, Object>> getWeatherGraphics() {
        return ResponseEntity.ok(meteoScraperService.getWeatherGraphics());
    }

    @GetMapping("/pdfs")
    public ResponseEntity<Map<String, Object>> getPdfDirectory() {
        return ResponseEntity.ok(meteoScraperService.getPdfDirectory());
    }

    @GetMapping("/3hourly")
    public ResponseEntity<Map<String, Object>> getThreeHourlyData() {
        return ResponseEntity.ok(meteoScraperService.getThreeHourlyData());
    }
}
