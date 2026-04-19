package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "emergency_resources")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyResource {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "spatial_unit_id")
    private UUID spatialUnitId;

    @Column(length = 100, nullable = false)
    private String district;

    @Column(name = "resource_type", length = 100, nullable = false)
    private String resourceType;

    @Column(length = 255, nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 50, nullable = false)
    private String phone;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
