package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "forecast_projections")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForecastProjection {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "spatial_unit_id", nullable = false)
    private UUID spatialUnitId;

    @Column(name = "model_version", length = 50)
    private String modelVersion;

    @Column(name = "horizon_days")
    private Integer horizonDays;

    @Column(name = "forecast_date", nullable = false)
    private LocalDate forecastDate;

    @Column(length = 50, nullable = false)
    private String metric;

    @Column(name = "point_estimate", nullable = false)
    private Double pointEstimate;

    @Column(name = "lower_bound")
    private Double lowerBound;

    @Column(name = "upper_bound")
    private Double upperBound;

    @Column(name = "quality_score")
    private Double qualityScore;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;
}
