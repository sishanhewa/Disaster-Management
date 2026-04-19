package com.sidms.backend.controller;

import com.sidms.backend.dto.report.CreateReportRequest;
import com.sidms.backend.dto.report.ConfirmReportRequest;
import com.sidms.backend.dto.report.ReportResponse;
import com.sidms.backend.dto.report.UpdateReportStatusRequest;
import com.sidms.backend.security.CustomUserDetails;
import com.sidms.backend.service.CommunityReportService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
public class ReportController {

    private final CommunityReportService communityReportService;

    public ReportController(CommunityReportService communityReportService) {
        this.communityReportService = communityReportService;
    }

    // ── User endpoints ──────────────────────────────────────

    @PostMapping("/api/v1/reports")
    public ResponseEntity<ReportResponse> createReport(@Valid @RequestBody CreateReportRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(communityReportService.createReport(request, principal.getUser().getId()));
    }

    @GetMapping("/api/v1/reports/public")
    public ResponseEntity<Page<ReportResponse>> getPublicReports(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(communityReportService.getPublicReports(pageable));
    }

    @GetMapping("/api/v1/reports/mine")
    public ResponseEntity<Page<ReportResponse>> getMyReports(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(communityReportService.getMyReports(principal.getUser().getId(), pageable));
    }

    @PostMapping("/api/v1/reports/{id}/confirm")
    public ResponseEntity<Map<String, String>> confirmReport(
            @PathVariable UUID id,
            @Valid @RequestBody ConfirmReportRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        communityReportService.confirmReport(id, principal.getUser().getId(), request.getIsConfirmation());
        return ResponseEntity.ok(Map.of("message", request.getIsConfirmation() ? "Report confirmed" : "Report denied"));
    }

    @PutMapping("/api/v1/reports/{id}")
    public ResponseEntity<ReportResponse> updateMyReport(
            @PathVariable UUID id,
            @Valid @RequestBody CreateReportRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(communityReportService.updateMyReport(id, principal.getUser().getId(), request));
    }

    @DeleteMapping("/api/v1/reports/{id}")
    public ResponseEntity<Void> deleteMyReport(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        communityReportService.deleteMyReport(id, principal.getUser().getId());
        return ResponseEntity.noContent().build();
    }

    // ── Admin endpoints ─────────────────────────────────────

    @GetMapping("/api/v1/admin/reports")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ReportResponse>> getAdminReports(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) UUID spatialUnitId,
            @RequestParam(required = false, name = "q") String query) {
        return ResponseEntity.ok(
                communityReportService.getAdminReports(pageable, status, category, severity, spatialUnitId, query));
    }

    @PutMapping("/api/v1/admin/reports/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResponse> updateReportStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateReportStatusRequest request) {
        return ResponseEntity
                .ok(communityReportService.updateReportStatus(id, request.getStatus(), request.getRejectionReason()));
    }

    @DeleteMapping("/api/v1/admin/reports/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReportAsAdmin(@PathVariable UUID id) {
        communityReportService.deleteReportAsAdmin(id);
        return ResponseEntity.noContent().build();
    }
}
