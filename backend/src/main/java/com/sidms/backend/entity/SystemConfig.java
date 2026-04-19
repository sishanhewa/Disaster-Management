package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "system_configs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(length = 255, unique = true, nullable = false)
    private String key;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String value;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "updated_by")
    private UUID updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
