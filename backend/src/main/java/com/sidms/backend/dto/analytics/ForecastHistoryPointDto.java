package com.sidms.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForecastHistoryPointDto {
    private LocalDate targetDate;
    private Double predictedValue;
    private Double actualValue;
    private Double confidenceLower;
    private Double confidenceUpper;
    private Double absoluteError;
    private Double percentError;
    private Boolean confidenceHit;
    private LocalDateTime forecastGeneratedAt;
    private LocalDateTime actualRecordedAt;
}
