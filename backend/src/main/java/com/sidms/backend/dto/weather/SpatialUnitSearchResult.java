package com.sidms.backend.dto.weather;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpatialUnitSearchResult {
    private UUID id;
    private String pcode;
    private String name;
    private String type;
    private String parentName;
    private Double lat;
    private Double lng;
}
