package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "marine_advisories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarineAdvisory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "advisory_text", columnDefinition = "TEXT", nullable = false)
    private String advisoryText;

    @Column(name = "coastal_districts", columnDefinition = "jsonb")
    private String coastalDistricts;

    @Column(name = "valid_from")
    private LocalDateTime validFrom;

    @Column(name = "valid_until")
    private LocalDateTime validUntil;

    @Column(name = "scraped_at")
    private LocalDateTime scrapedAt;
}
