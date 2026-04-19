package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "alert_rules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertRule {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(length = 255, nullable = false)
    private String name;

    @Column(name = "spatial_unit_id", nullable = false)
    private UUID spatialUnitId;

    @Column(length = 50, nullable = false)
    private String parameter;

    @Column(length = 20, nullable = false)
    private String operator;

    @Column(nullable = false)
    private Double threshold;

    @Column(name = "time_window_start", length = 10)
    private String timeWindowStart;

    @Column(name = "time_window_end", length = 10)
    private String timeWindowEnd;

    @Column(name = "cooldown_hours")
    private Integer cooldownHours;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "last_triggered_at")
    private LocalDateTime lastTriggeredAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
