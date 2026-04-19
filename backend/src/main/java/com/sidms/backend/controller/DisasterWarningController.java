package com.sidms.backend.controller;

import com.sidms.backend.dto.disaster.*;
import com.sidms.backend.entity.DisasterWarning;
import com.sidms.backend.security.CustomUserDetails;
import com.sidms.backend.service.DisasterWarningService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
public class DisasterWarningController {

    private final DisasterWarningService disasterWarningService;

    public DisasterWarningController(DisasterWarningService disasterWarningService) {
        this.disasterWarningService = disasterWarningService;
    }

    // ── Public endpoints ────────────────────────────────────

    @GetMapping("/api/v1/disasters/warnings/active")
    public ResponseEntity<List<WarningResponse>> getActiveWarnings() {
        return ResponseEntity.ok(disasterWarningService.getAllActiveWarnings());
    }

    @GetMapping("/api/v1/disasters/warnings/{id}")
    public ResponseEntity<WarningResponse> getWarningById(@PathVariable UUID id) {
        return ResponseEntity.ok(disasterWarningService.getWarningById(id));
    }

    // ── Admin endpoints ─────────────────────────────────────

    @PostMapping("/api/v1/admin/warnings")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER') or hasRole('GOVT_OFFICIAL')")
    public ResponseEntity<WarningResponse> createWarning(@Valid @RequestBody CreateWarningRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(disasterWarningService.createWarning(request, principal.getUser().getId()));
    }

    @PutMapping("/api/v1/admin/warnings/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER') or hasRole('GOVT_OFFICIAL')")
    public ResponseEntity<WarningResponse> updateWarning(@PathVariable UUID id,
            @Valid @RequestBody UpdateWarningRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(disasterWarningService.updateWarning(id, request, principal.getUser().getId()));
    }

    @DeleteMapping("/api/v1/admin/warnings/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER') or hasRole('GOVT_OFFICIAL')")
    public ResponseEntity<Map<String, String>> resolveWarning(@PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        disasterWarningService.resolveWarning(id, principal.getUser().getId());
        return ResponseEntity.ok(Map.of("message", "Warning resolved successfully"));
    }

    @DeleteMapping("/api/v1/admin/warnings/{id}/hard")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER')")
    public ResponseEntity<Void> deleteWarning(@PathVariable UUID id) {
        disasterWarningService.deleteWarning(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/v1/admin/warnings/proposed")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER') or hasRole('GOVT_OFFICIAL')")
    public ResponseEntity<Page<DisasterWarning>> getProposedWarnings(Pageable pageable) {
        return ResponseEntity.ok(disasterWarningService.getProposedWarnings(pageable));
    }

    @PostMapping("/api/v1/admin/warnings/{id}/approve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER') or hasRole('GOVT_OFFICIAL')")
    public ResponseEntity<WarningResponse> approveProposedWarning(@PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(disasterWarningService.approveProposedWarning(id, principal.getUser().getId()));
    }

    @PostMapping("/api/v1/admin/warnings/{id}/reject")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER') or hasRole('GOVT_OFFICIAL')")
    public ResponseEntity<Map<String, String>> rejectProposedWarning(@PathVariable UUID id,
            @Valid @RequestBody RejectProposedWarningRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        disasterWarningService.rejectProposedWarning(id, principal.getUser().getId(), request.getReason());
        return ResponseEntity.ok(Map.of("message", "Proposed warning rejected"));
    }

    @GetMapping("/api/v1/admin/warnings")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER') or hasRole('GOVT_OFFICIAL')")
    public ResponseEntity<Page<DisasterWarning>> getAllWarnings(Pageable pageable) {
        return ResponseEntity.ok(disasterWarningService.getAllWarnings(pageable));
    }
}
