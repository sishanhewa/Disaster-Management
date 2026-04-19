package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "custom_zones")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomZone {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(length = 255, nullable = false)
    private String name;

    @Column(name = "zone_type", length = 100, nullable = false)
    private String zoneType;

    @Column(name = "geojson_polygon", columnDefinition = "TEXT", nullable = false)
    private String geojsonPolygon;

    @Column(name = "color_hex", length = 10)
    private String colorHex;

    @Column
    private Double opacity;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
