package com.sidms.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStatsDto {
    private Long totalUsers;
    private Long activeUsers;
    private Long totalReports;
    private Long pendingReports;
    private Long activeWarnings;
    private Long totalSosIncidents;
}
