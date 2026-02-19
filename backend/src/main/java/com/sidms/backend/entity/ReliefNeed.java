package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * An individual aid item required by a relief camp.
 * Ported from Disaster-Management-master (SIDMS) Need model.
 * Renamed to ReliefNeed for clarity. imageBase64 replaced by imageUrl
 * (Cloudinary-compatible) — upload handled by CloudinaryService in Step 7.
 */
@Entity
@Table(name = "relief_needs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReliefNeed {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "camp_id", nullable = false)
    private Camp camp;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    /** Food, Medicine, Clothing, Shelter */
    @Column(nullable = false)
    private String category;

    @Column(name = "quantity_required", nullable = false)
    private Integer quantityRequired;

    @Builder.Default
    @Column(name = "quantity_pledged")
    private Integer quantityPledged = 0;

    @Builder.Default
    @Column(name = "quantity_received")
    private Integer quantityReceived = 0;

    /** low, medium, high, critical */
    @Column(nullable = false)
    private String urgency;

    /** Cloudinary URL — replaces DM's imageBase64 column. See Step 7. */
    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
