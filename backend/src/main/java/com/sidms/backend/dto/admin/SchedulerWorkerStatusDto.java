package com.sidms.backend.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SchedulerWorkerStatusDto {
    private String workerKey;
    private String displayName;
    private String intervalHint;
    private Boolean enabled;
    private LocalDateTime lastDataAt;
    private Long staleMinutes;
    private String triggerEndpoint;
    private String notes;
}
