package com.sidms.backend.dto.weather.advanced;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class AdvancedForecastResponse {
    private String created;
    private Boolean radarIsDown;
    private Map<String, String> symbolCode;
    private String spatialUnitId;
    private String spatialUnitName;
    private String spatialUnitType;

    // Flattened fields for WeatherCard compatibility
    private Double tempC;
    private Double apparentTempC;
    private Double dewPointC;
    private Double humidityPct;
    private Double pressureHpa;
    private Double visibilityM;
    private Double precipitationMm;
    private Double windSpeedKmh;
    private Double windDirectionDeg;
    private Double cloudCoverPct;
    private Double uvIndex;
    private Integer weatherCode;
    private Integer isDay;
    private String sunrise;
    private String sunset;
    private String dataQuality;

    private Map<String, Object> hourly;
    private Map<String, Object> daily;

    private ForecastCurrent current;
    private List<ForecastDayInterval> dayIntervals;
    private List<ForecastShortInterval> shortIntervals;
    private Map<String, String> status;
    private Map<String, Map<String, String>> _links;
}
