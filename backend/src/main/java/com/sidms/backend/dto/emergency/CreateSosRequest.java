package com.sidms.backend.dto.emergency;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSosRequest {
    private Double lat;
    private Double lng;
    private Double batteryLevel;
    private String medicalNotes;
    private String contactPhone;
}
