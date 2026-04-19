package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "report_confirmations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportConfirmation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "report_id", nullable = false)
    private UUID reportId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "is_confirmation", nullable = false)
    private Boolean isConfirmation;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
