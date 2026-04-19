package com.sidms.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForecastDto {
    private LocalDate date;
    private Double predictedPrecip;
    private Double lowerBound;
    private Double upperBound;
    private Double qualityScore;
}
