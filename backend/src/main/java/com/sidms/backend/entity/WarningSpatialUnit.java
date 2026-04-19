package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "warning_spatial_units")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarningSpatialUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "warning_id", nullable = false)
    private UUID warningId;

    @Column(name = "spatial_unit_id", nullable = false)
    private UUID spatialUnitId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
