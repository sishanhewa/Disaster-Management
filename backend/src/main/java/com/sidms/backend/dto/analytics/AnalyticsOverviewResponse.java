package com.sidms.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsOverviewResponse {
    private UUID spatialUnitId;
    private String spatialUnitName;
    private String type;
    private List<DailyWeatherDto> historicalTrend;
    private List<ForecastDto> forecast;
    private List<AnomalyDto> anomalies;
    private List<MonthlyStatsDto> monthlyAverages;
    private WarningHistoryDto warningHistory;
}
