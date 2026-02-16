package com.sidms.backend.controller;

import com.sidms.backend.dto.admin.SpatialUnitDto;
import com.sidms.backend.dto.admin.SpatialUnitWeatherInsightDto;
import com.sidms.backend.dto.admin.SpatialUnitWeatherNodeMappingDto;
import com.sidms.backend.entity.enums.SpatialType;
import com.sidms.backend.service.SpatialUnitAdminService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/spatial-units")
@PreAuthorize("hasRole('ADMIN')")
public class SpatialUnitAdminController {

    private final SpatialUnitAdminService spatialUnitAdminService;

    public SpatialUnitAdminController(SpatialUnitAdminService spatialUnitAdminService) {
        this.spatialUnitAdminService = spatialUnitAdminService;
    }

    @GetMapping
    public ResponseEntity<Page<SpatialUnitDto>> getAllSpatialUnits(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(required = false, name = "q") String query,
            @RequestParam(required = false) SpatialType type,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Boolean isTracked) {
        return ResponseEntity
                .ok(spatialUnitAdminService.getAllSpatialUnits(pageable, query, type, isActive, isTracked));
    }

    @GetMapping("/{id}/children")
    public ResponseEntity<Page<SpatialUnitDto>> getChildSpatialUnits(
            @PathVariable UUID id,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(spatialUnitAdminService.getChildSpatialUnits(id, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpatialUnitDto> getSpatialUnitById(@PathVariable UUID id) {
        return ResponseEntity.ok(spatialUnitAdminService.getSpatialUnitById(id));
    }

    @PostMapping
    public ResponseEntity<SpatialUnitDto> createSpatialUnit(@Valid @RequestBody SpatialUnitDto dto) {
        return ResponseEntity.ok(spatialUnitAdminService.createSpatialUnit(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpatialUnitDto> updateSpatialUnit(@PathVariable UUID id,
            @Valid @RequestBody SpatialUnitDto dto) {
        return ResponseEntity.ok(spatialUnitAdminService.updateSpatialUnit(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpatialUnit(@PathVariable UUID id) {
        spatialUnitAdminService.deleteSpatialUnit(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/mappings")
    public ResponseEntity<List<SpatialUnitWeatherNodeMappingDto>> getSpatialUnitMappings(
            @PathVariable UUID id,
            @RequestParam(required = false) Integer limit) {
        return ResponseEntity.ok(spatialUnitAdminService.getMappingsForSpatialUnit(id, limit));
    }

    @GetMapping("/{id}/weather-insight")
    public ResponseEntity<SpatialUnitWeatherInsightDto> getSpatialUnitWeatherInsight(
            @PathVariable UUID id,
            @RequestParam(required = false, defaultValue = "5") Integer limit) {
        return ResponseEntity.ok(spatialUnitAdminService.getWeatherInsightForSpatialUnit(id, limit));
    }
}
