package com.sidms.backend.dto.map;

import com.sidms.backend.dto.disaster.WarningResponse;
import com.sidms.backend.dto.report.ReportResponse;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class LiveMapDataDto {
    private List<WarningResponse> activeWarnings;
    private List<ReportResponse> verifiedReports;
}
