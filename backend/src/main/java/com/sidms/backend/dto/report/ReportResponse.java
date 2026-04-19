package com.sidms.backend.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private UUID id;
    private UUID userId;
    private String category;
    private String description;
    private String severityAssessment;
    private Double lat;
    private Double lng;
    private String geohash;
    private String status;
    private String spatialUnitName;
    private UUID exactMatchSpatialUnitId;
    private Set<UUID> targetSpatialUnitIds;
    private List<String> photoUrls;
    private Integer confirmCount;
    private Integer denyCount;
    private LocalDateTime createdAt;
}
