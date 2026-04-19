package com.sidms.backend.entity;

import com.sidms.backend.entity.enums.AlertLevel;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "flood_gauge_readings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FloodGaugeReading {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(length = 50, nullable = false)
    private String source;

    @Column(name = "station_name", length = 255, nullable = false)
    private String stationName;

    @Column(length = 255)
    private String basin;

    @Column(name = "water_level")
    private Double waterLevel;

    @Column
    private Double rainfall;

    @Column(name = "alert_threshold")
    private Double alertThreshold;

    @Column(name = "minor_threshold")
    private Double minorThreshold;

    @Column(name = "major_threshold")
    private Double majorThreshold;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "alert_level", columnDefinition = "alert_level")
    private AlertLevel alertLevel;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    @Column(name = "fetched_at")
    private LocalDateTime fetchedAt;
}
