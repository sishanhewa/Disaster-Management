package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "weather_node_hourly_forecast")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherNodeHourlyForecast {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "weather_node_id", nullable = false)
    private UUID weatherNodeId;

    @Column(name = "forecast_time", nullable = false)
    private LocalDateTime forecastTime;

    @Column(name = "source_name", length = 50, nullable = false)
    private String sourceName;

    @Column(name = "temp_c")
    private Double tempC;

    @Column(name = "precipitation_mm")
    private Double precipitationMm;

    @Column(name = "precip_probability")
    private Double precipProbability;

    @Column(name = "wind_speed_kmh")
    private Double windSpeedKmh;

    @Column(name = "cape_jkg")
    private Double capeJkg;

    @Column(name = "relative_humidity_pct")
    private Double relativeHumidityPct;

    @Column(name = "dew_point_c")
    private Double dewPointC;

    @Column(name = "apparent_temp_c")
    private Double apparentTempC;

    @Column(name = "weather_code")
    private Integer weatherCode;

    @Column(name = "pressure_hpa")
    private Double pressureHpa;

    @Column(name = "cloud_cover_pct")
    private Double cloudCoverPct;

    @Column(name = "visibility_m")
    private Double visibilityM;

    @Column(name = "wind_direction_deg")
    private Double windDirectionDeg;

    @Column(name = "wind_gusts_kmh")
    private Double windGustsKmh;

    @Column(name = "uv_index")
    private Double uvIndex;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
