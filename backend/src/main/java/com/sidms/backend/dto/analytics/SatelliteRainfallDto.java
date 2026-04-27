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
public class SatelliteRainfallDto {
    private LocalDate date;
    private Double satelliteRainMm;      // JAXA GSMaP satellite data
    private Double stationRainMm;      // Physical station observation (if nearby)
    private Double modelRainMm;        // IDW-interpolated from node_timeseries
    private Double discrepancyPercent; // Difference between sources
    private String primarySource;      // Which source was most reliable (STATION, SATELLITE, MODEL)
}
