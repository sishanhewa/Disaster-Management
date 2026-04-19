package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "login_attempts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "ip_address", length = 45, nullable = false)
    private String ipAddress;

    @Column(nullable = false)
    private Boolean success;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
