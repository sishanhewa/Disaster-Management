package com.sidms.backend.dto.flood;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RivernetDeviceDto {
    private String deviceKey;
    private String name;
    private String basin;
    private Boolean isOnline;
    private LocalDateTime lastSyncedAt;
}
