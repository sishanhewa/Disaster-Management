package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "error_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(length = 20, nullable = false)
    private String level;

    @Column(length = 100, nullable = false)
    private String module;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "stack_trace", columnDefinition = "TEXT")
    private String stackTrace;

    @Column(name = "is_resolved")
    private Boolean isResolved;

    @Column(name = "resolved_by")
    private UUID resolvedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
