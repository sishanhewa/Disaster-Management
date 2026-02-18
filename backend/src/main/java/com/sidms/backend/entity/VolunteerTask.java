package com.sidms.backend.entity;

import com.sidms.backend.entity.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "volunteer_tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VolunteerTask {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(length = 500, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    @Column(name = "radius_km")
    private Double radiusKm;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(columnDefinition = "task_status")
    private TaskStatus status;

    @Column(length = 20)
    private String priority;

    @Column(name = "required_asset_type", length = 100)
    private String requiredAssetType;

    @Column(name = "sos_incident_id")
    private UUID sosIncidentId;

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    @Column(name = "assigned_volunteer")
    private UUID assignedVolunteer;

    @Column(name = "assigned_responder")
    private UUID assignedResponder;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
