package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * A donation pledge made by a donor against a specific ReliefNeed.
 * Ported from Disaster-Management-master (SIDMS) Pledge model.
 * Renamed to ReliefPledge. donor_id FK → CS users table (replaces DM Profile).
 */
@Entity
@Table(name = "relief_pledges")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReliefPledge {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    /** Nullable — pledge may come from an anonymous donor */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donor_id")
    private User donor;

    @Column(name = "donor_name")
    private String donorName;

    @Column(name = "donor_email")
    private String donorEmail;

    @Column(name = "donor_phone")
    private String donorPhone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "need_id", nullable = false)
    private ReliefNeed need;

    @Column(nullable = false)
    private Integer quantity;

    /** pending, collected, delivered */
    @Builder.Default
    @Column
    private String status = "pending";

    @Column(name = "qr_code_uuid", unique = true, updatable = false,
            columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID qrCodeUuid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_point_id")
    private CollectionPoint collectionPoint;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
