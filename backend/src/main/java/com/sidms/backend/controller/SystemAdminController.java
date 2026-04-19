package com.sidms.backend.controller;

import com.sidms.backend.dto.admin.SetSystemConfigRequest;
import com.sidms.backend.entity.ErrorLog;
import com.sidms.backend.entity.SystemConfig;
import com.sidms.backend.security.CustomUserDetails;
import com.sidms.backend.service.SystemAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/system")
@PreAuthorize("hasRole('ADMIN')")
public class SystemAdminController {

    private final SystemAdminService systemAdminService;

    public SystemAdminController(SystemAdminService systemAdminService) {
        this.systemAdminService = systemAdminService;
    }

    @GetMapping("/config")
    public ResponseEntity<List<SystemConfig>> getAllConfigs() {
        return ResponseEntity.ok(systemAdminService.getAllConfigs());
    }

    @PutMapping("/config")
    public ResponseEntity<SystemConfig> setSystemConfig(@RequestBody SetSystemConfigRequest request,
                                                        @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(systemAdminService.setSystemConfig(
                request.getKey(),
                request.getValue(),
                request.getDescription(),
                principal.getUser().getId()));
    }

    @GetMapping("/errors")
    public ResponseEntity<List<ErrorLog>> getRecentErrors(@RequestParam(required = false, defaultValue = "50") Integer limit) {
        return ResponseEntity.ok(systemAdminService.getRecentErrors(limit));
    }

    @PutMapping("/errors/{id}/resolve")
    public ResponseEntity<ErrorLog> resolveError(@PathVariable UUID id,
                                                  @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(systemAdminService.resolveError(id, principal.getUser().getId()));
    }

    @GetMapping("/metrics/circuit-breaker")
    public ResponseEntity<java.util.Map<String, Object>> getCircuitBreakerStats() {
        return ResponseEntity.ok(systemAdminService.getCircuitBreakerStats());
    }

    @GetMapping("/metrics/api-keys")
    public ResponseEntity<java.util.Map<String, Object>> getApiKeyStats() {
        return ResponseEntity.ok(systemAdminService.getApiKeyStats());
    }

    @GetMapping("/metrics/fallback")
    public ResponseEntity<java.util.Map<String, Object>> getFallbackStats() {
        return ResponseEntity.ok(systemAdminService.getFallbackStats());
    }

    @PostMapping("/metrics/circuit-breaker/{serviceName}/reset")
    public ResponseEntity<java.util.Map<String, String>> resetCircuitBreaker(@PathVariable String serviceName) {
        systemAdminService.resetCircuitBreaker(serviceName);
        return ResponseEntity.ok(java.util.Map.of("message", "Circuit breaker reset for " + serviceName));
    }
}
