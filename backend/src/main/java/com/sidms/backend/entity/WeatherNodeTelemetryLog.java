package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "weather_node_telemetry_log")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherNodeTelemetryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "weather_node_id", nullable = false)
    private UUID weatherNodeId;

    @Column(name = "logged_at")
    private LocalDateTime loggedAt;

    @Column(name = "source_api", length = 50)
    private String sourceApi;

    @Column(name = "temp_c")
    private Double tempC;

    @Column(name = "precipitation_mm")
    private Double precipitationMm;

    @Column(name = "precip_probability")
    private Double precipProbability;

    @Column(name = "rain_mm")
    private Double rainMm;

    @Column(name = "humidity_pct")
    private Double humidityPct;

    @Column(name = "wind_speed_kmh")
    private Double windSpeedKmh;

    @Column(name = "cloud_cover_pct")
    private Double cloudCoverPct;

    @Column(name = "cape_jkg")
    private Double capeJkg;

    @Column(name = "uv_index")
    private Double uvIndex;
}
