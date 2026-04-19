package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "map_bookmarks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MapBookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(length = 255, nullable = false)
    private String name;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    @Column
    private Integer zoom;

    @Column(name = "active_layers", columnDefinition = "jsonb")
    private String activeLayers;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
