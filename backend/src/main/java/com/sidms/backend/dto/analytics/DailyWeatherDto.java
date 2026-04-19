package com.sidms.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyWeatherDto {
    private LocalDate date;
    private Double tempMean;
    private Double precipMm;
    private Double humidityMean;
}
