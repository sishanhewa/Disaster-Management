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
public class ResponderLocationMessage {
    private String type; // RESPONDER_LOCATION
    private String responderId;
    private String responderName;
    private Double lat;
    private Double lng;
    private String status; // EN_ROUTE, ON_SCENE
    private Instant timestamp;
}
