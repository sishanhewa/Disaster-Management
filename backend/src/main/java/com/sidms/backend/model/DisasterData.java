package com.sidms.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "disaster_data")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class DisasterData extends BaseEntity {

    @Column(name = "location_name", nullable = false)
    private String locationName;

    @Column(name = "hazard_type", nullable = false)
    private String hazardType; // e.g., "Water Level", "Rainfall"

    @Column(name = "measured_value", nullable = false)
    private Double measuredValue;

    @Column(name = "unit", nullable = false)
    private String unit; // e.g., "m", "mm"

    @Column(name = "danger_level", nullable = false)
    private String dangerLevel; // e.g., "Normal", "Alert", "Minor Flood", "Major Flood"

    @Column(name = "observation_time", nullable = false)
    private LocalDateTime observationTime;
}
