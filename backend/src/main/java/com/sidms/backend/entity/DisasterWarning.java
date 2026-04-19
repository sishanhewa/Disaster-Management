package com.sidms.backend.entity;

import com.sidms.backend.entity.enums.DisasterCategory;
import com.sidms.backend.entity.enums.DisasterSeverity;
import com.sidms.backend.entity.enums.WarningStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "disaster_warnings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DisasterWarning {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "disaster_category")
    private DisasterCategory category;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "disaster_severity")
    private DisasterSeverity severity;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(columnDefinition = "warning_status")
    private WarningStatus status;

    @Column(length = 500, nullable = false)
    private String headline;

    @Column(name = "bulletin_text", columnDefinition = "TEXT", nullable = false)
    private String bulletinText;

    @Column(name = "area_text", columnDefinition = "TEXT")
    private String areaText;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(length = 50)
    private String source;

    @Column(name = "proposed_by_report_id")
    private UUID proposedByReportId;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
