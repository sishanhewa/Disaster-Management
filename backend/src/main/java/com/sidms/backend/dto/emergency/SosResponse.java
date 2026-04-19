package com.sidms.backend.dto.emergency;

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
public class SosResponse {
    private UUID id;
    private UUID userId;
    private String userDisplayName;
    private String userPhone;
    private String status;
    private Double lat;
    private Double lng;
    private Double batteryLevel;
    private String medicalNotes;
    private String contactPhone;
    private UUID assignedTo;
    private String assignedToName;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private List<SosTimelineDto> timeline;
}
