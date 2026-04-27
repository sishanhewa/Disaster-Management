package com.sidms.backend.dto.admin;

import com.sidms.backend.entity.enums.WeatherNodeDensity;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class WeatherNodeDto {
    private UUID id;

    @NotBlank(message = "Code is required")
    @Size(max = 50, message = "Code must not exceed 50 characters")
    private String code;

    @NotBlank(message = "Grid key is required")
    @Size(max = 64, message = "Grid key must be at most 64 characters")
    private String gridKey;

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    private Double lat;

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be >= -180")
    @DecimalMax(value = "180.0", message = "Longitude must be <= 180")
    private Double lng;

    @Min(value = -500, message = "Elevation must be >= -500")
    private Integer elevationM;

    @NotNull(message = "Zone density is required")
    private WeatherNodeDensity zoneDensity;
    private Boolean isCoastal;
    private Boolean isMountain;

    @DecimalMin(value = "0.0", message = "Distance to coast must be >= 0")
    private Double distanceToCoastKm;
    private Boolean isActive;
    private Boolean isVolatile;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
