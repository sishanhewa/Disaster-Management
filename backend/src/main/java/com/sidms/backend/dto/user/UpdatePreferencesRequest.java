package com.sidms.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePreferencesRequest {
    private String unitTemp;
    private String unitWind;
    private String unitPrecip;
    private String language;
    private String userType;
    private String theme;
    private String dndStart;
    private String dndEnd;
    private Boolean notifEmail;
    private Boolean notifPush;
    private Boolean notifInapp;
}
