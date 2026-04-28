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
public class NotificationDto {
    private UUID id;
    private String type;
    private String title;
    private String body;
    private UUID spatialUnitId;
    private UUID warningId;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
