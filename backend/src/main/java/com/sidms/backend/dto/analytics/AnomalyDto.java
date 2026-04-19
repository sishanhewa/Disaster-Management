package com.sidms.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnomalyDto {
    private String metric;
    private Integer month;
    private String classification;
    private Double zScore;
}
