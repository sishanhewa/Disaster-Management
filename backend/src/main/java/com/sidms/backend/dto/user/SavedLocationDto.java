package com.sidms.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedLocationDto {
    private UUID id;
    private UUID spatialUnitId;
    private String nickname;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private String spatialUnitName;
    private String spatialUnitType;
    private Double lat;
    private Double lng;
}
