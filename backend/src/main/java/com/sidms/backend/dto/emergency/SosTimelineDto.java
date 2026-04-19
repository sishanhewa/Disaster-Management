package com.sidms.backend.dto.emergency;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SosTimelineDto {
    private String action;
    private String actorName;
    private String notes;
    private LocalDateTime createdAt;
}
