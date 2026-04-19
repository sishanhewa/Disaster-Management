package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "met_bulletins")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MetBulletin {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "spatial_unit_id")
    private UUID spatialUnitId;

    @Column(name = "bulletin_text", columnDefinition = "TEXT", nullable = false)
    private String bulletinText;

    @Column(name = "bulletin_date")
    private LocalDate bulletinDate;

    @Column(name = "scraped_at")
    private LocalDateTime scrapedAt;
}
