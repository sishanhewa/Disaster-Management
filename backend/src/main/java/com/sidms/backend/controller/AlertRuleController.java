package com.sidms.backend.controller;

import com.sidms.backend.dto.content.AlertRuleDto;
import com.sidms.backend.dto.content.CreateAlertRuleRequest;
import com.sidms.backend.security.CustomUserDetails;
import com.sidms.backend.service.AlertRuleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/alert-rules")
public class AlertRuleController {

    private final AlertRuleService alertRuleService;

    public AlertRuleController(AlertRuleService alertRuleService) {
        this.alertRuleService = alertRuleService;
    }

    @GetMapping
    public ResponseEntity<List<AlertRuleDto>> getMyAlertRules(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(alertRuleService.getMyAlertRules(principal.getUser().getId()));
    }

    @PostMapping
    public ResponseEntity<AlertRuleDto> createAlertRule(@Valid @RequestBody CreateAlertRuleRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(alertRuleService.createAlertRule(request, principal.getUser().getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlertRuleDto> updateAlertRule(@PathVariable UUID id,
            @Valid @RequestBody CreateAlertRuleRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(alertRuleService.updateAlertRule(id, request, principal.getUser().getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlertRule(@PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        alertRuleService.deleteAlertRule(id, principal.getUser().getId());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<AlertRuleDto> toggleAlertRule(@PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(alertRuleService.toggleAlertRule(id, principal.getUser().getId()));
    }
}
