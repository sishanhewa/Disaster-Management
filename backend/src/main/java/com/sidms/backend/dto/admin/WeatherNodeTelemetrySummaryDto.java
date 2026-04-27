package com.sidms.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherNodeTelemetrySummaryDto {
    private UUID weatherNodeId;
    private String sourceApi;
    private LocalDateTime fetchedAt;

    private Double tempC;
    private Double apparentTempC;
    private Double humidityPct;
    private Double pressureHpa;
    private Double precipitationMm;
    private Double windSpeedKmh;
    private Double windDirectionDeg;
    private Double cloudCoverPct;
    private Double uvIndex;
    private String symbolCode;
    private Double usAqi;
    private Double pm10;
    private Double pm25;

    private String rawPayloadType;
    private Integer rawPayloadEntryCount;
    private String firstEntryTime;
    private Double firstEntryTempC;
    private Double firstEntryHumidityPct;
}