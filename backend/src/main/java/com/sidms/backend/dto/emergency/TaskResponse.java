package com.sidms.backend.dto.emergency;

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
public class TaskResponse {
    private UUID id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private Double lat;
    private Double lng;
    private Double radiusKm;
    private String requiredAssetType;
    private UUID sosIncidentId;
    private UUID assignedVolunteerId;
    private UUID assignedResponderId;
    private String assignedVolunteerName;
    private String assignedResponderName;
    private UUID createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime completedAt;
}
