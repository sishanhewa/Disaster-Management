package com.sidms.backend.entity;

import com.sidms.backend.entity.enums.DisasterSeverity;
import com.sidms.backend.entity.enums.SosStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * SosEvent represents a citizen-triggered emergency SOS signal.
 * This is the core Event Store entity - decoupled from user notifications.
 *
 * Architecture: EmergencyService creates SosEvents → EventDrivenNotificationService
 * processes them into responder Notifications.
 *
 * Integrates with weather data to provide contextual alerts to responders.
 */
@Entity
@Table(name = "sos_events", indexes = {
    @Index(name = "idx_sos_event_status", columnList = "status"),
    @Index(name = "idx_sos_event_incident", columnList = "incidentId"),
    @Index(name = "idx_sos_event_user", columnList = "userId"),
    @Index(name = "idx_sos_event_created", columnList = "createdAt"),
    @Index(name = "idx_sos_event_location", columnList = "latitude,longitude")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SosEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    /**
     * Link to the original SOS incident.
     */
    @Column(name = "incident_id", nullable = false)
    private UUID incidentId;

    /**
     * User who triggered the SOS.
     */
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    /**
     * User's display name (denormalized for performance).
     */
    @Column(name = "user_name", length = 200)
    private String userName;

    /**
     * User's phone number.
     */
    @Column(name = "user_phone", length = 50)
    private String userPhone;

    /**
     * Contact phone provided during SOS (may differ from user phone).
     */
    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    /**
     * Current status of the SOS.
     */
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private SosStatus status;

    /**
     * Human-readable title for the SOS event.
     * Example: "SOS: Medical Emergency in Dambulla"
     */
    @Column(length = 200, nullable = false)
    private String title;

    /**
     * Detailed description including medical notes and context.
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    /**
     * Medical notes/situational info provided by the user.
     */
    @Column(name = "medical_notes", columnDefinition = "TEXT")
    private String medicalNotes;

    /**
     * Latitude/longitude where SOS was triggered.
     */
    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    /**
     * Nearest spatial unit information.
     */
    @Column(name = "spatial_unit_id")
    private UUID spatialUnitId;

    @Column(name = "spatial_unit_name", length = 200)
    private String spatialUnitName;

    /**
     * Battery level at time of SOS trigger (percentage 0-100).
     */
    @Column(name = "battery_level")
    private Double batteryLevel;

    /**
     * Severity classification - SOS events are typically HIGH or CRITICAL.
     */
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    @Builder.Default
    private DisasterSeverity severity = DisasterSeverity.CRITICAL;

    /**
     * Current weather context at SOS location when triggered.
     * Stored as JSON snapshot for reference.
     */
    @Column(name = "weather_context", columnDefinition = "TEXT")
    private String weatherContext;

    /**
     * Weather severity at location (for responder context).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "weather_severity", length = 20)
    private DisasterSeverity weatherSeverity;

    /**
     * ID of assigned responder (if any).
     */
    @Column(name = "assigned_responder_id")
    private UUID assignedResponderId;

    @Column(name = "assigned_responder_name", length = 200)
    private String assignedResponderName;

    /**
     * Time when responder was assigned.
     */
    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    /**
     * Time when SOS was resolved.
     */
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    /**
     * Whether this event has been processed into notifications.
     */
    @Column(name = "is_processed")
    @Builder.Default
    private Boolean isProcessed = false;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now(java.time.ZoneOffset.UTC);
        if (isProcessed == null) {
            isProcessed = false;
        }
        if (severity == null) {
            severity = DisasterSeverity.CRITICAL;
        }
    }
}
