package com.sidms.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HourlyTrendDto {
    private LocalDateTime timestamp;
    private Double temperatureC;
    private Double precipitationMm;
    private Double humidityPct;
    private Double windSpeedKmh;
    private Double windDirectionDeg;
    private Double pressureHpa;
    private Double cloudCoverPct;
    private String symbolCode;
    private String dataSource;           // YRNO, OPENMETEO, STATION_FUSION
}
