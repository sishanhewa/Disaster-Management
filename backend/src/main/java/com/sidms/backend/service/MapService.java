package com.sidms.backend.service;

import com.sidms.backend.dto.map.CustomZoneDto;
import com.sidms.backend.entity.CustomZone;
import com.sidms.backend.exception.ResourceNotFoundException;
import com.sidms.backend.repository.CustomZoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.sidms.backend.dto.map.LiveMapDataDto;

@Service
public class MapService {

    private final CustomZoneRepository customZoneRepository;
    private final DisasterWarningService disasterWarningService;
    private final CommunityReportService communityReportService;

    public MapService(CustomZoneRepository customZoneRepository,
                      DisasterWarningService disasterWarningService,
                      CommunityReportService communityReportService) {
        this.customZoneRepository = customZoneRepository;
        this.disasterWarningService = disasterWarningService;
        this.communityReportService = communityReportService;
    }

    public LiveMapDataDto getLiveMapData() {
        List<com.sidms.backend.dto.disaster.WarningResponse> activeWarnings = disasterWarningService.getAllActiveWarnings();
        List<com.sidms.backend.dto.report.ReportResponse> verifiedReports = communityReportService.getPublicReports(org.springframework.data.domain.Pageable.unpaged()).getContent();
        
        return LiveMapDataDto.builder()
                .activeWarnings(activeWarnings)
                .verifiedReports(verifiedReports)
                .build();
    }

    public List<com.sidms.backend.dto.disaster.WarningResponse> getOfficialAnnouncements() {
        // Return active warnings as official announcements
        return disasterWarningService.getAllActiveWarnings();
    }

    public List<CustomZoneDto> getCustomZones() {
        return customZoneRepository.findByDeletedAtIsNullAndIsActiveTrue().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CustomZoneDto createCustomZone(CustomZoneDto req, UUID adminId) {
        CustomZone customZone = CustomZone.builder()
                .name(req.getName())
                .zoneType(req.getZoneType())
                .geojsonPolygon(req.getGeojsonPolygon())
                .colorHex(req.getColorHex())
                .opacity(req.getOpacity() != null ? req.getOpacity() : 0.5)
                .isActive(true)
                .createdBy(adminId)
                .createdAt(LocalDateTime.now())
                .build();

        customZone = customZoneRepository.save(customZone);
        return toDto(customZone);
    }

    @Transactional
    public CustomZoneDto updateCustomZone(UUID id, CustomZoneDto req) {
        CustomZone customZone = customZoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Custom zone not found: " + id));

        if (req.getName() != null) customZone.setName(req.getName());
        if (req.getZoneType() != null) customZone.setZoneType(req.getZoneType());
        if (req.getGeojsonPolygon() != null) customZone.setGeojsonPolygon(req.getGeojsonPolygon());
        if (req.getColorHex() != null) customZone.setColorHex(req.getColorHex());
        if (req.getOpacity() != null) customZone.setOpacity(req.getOpacity());

        customZone = customZoneRepository.save(customZone);
        return toDto(customZone);
    }

    @Transactional
    public void deleteCustomZone(UUID id) {
        CustomZone customZone = customZoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Custom zone not found: " + id));

        customZone.setDeletedAt(LocalDateTime.now());
        customZone.setIsActive(false);
        customZoneRepository.save(customZone);
    }

    private CustomZoneDto toDto(CustomZone customZone) {
        return CustomZoneDto.builder()
                .id(customZone.getId())
                .name(customZone.getName())
                .zoneType(customZone.getZoneType())
                .geojsonPolygon(customZone.getGeojsonPolygon())
                .colorHex(customZone.getColorHex())
                .opacity(customZone.getOpacity())
                .build();
    }
}
