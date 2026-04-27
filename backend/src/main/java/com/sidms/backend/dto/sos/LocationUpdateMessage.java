package com.sidms.backend.dto.sos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationUpdateMessage {
    private String type; // VICTIM_LOCATION, RESPONDER_LOCATION
    private String userId;
    private Double lat;
    private Double lng;
    private Double accuracy;
    private Double batteryLevel;
    private Instant timestamp;
}
