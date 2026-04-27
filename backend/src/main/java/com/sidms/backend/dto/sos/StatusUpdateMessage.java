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
public class StatusUpdateMessage {
    private String type; // STATUS_UPDATE
    private String status;
    private String message;
    private String updatedBy;
    private Instant timestamp;
}
