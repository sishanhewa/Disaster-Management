package com.sidms.backend.dto.sos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateRequest {
    private String status; // EN_ROUTE, ON_SCENE, RESOLVED, etc.
    private String message;
}
