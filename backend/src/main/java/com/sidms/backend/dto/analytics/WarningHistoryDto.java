package com.sidms.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarningHistoryDto {
    private Integer totalWarnings;
    private Integer floodWarnings;
    private Integer landslideWarnings;
    private LocalDateTime lastWarningAt;
}
