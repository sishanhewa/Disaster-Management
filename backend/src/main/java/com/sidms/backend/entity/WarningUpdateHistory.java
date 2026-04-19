package com.sidms.backend.entity;

import com.sidms.backend.entity.enums.DisasterSeverity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "warning_update_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarningUpdateHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "warning_id", nullable = false)
    private UUID warningId;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "previous_severity", columnDefinition = "disaster_severity")
    private DisasterSeverity previousSeverity;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "new_severity", nullable = false, columnDefinition = "disaster_severity")
    private DisasterSeverity newSeverity;

    @Column(name = "update_text", columnDefinition = "TEXT")
    private String updateText;

    @Column(name = "updated_by")
    private UUID updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
