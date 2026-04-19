package com.sidms.backend.dto.disaster;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpatialUnitRef {
    private UUID id;
    private String pcode;
    private String name;
    private String type;
}
