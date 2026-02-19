package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Relief camp managed by a user with the responder/admin role.
 * Ported from Disaster-Management-master (SIDMS) Camp model.
 * FK manager_id → CS users table (replaces DM's Profile reference).
 */
@Entity
@Table(name = "relief_camps")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Camp {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "manager_id")
    private User manager;

    @Column(name = "camp_name", nullable = false)
    private String campName;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column
    private Integer capacity;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
