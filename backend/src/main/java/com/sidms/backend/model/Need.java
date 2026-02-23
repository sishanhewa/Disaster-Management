package com.sidms.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "needs")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Need extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "camp_id", nullable = false)
    private Camp camp;

    @Column(nullable = false)
    private String itemName;

    @Column(nullable = false)
    private String category; // Food, Medicine, Clothing, Shelter

    @Column(nullable = false)
    private int quantityRequired;

    private int quantityPledged = 0;

    private int quantityReceived = 0;

    @Column(nullable = false)
    private String urgency; // low, medium, high, critical

    @Column(columnDefinition = "TEXT")
    private String imageBase64;

    private boolean isActive = true;
}
