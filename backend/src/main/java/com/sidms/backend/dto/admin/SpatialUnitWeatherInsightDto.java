package com.sidms.backend.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class SpatialUnitWeatherInsightDto {
    private UUID spatialUnitId;
    private String spatialUnitName;
    private Integer nearestNodeCount;
    private Double weightCoverage;
    private Double weightedTempC;
    private Double weightedHumidityPct;
    private Double weightedPrecipitationMm;
    private LocalDateTime computedAt;
    private List<SpatialUnitWeatherNodeMappingDto> nearestNodes;
}
