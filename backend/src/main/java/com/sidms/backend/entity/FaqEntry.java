package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "faq_entries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FaqEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String question;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String answer;

    @Column(length = 100)
    private String category;

    @Column(length = 10)
    private String language;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "is_published")
    private Boolean isPublished;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
