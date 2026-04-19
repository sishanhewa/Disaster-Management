package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "historical_weather")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistoricalWeather {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "spatial_unit_id", nullable = false)
    private UUID spatialUnitId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "temp_max")
    private Double tempMax;

    @Column(name = "temp_min")
    private Double tempMin;

    @Column(name = "temp_mean")
    private Double tempMean;

    @Column(name = "precip_mm")
    private Double precipMm;

    @Column(name = "rain_hours")
    private Double rainHours;

    @Column(name = "humidity_mean")
    private Double humidityMean;

    @Column(name = "wind_speed_mean")
    private Double windSpeedMean;

    @Column(name = "wind_direction_dominant")
    private Double windDirectionDominant;

    @Column(name = "uv_index_max")
    private Double uvIndexMax;

    @Column(length = 50)
    private String source;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
