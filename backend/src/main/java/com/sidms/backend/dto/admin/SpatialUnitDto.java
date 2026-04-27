package com.sidms.backend.dto.admin;

import com.sidms.backend.entity.enums.SpatialType;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class SpatialUnitDto {
    private UUID id;

    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;

    @Size(max = 255, message = "Sinhala name must not exceed 255 characters")
    private String nameSinhala;

    @Size(max = 255, message = "Tamil name must not exceed 255 characters")
    private String nameTamil;

    @NotBlank(message = "Pcode is required")
    @Pattern(regexp = "^LK[0-9]*$", message = "Pcode must start with LK")
    @Size(max = 20, message = "Pcode must be at most 20 characters")
    private String pcode;

    @NotNull(message = "Spatial type is required")
    private SpatialType type;

    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    private Double lat;

    @DecimalMin(value = "-180.0", message = "Longitude must be >= -180")
    @DecimalMax(value = "180.0", message = "Longitude must be <= 180")
    private Double lng;

    private UUID parentId;

    @Min(value = 0, message = "Population must be >= 0")
    private Integer population;
    private Boolean isTracked;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
