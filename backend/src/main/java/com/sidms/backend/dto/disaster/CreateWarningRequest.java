package com.sidms.backend.dto.disaster;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class CreateWarningRequest {
    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category must be at most 50 characters")
    private String category;

    @NotBlank(message = "Severity is required")
    @Size(max = 30, message = "Severity must be at most 30 characters")
    private String severity;

    @NotBlank(message = "Headline is required")
    @Size(min = 8, max = 180, message = "Headline must be between 8 and 180 characters")
    private String headline;

    @NotBlank(message = "Bulletin text is required")
    @Size(min = 15, max = 2000, message = "Bulletin text must be between 15 and 2000 characters")
    private String bulletinText;

    @Size(max = 500, message = "Area text must be at most 500 characters")
    private String areaText;

    @Size(max = 2000, message = "Instructions must be at most 2000 characters")
    private String instructions;

    @NotEmpty(message = "At least one target spatial unit is required")
    private List<UUID> targetSpatialUnitIds;

    @NotNull(message = "Expiration is required")
    @Future(message = "Expiration must be in the future")
    private LocalDateTime expiresAt;
}
