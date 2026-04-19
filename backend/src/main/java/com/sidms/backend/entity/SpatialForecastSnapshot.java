package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "spatial_forecast_snapshots")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpatialForecastSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "spatial_unit_id", nullable = false, unique = true)
    private UUID spatialUnitId;

    @Column(name = "source_api", length = 50)
    private String sourceApi;

    @Column(name = "payload", columnDefinition = "TEXT", nullable = false)
    private String payload;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
