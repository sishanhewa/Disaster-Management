package com.sidms.backend.dto.weather.advanced;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class ForecastShortInterval {
    private Map<String, Object> symbol;
    private Map<String, String> symbolCode;
    private Map<String, Double> precipitation;
    private Map<String, Double> temperature;
    private Map<String, Double> wind;
    private Map<String, Double> feelsLike;
    private Map<String, Double> pressure;
    private Map<String, Double> uvIndex;
    private Map<String, Double> cloudCover;
    private Map<String, Double> humidity;
    private Map<String, Double> dewPoint;
    private String start;
    private String end;
}
