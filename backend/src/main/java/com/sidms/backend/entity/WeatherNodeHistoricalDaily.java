package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "weather_node_historical_daily")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherNodeHistoricalDaily {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "weather_node_id", nullable = false)
    private UUID weatherNodeId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "source_name", length = 50, nullable = false)
    private String sourceName;

    @Column(name = "source_priority")
    private Integer sourcePriority;

    @Column(name = "temp_max_c")
    private Double tempMaxC;

    @Column(name = "temp_min_c")
    private Double tempMinC;

    @Column(name = "temp_mean_c")
    private Double tempMeanC;

    @Column(name = "precip_sum_mm")
    private Double precipSumMm;

    @Column(name = "precip_hours")
    private Double precipHours;

    @Column(name = "humidity_mean_pct")
    private Double humidityMeanPct;

    @Column(name = "wind_max_kmh")
    private Double windMaxKmh;

    @Column(name = "cloud_mean_pct")
    private Double cloudMeanPct;

    @Column(name = "cape_max")
    private Double capeMax;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
