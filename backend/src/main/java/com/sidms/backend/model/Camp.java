package com.sidms.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "camps")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Camp extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private Profile manager;

    @Column(nullable = false)
    private String campName;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;
}
