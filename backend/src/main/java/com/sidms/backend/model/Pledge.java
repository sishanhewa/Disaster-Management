package com.sidms.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import java.util.UUID;

@Entity
@Table(name = "pledges")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Pledge extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id")
    private Profile donor;

    // For anonymous or direct details input during pledge
    private String donorName;
    private String donorEmail;
    private String donorPhone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "need_id", nullable = false)
    private Need need;

    @Column(nullable = false)
    private int quantity;

    private String status = "pending"; // pending, collected, delivered

    @Column(unique = true, updatable = false)
    private UUID qrCodeUuid = UUID.randomUUID();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_point_id")
    private CollectionPoint collectionPoint;
}
