package com.sidms.backend.dto.flood;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BasinAlertDto {
    private String basin;
    private String alertLevel;   // NORMAL, ALERT, MINOR_FLOOD, MAJOR_FLOOD
    private int stationCount;
    private double highestWaterLevel;
    private String highestStation;
}
