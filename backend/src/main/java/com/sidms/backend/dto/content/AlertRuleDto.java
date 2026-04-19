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
public class AlertRuleDto {
    private UUID id;
    private String name;
    private String spatialUnitName;
    private String parameter;
    private String operator;
    private Double threshold;
    private Integer cooldownHours;
    private Boolean isActive;
    private LocalDateTime lastTriggeredAt;
}
