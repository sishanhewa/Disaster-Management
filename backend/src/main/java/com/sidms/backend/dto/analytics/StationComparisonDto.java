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
public class StationComparisonDto {
    private String stationId;
    private String stationName;
    private Double stationLat;
    private Double stationLon;
    private Double distanceKm;
    private Double stationTempC;
    private Double stationHumidityPct;
    private Double stationRainfallMm;
    private Double interpolatedTempC;
    private Double interpolatedHumidityPct;
    private Double interpolatedRainfallMm;
    private Double tempBiasC;
    private Double humidityBiasPct;
    private Double rainfallBiasMm;
    private LocalDateTime observationTime;
    private String dataQuality;          // STATION_DIRECT, MODEL_BIAS_CORRECTED, MODEL_RAW
    private Integer stationAgeMinutes;   // How stale is the station data
}
