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
public class GaugeStationDto {
    private String stationName;
    private String source;
    private String basin;
    private Double waterLevel;
    private Double alertThreshold;
    private Double minorThreshold;
    private Double majorThreshold;
    private String alertLevel;
    private Double lat;
    private Double lng;
    private LocalDateTime recordedAt;
}
