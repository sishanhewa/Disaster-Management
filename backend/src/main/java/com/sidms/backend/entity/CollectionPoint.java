package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Physical drop-off location where donors deliver pledged relief items.
 * Ported from Disaster-Management-master (SIDMS) CollectionPoint model.
 */
@Entity
@Table(name = "collection_points")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollectionPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(name = "operating_hours")
    private String operatingHours;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
