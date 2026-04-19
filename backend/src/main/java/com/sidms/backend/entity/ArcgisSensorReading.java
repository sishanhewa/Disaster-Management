package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Raw sensor reading ingested from the ArcGIS REST API (water level / rainfall).
 * Analogous to FloodGaugeReading (Rivernet/DMC source) but kept separate
 * to preserve source attribution and allow independent display in the UI.
 * Ported from Disaster-Management-master (SIDMS) DisasterData model.
 */
@Entity
@Table(name = "arcgis_sensor_readings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArcgisSensorReading {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "location_name", nullable = false)
    private String locationName;

    /** e.g. "Water Level", "Rainfall" */
    @Column(name = "hazard_type", nullable = false)
    private String hazardType;

    @Column(name = "measured_value", nullable = false)
    private Double measuredValue;

    /** e.g. "m", "mm" */
    @Column(nullable = false)
    private String unit;

    /** Normal, Alert, Minor Flood, Major Flood */
    @Column(name = "danger_level", nullable = false)
    private String dangerLevel;

    @Column(name = "observation_time", nullable = false)
    private LocalDateTime observationTime;

    @Column(name = "fetched_at")
    private LocalDateTime fetchedAt;
}
