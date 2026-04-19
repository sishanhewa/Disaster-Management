package com.sidms.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForecastAccuracyDto {
    private UUID spatialUnitId;
    private Integer totalForecasts;
    private Double mae;
    private Double hitRate;
}
