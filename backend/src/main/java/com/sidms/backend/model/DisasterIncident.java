package com.sidms.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "disaster_incidents")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class DisasterIncident extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(name = "district", nullable = false)
    private String district;

    @Column(name = "hazard_type", nullable = false)
    private String hazardType; // Flood, Landslide, Cyclone, Drought, Tsunami

    @Column(nullable = false)
    private String severity = "moderate"; // low, moderate, high, critical

    @Column(name = "affected_people")
    private Integer affectedPeople = 0;

    @Column(name = "casualties")
    private Integer casualties = 0;

    @Column(name = "damage_estimate_lkr")
    private Double damageEstimateLkr = 0.0;

    @Column(name = "response_status", nullable = false)
    private String responseStatus = "reported"; // reported, responding, contained, resolved

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "reported_by")
    private String reportedBy;

    @Column(name = "incident_date", nullable = false)
    private LocalDateTime incidentDate;
}
