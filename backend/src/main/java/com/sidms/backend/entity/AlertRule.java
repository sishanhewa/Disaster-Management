package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "alert_rules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertRule {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(length = 255, nullable = false)
    private String name;

    @Column(name = "spatial_unit_id", nullable = false)
    private UUID spatialUnitId;

    @Column(length = 50, nullable = false)
    private String parameter;

    @Column(length = 20, nullable = false)
    private String operator;

    @Column(nullable = false)
    private Double threshold;

    @Column(name = "time_window_start", length = 10)
    private String timeWindowStart;

    @Column(name = "time_window_end", length = 10)
    private String timeWindowEnd;

    @Column(name = "cooldown_hours")
    private Integer cooldownHours;

    @Column(name = "forecast_window_hours")
    private Integer forecastWindowHours;

    @Column(name = "aggregation_type", length = 20)
    private String aggregationType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "channels", columnDefinition = "jsonb")
    private List<String> channels; // ["EMAIL", "SMS", "IN_APP", "PUSH"]

    @Column(name = "severity_threshold", length = 20)
    private String severityThreshold;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "last_triggered_at")
    private LocalDateTime lastTriggeredAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Helper method to get default values for new fields
    public Integer getForecastWindowHours() {
        return forecastWindowHours != null ? forecastWindowHours : 1;
    }

    public String getAggregationType() {
        return aggregationType != null ? aggregationType : "CURRENT";
    }

    public String getSeverityThreshold() {
        return severityThreshold != null ? severityThreshold : "MODERATE";
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now(java.time.ZoneOffset.UTC);
        updatedAt = createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now(java.time.ZoneOffset.UTC);
    }
}
