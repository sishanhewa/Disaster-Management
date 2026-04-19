package com.sidms.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedLocationRequest {
    private UUID spatialUnitId;
    private String nickname;
    private Integer sortOrder;
}
