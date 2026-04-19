package com.sidms.backend.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class SpatialUnitWeatherNodeMappingDto {
    private UUID id;
    private UUID spatialUnitId;
    private UUID weatherNodeId;
    private String weatherNodeCode;
    private Double weatherNodeLat;
    private Double weatherNodeLng;
    private Integer rank;
    private Double distanceKm;
    private Double idwWeight;
    private Boolean isPrimary;
    private LocalDateTime liveFetchedAt;
    private Double liveTempC;
    private Double liveHumidityPct;
    private Double livePrecipitationMm;
    private LocalDateTime createdAt;
}
