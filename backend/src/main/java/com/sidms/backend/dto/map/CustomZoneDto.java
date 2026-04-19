package com.sidms.backend.dto.map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomZoneDto {
    private UUID id;
    private String name;
    private String zoneType;
    private String geojsonPolygon;
    private String colorHex;
    private Double opacity;
}
