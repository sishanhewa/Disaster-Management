package com.sidms.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "collection_points")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CollectionPoint extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    private String operatingHours;
}
