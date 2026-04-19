package com.sidms.backend.dto.disaster;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateWarningRequest {
    @Size(max = 30, message = "Severity must be at most 30 characters")
    private String severity;

    @Size(min = 8, max = 180, message = "Headline must be between 8 and 180 characters")
    private String headline;

    @Size(min = 15, max = 2000, message = "Bulletin text must be between 15 and 2000 characters")
    private String bulletinText;

    @Size(max = 1000, message = "Update text must be at most 1000 characters")
    private String updateText;

    @Size(max = 50, message = "Status must be at most 50 characters")
    private String status;
}
