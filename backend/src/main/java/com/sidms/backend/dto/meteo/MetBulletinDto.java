package com.sidms.backend.dto.meteo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MetBulletinDto {
    private UUID id;
    private String spatialUnitName;
    private String bulletinText;
    private LocalDate bulletinDate;
    private LocalDateTime scrapedAt;
}
