package com.sidms.backend.dto.content;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuideArticleDto {
    private UUID id;
    private String title;
    private String slug;
    private String summary;
    private String content;
    private String coverImageUrl;
    private Integer readTimeMin;
    private String category;
    private LocalDateTime updatedAt;
}
