package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "report_photos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "report_id", nullable = false)
    private UUID reportId;

    @Column(name = "cloudinary_url", columnDefinition = "TEXT", nullable = false)
    private String cloudinaryUrl;

    @Column(name = "thumbnail_url", columnDefinition = "TEXT")
    private String thumbnailUrl;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;
}
