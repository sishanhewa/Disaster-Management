package com.sidms.backend.dto.report;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmReportRequest {
    @NotNull(message = "isConfirmation is required")
    private Boolean isConfirmation;
}
