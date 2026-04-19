package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reservoir_levels")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservoirLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "reservoir_name", length = 255, nullable = false)
    private String reservoirName;

    @Column(length = 255)
    private String district;

    @Column(name = "water_level")
    private Double waterLevel;

    @Column(name = "capacity_pct")
    private Double capacityPct;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    @Column(name = "scraped_at")
    private LocalDateTime scrapedAt;
}
