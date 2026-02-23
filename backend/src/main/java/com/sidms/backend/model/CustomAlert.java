package com.sidms.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "custom_alerts")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CustomAlert extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private String severity = "info"; // info, warning, critical

    @Column(nullable = false)
    private boolean active = true;
}
