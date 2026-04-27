package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * NotificationDelivery tracks the delivery status of a notification
 * across different channels (EMAIL, SMS, IN_APP, PUSH).
 * 
 * This enables:
 * - Retry logic for failed deliveries
 * - Delivery analytics
 * - Channel-specific failure handling
 * - User preference respect
 */
@Entity
@Table(name = "notification_deliveries", indexes = {
    @Index(name = "idx_delivery_notification", columnList = "notificationId"),
    @Index(name = "idx_delivery_channel_status", columnList = "channel,status"),
    @Index(name = "idx_delivery_user", columnList = "userId"),
    @Index(name = "idx_delivery_created", columnList = "createdAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDelivery {

    public enum Channel {
        IN_APP, EMAIL, SMS, PUSH
    }

    public enum Status {
        PENDING, SENT, DELIVERED, FAILED, RETRYING
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "notification_id", nullable = false)
    private UUID notificationId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private Channel channel;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    @Builder.Default
    private Status status = Status.PENDING;

    /**
     * Number of delivery attempts made.
     */
    @Column(name = "attempt_count")
    @Builder.Default
    private Integer attemptCount = 0;

    /**
     * Last attempt timestamp.
     */
    @Column(name = "last_attempt_at")
    private LocalDateTime lastAttemptAt;

    /**
     * When the notification was successfully delivered.
     */
    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    /**
     * Next retry timestamp (for failed deliveries).
     */
    @Column(name = "next_retry_at")
    private LocalDateTime nextRetryAt;

    /**
     * Error message if delivery failed.
     */
    @Column(name = "error_message", length = 500)
    private String errorMessage;

    /**
     * External provider message ID (for tracking).
     */
    @Column(name = "provider_message_id", length = 200)
    private String providerMessageId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now(java.time.ZoneOffset.UTC);
        updatedAt = createdAt;
        if (attemptCount == null) {
            attemptCount = 0;
        }
        if (status == null) {
            status = Status.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now(java.time.ZoneOffset.UTC);
    }
}
