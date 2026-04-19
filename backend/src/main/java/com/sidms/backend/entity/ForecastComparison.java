package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "forecast_comparisons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForecastComparison {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "forecast_projection_id")
    private UUID forecastProjectionId;

    @Column(name = "spatial_unit_id", nullable = false)
    private UUID spatialUnitId;

    @Column(length = 50, nullable = false)
    private String metric;

    @Column(name = "target_date", nullable = false)
    private LocalDate targetDate;

    @Column(name = "forecast_generated_at", nullable = false)
    private LocalDateTime forecastGeneratedAt;

    @Column(name = "predicted_value", nullable = false)
    private Double predictedValue;

    @Column(name = "confidence_lower")
    private Double confidenceLower;

    @Column(name = "confidence_upper")
    private Double confidenceUpper;

    @Column(name = "actual_value")
    private Double actualValue;

    @Column(name = "actual_recorded_at")
    private LocalDateTime actualRecordedAt;

    @Column(name = "absolute_error")
    private Double absoluteError;

    @Column(name = "percent_error")
    private Double percentError;

    @Column(name = "confidence_hit")
    private Boolean confidenceHit;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
