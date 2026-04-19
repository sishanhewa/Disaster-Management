package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "spatial_unit_weather_node_mappings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpatialUnitWeatherNodeMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "spatial_unit_id", nullable = false)
    private UUID spatialUnitId;

    @Column(name = "weather_node_id", nullable = false)
    private UUID weatherNodeId;

    @Column(nullable = false)
    private Integer rank;

    @Column(name = "distance_km", nullable = false)
    private Double distanceKm;

    @Column(name = "idw_weight", nullable = false)
    private Double idwWeight;

    @Column(name = "is_primary")
    private Boolean isPrimary;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
