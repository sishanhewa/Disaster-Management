package com.sidms.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyStatsDto {
    private Integer month;
    private Double avgTemp;
    private Double avgPrecip;
    private Double avgHumidity;
}
