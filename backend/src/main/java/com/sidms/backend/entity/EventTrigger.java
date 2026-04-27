package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * EventTrigger provides deduplication for the alert system.
 * 
 * When an alert rule matches, we create an EventTrigger with a unique hash.
 * Before creating a new WeatherEvent, we check if a trigger already exists
 * for this rule/location/time combination (cooldown period).
 * 
 * This prevents spam - the same condition won't generate multiple events
 * within the cooldown window.
 */
@Entity
@Table(name = "event_triggers", indexes = {
    @Index(name = "idx_trigger_hash", columnList = "eventHash", unique = true),
    @Index(name = "idx_trigger_rule", columnList = "ruleId"),
    @Index(name = "idx_trigger_expires", columnList = "expiresAt"),
    @Index(name = "idx_trigger_created", columnList = "createdAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventTrigger {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    /**
     * Unique hash for deduplication.
     * Format: SHA256(ruleId + spatialUnitId + eventType + timeWindowStart)
     */
    @Column(name = "event_hash", length = 64, nullable = false, unique = true)
    private String eventHash;

    /**
     * Link to the rule that generated this trigger.
     */
    @Column(name = "rule_id", nullable = false)
    private UUID ruleId;

    /**
     * Link to the generated WeatherEvent (once created).
     */
    @Column(name = "event_id")
    private UUID eventId;

    /**
     * The spatial unit this trigger applies to.
     */
    @Column(name = "spatial_unit_id", nullable = false)
    private UUID spatialUnitId;

    /**
     * Type of event this trigger represents.
     */
    @Column(name = "event_type", length = 50, nullable = false)
    private String eventType;

    /**
     * When this trigger was created.
     */
    @Column(name = "triggered_at", nullable = false)
    private LocalDateTime triggeredAt;

    /**
     * When this trigger expires (cooldown ends).
     * After this time, the same condition can trigger again.
     */
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    /**
     * The parameter value that triggered.
     */
    @Column(name = "trigger_value")
    private Double triggerValue;

    /**
     * The threshold that was crossed.
     */
    @Column(name = "trigger_threshold")
    private Double triggerThreshold;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now(java.time.ZoneOffset.UTC);
    }
}
