package com.sidms.backend.dto.disaster;

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
public class WarningResponse {
    private UUID id;
    private String category;
    private String severity;
    private String status;
    private String headline;
    private String bulletinText;
    private String areaText;
    private String instructions;
    private List<SpatialUnitRef> targetedUnits;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
}
