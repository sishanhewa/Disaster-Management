package com.sidms.backend.dto.content;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertRuleDto {
    private UUID id;
    private String name;
    private String spatialUnitName;
    private UUID spatialUnitId;
    private String parameter;
    private String operator;
    private Double threshold;
    private String timeWindowStart;
    private String timeWindowEnd;
    private Integer cooldownHours;
    private Integer forecastWindowHours;
    private String aggregationType;
    private List<String> channels;
    private String severityThreshold;
    private Boolean isActive;
    private LocalDateTime lastTriggeredAt;
}
