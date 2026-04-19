package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Field-reported or ArcGIS-sourced disaster incident.
 * Deliberately distinct from DisasterWarning (official DMC/admin bulletins).
 * DisasterIncident = on-the-ground events: affected people, casualties, damage.
 * arcgisObjectId provides deduplication when ingesting from the ArcGIS REST feed.
 * Ported from Disaster-Management-master (SIDMS) DisasterIncident model.
 */
@Entity
@Table(name = "disaster_incidents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DisasterIncident {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String district;

    /** Flood, Landslide, Cyclone, Drought, Tsunami */
    @Column(name = "hazard_type", nullable = false)
    private String hazardType;

    /** low, moderate, high, critical */
    @Builder.Default
    @Column(nullable = false)
    private String severity = "moderate";

    @Builder.Default
    @Column(name = "affected_people")
    private Integer affectedPeople = 0;

    @Builder.Default
    @Column
    private Integer casualties = 0;

    @Builder.Default
    @Column(name = "damage_estimate_lkr")
    private Double damageEstimateLkr = 0.0;

    /** reported, responding, contained, resolved */
    @Builder.Default
    @Column(name = "response_status", nullable = false)
    private String responseStatus = "reported";

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column(name = "reported_by")
    private String reportedBy;

    /** ArcGIS OBJECTID — unique key for deduplication when ingesting from ArcGIS feed. */
    @Column(name = "arcgis_object_id", unique = true)
    private Long arcgisObjectId;

    @Column(name = "incident_date", nullable = false)
    private LocalDateTime incidentDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
