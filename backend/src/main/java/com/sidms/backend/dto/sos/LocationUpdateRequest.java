package com.sidms.backend.dto.sos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationUpdateRequest {
    private Double lat;
    private Double lng;
    private Double accuracy; // GPS accuracy in meters
    private Double batteryLevel;
    private String responderName; // For responder updates
    private String status; // EN_ROUTE, ON_SCENE, etc.
}
