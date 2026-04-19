package com.sidms.backend.dto.emergency;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskRequest {
    private String title;
    private String description;
    private Double lat;
    private Double lng;
    private Double radiusKm;
    private String priority;
    private String requiredAssetType;
    private UUID sosIncidentId;
}
