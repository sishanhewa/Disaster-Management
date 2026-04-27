package com.sidms.backend.dto.content;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAlertRuleRequest {
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 120, message = "Name must be between 3 and 120 characters")
    private String name;

    @NotNull(message = "Spatial unit is required")
    private UUID spatialUnitId;

    @NotBlank(message = "Parameter is required")
    @Pattern(regexp = "^(temp_c|precipitation_mm|wind_speed_kmh|cape_jkg|humidity_pct|uv_index)$", message = "Invalid parameter")
    private String parameter;

    @NotBlank(message = "Operator is required")
    @Pattern(regexp = "^(>|<|>=|<=)$", message = "Invalid operator")
    private String operator;

    @NotNull(message = "Threshold is required")
    private Double threshold;

    @Pattern(regexp = "^([01]\\d|2[0-3]):[0-5]\\d$", message = "timeWindowStart must be HH:mm")
    @jakarta.annotation.Nullable
    private String timeWindowStart;

    @Pattern(regexp = "^([01]\\d|2[0-3]):[0-5]\\d$", message = "timeWindowEnd must be HH:mm")
    @jakarta.annotation.Nullable
    private String timeWindowEnd;

    @Min(value = 1, message = "Cooldown hours must be at least 1")
    @Max(value = 168, message = "Cooldown hours must be at most 168")
    private Integer cooldownHours;

    @Min(value = 1, message = "Forecast window must be at least 1 hour")
    @Max(value = 168, message = "Forecast window can be at most 168 hours (7 days)")
    private Integer forecastWindowHours;

    @Pattern(regexp = "^(CURRENT|MAX|MIN|AVG|SUM)$", message = "Invalid aggregation type")
    private String aggregationType;

    private List<String> channels; // EMAIL, SMS, IN_APP, PUSH

    @Pattern(regexp = "^(LOW|MODERATE|HIGH|CRITICAL|EXTREME)$", message = "Invalid severity threshold")
    private String severityThreshold;
}
