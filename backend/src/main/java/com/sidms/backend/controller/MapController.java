package com.sidms.backend.controller;

import com.sidms.backend.dto.map.CustomZoneDto;
import com.sidms.backend.security.CustomUserDetails;
import com.sidms.backend.service.MapService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class MapController {

    private final MapService mapService;

    public MapController(MapService mapService) {
        this.mapService = mapService;
    }

    @GetMapping("/map/custom-zones")
    public ResponseEntity<List<CustomZoneDto>> getCustomZones() {
        return ResponseEntity.ok(mapService.getCustomZones());
    }

    @GetMapping("/map/live-data")
    public ResponseEntity<com.sidms.backend.dto.map.LiveMapDataDto> getLiveMapData() {
        return ResponseEntity.ok(mapService.getLiveMapData());
    }

    @GetMapping("/map/announcements")
    public ResponseEntity<List<com.sidms.backend.dto.disaster.WarningResponse>> getOfficialAnnouncements() {
        return ResponseEntity.ok(mapService.getOfficialAnnouncements());
    }

    @PostMapping("/admin/map/zones")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CustomZoneDto> createCustomZone(@RequestBody CustomZoneDto request,
                                                           @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(mapService.createCustomZone(request, principal.getUser().getId()));
    }

    @PutMapping("/admin/map/zones/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CustomZoneDto> updateCustomZone(@PathVariable UUID id,
                                                           @RequestBody CustomZoneDto request) {
        return ResponseEntity.ok(mapService.updateCustomZone(id, request));
    }

    @DeleteMapping("/admin/map/zones/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCustomZone(@PathVariable UUID id) {
        mapService.deleteCustomZone(id);
        return ResponseEntity.noContent().build();
    }
}
