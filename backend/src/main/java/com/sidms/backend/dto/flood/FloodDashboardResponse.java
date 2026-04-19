package com.sidms.backend.dto.flood;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FloodDashboardResponse {
    private List<GaugeStationDto> gauges;
    private List<RivernetDeviceDto> rivernetDevices;
    private Integer totalStations;
    private Integer alertCount;
    private Integer minorFloodCount;
    private Integer majorFloodCount;
}
