package com.sidms.backend.entity;

import com.sidms.backend.entity.enums.DisasterSeverity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * WeatherEvent represents a real-world weather occurrence detected by the alert engine.
 * This is the core Event Store entity - decoupled from user notifications.
 * 
 * Architecture: AlertRuleEvaluator creates WeatherEvents → NotificationService
 * processes them into user-facing Notifications.
 */
@Entity
@Table(name = "weather_events", indexes = {
    @Index(name = "idx_weather_event_type", columnList = "eventType"),
    @Index(name = "idx_weather_event_spatial", columnList = "spatialUnitId"),
    @Index(name = "idx_weather_event_timerange", columnList = "startTime,endTime"),
    @Index(name = "idx_weather_event_created", columnList = "createdAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    /**
     * Event classification - determines messaging and urgency.
     * Examples: HEAVY_RAIN, HIGH_WIND, TEMPERATURE_SPIKE, FLOOD_RISK
     */
    @Column(name = "event_type", length = 50, nullable = false)
    private String eventType;

    /**
     * Human-readable title for the event.
     * Example: "Heavy Rain Expected in Colombo"
     */
    @Column(length = 200, nullable = false)
    private String title;

    /**
     * Detailed description of the event.
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    /**
     * Severity level - matches DisasterSeverity enum for consistency.
     */
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private DisasterSeverity severity;

    /**
     * The spatial unit where this event occurred.
     */
    @Column(name = "spatial_unit_id", nullable = false)
    private UUID spatialUnitId;

    /**
     * Name of the spatial unit (denormalized for performance).
     */
    @Column(name = "spatial_unit_name", length = 200)
    private String spatialUnitName;

    /**
     * Type of spatial unit: COUNTRY, PROVINCE, DISTRICT, etc.
     */
    @Column(name = "spatial_unit_type", length = 50)
    private String spatialUnitType;

    /**
     * Latitude/longitude for map display.
     */
    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    /**
     * The weather parameter that triggered this event.
     * Examples: precipitation_mm, temp_c, wind_speed_kmh
     */
    @Column(name = "trigger_parameter", length = 50)
    private String triggerParameter;

    /**
     * The value that triggered the event.
     */
    @Column(name = "trigger_value")
    private Double triggerValue;

    /**
     * The threshold that was crossed.
     */
    @Column(name = "trigger_threshold")
    private Double triggerThreshold;

    /**
     * Event time range - when the condition is expected/happening.
     */
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    /**
     * Link to the AlertRule that generated this event (if applicable).
     */
    @Column(name = "source_rule_id")
    private UUID sourceRuleId;

    /**
     * Link to a DisasterWarning if this event corresponds to one.
     */
    @Column(name = "warning_id")
    private UUID warningId;

    /**
     * Raw forecast data snapshot (JSON) for analytics/debugging.
     */
    @Column(name = "forecast_snapshot", columnDefinition = "TEXT")
    private String forecastSnapshot;

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
    }
}
