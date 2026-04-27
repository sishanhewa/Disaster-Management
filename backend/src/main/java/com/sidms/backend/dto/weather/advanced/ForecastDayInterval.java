package com.sidms.backend.dto.weather.advanced;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class ForecastDayInterval {
    private String start;
    private String end;
    private String twentyFourHourSymbol;
    private List<String> twelveHourSymbols;
    private List<String> sixHourSymbols;
    private String symbolConfidence;
    private Map<String, Double> precipitation;
    private Map<String, Double> temperature;
    private Map<String, Double> wind;
    private Map<String, Double> uvIndex;
}
