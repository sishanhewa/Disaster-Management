package com.sidms.backend.entity;

import com.sidms.backend.entity.enums.ReportStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "community_reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunityReport {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "spatial_unit_id")
    private UUID spatialUnitId;

    @Column(length = 100, nullable = false)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "severity_assessment", length = 50)
    private String severityAssessment;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    @Column(length = 20)
    private String geohash;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(columnDefinition = "report_status")
    private ReportStatus status;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "linked_warning_id")
    private UUID linkedWarningId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
