package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "guide_articles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuideArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(length = 500, nullable = false)
    private String title;

    @Column(length = 500, unique = true, nullable = false)
    private String slug;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String summary;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "cover_image_url", columnDefinition = "TEXT")
    private String coverImageUrl;

    @Column(name = "read_time_min")
    private Integer readTimeMin;

    @Column(length = 100)
    private String category;

    @Column(length = 10)
    private String language;

    @Column(name = "is_published")
    private Boolean isPublished;

    @Column
    private Integer version;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
