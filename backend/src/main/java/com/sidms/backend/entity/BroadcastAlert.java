package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Admin-issued broadcast alert message displayed site-wide or to user segments.
 * Ported from Disaster-Management-master (SIDMS) CustomAlert model.
 * Renamed to BroadcastAlert to clearly distinguish from AlertRule
 * (user-owned weather-threshold trigger rules) in the CS codebase.
 */
@Entity
@Table(name = "broadcast_alerts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BroadcastAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    /** info, warning, critical */
    @Builder.Default
    @Column(nullable = false)
    private String severity = "info";

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    /** Admin user who created this alert */
    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
