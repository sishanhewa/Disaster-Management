package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "push_subscriptions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PushSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String endpoint;

    @Column(name = "p256dh_key", columnDefinition = "TEXT", nullable = false)
    private String p256dhKey;

    @Column(name = "auth_key", columnDefinition = "TEXT", nullable = false)
    private String authKey;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;
}
