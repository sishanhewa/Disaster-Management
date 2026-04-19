package com.sidms.backend.dto.report;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateReportStatusRequest {
    @NotBlank(message = "Status is required")
    @Size(max = 50, message = "Status must be at most 50 characters")
    private String status;

    @Size(max = 500, message = "Rejection reason must be at most 500 characters")
    private String rejectionReason;
}
