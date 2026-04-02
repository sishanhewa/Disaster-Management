package com.sidms.backend.controller;

import com.sidms.backend.dto.emergency.*;
import com.sidms.backend.entity.EmergencyResource;
import com.sidms.backend.security.CustomUserDetails;
import com.sidms.backend.service.EmergencyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class EmergencyController {

    private final EmergencyService emergencyService;

    public EmergencyController(EmergencyService emergencyService) {
        this.emergencyService = emergencyService;
    }

    // ── Emergency Resources ─────────────────────────────────

    @GetMapping("/api/v1/emergency/resources")
    public ResponseEntity<List<EmergencyResource>> listResources(@RequestParam(required = false) String district,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean active) {
        return ResponseEntity.ok(emergencyService.listResources(district, type, active));
    }

    @PostMapping("/api/v1/admin/emergency/resources")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER')")
    public ResponseEntity<EmergencyResource> createResource(@RequestBody EmergencyResource request) {
        return ResponseEntity.ok(emergencyService.createResource(request));
    }

    @PutMapping("/api/v1/admin/emergency/resources/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER')")
    public ResponseEntity<EmergencyResource> updateResource(@PathVariable UUID id,
            @RequestBody EmergencyResource request) {
        return ResponseEntity.ok(emergencyService.updateResource(id, request));
    }

    @DeleteMapping("/api/v1/admin/emergency/resources/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER')")
    public ResponseEntity<Void> deleteResource(@PathVariable UUID id) {
        emergencyService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    // ── SOS endpoints (auth required) ───────────────────────

    @PostMapping("/api/v1/emergency/sos")
    public ResponseEntity<SosResponse> createSos(@RequestBody CreateSosRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(emergencyService.createSos(request, principal.getUser().getId()));
    }

    @GetMapping("/api/v1/emergency/sos/mine")
    public ResponseEntity<List<SosResponse>> getMySosIncidents(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(emergencyService.getMySosIncidents(principal.getUser().getId()));
    }

    // ── Task endpoints (auth required) ──────────────────────

    @GetMapping("/api/v1/emergency/volunteers")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER') or hasRole('GOVT_OFFICIAL')")
    public ResponseEntity<List<VolunteerDto>> listVolunteers() {
        return ResponseEntity.ok(emergencyService.listVolunteers());
    }

    @GetMapping("/api/v1/emergency/tasks")
    public ResponseEntity<List<TaskResponse>> getTasks(
            @RequestParam(required = false, defaultValue = "false") boolean all,
            @AuthenticationPrincipal CustomUserDetails principal) {
        if (all && principal != null) {
            boolean isManager = principal.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                            || a.getAuthority().equals("ROLE_RESPONDER")
                            || a.getAuthority().equals("ROLE_GOVT_OFFICIAL"));
            if (isManager) {
                return ResponseEntity.ok(emergencyService.getAllTasks());
            }
        }
        if (principal != null) {
            return ResponseEntity.ok(emergencyService.getTasksForUser(principal.getUser().getId()));
        }
        return ResponseEntity.ok(emergencyService.getAvailableTasks());
    }

    @PostMapping("/api/v1/emergency/tasks")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER') or hasRole('GOVT_OFFICIAL')")
    public ResponseEntity<TaskResponse> createTask(@RequestBody CreateTaskRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(emergencyService.createTask(request, principal.getUser().getId()));
    }

    @PutMapping("/api/v1/emergency/tasks/{id}/accept")
    public ResponseEntity<TaskResponse> acceptTask(@PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(emergencyService.acceptTask(id, principal.getUser()));
    }

    @PutMapping("/api/v1/emergency/tasks/{id}/complete")
    public ResponseEntity<TaskResponse> completeTask(@PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(emergencyService.completeTask(id, principal.getUser().getId()));
    }

    @PutMapping("/api/v1/admin/emergency/tasks/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER') or hasRole('GOVT_OFFICIAL')")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable UUID id, @RequestBody CreateTaskRequest request) {
        return ResponseEntity.ok(emergencyService.updateTask(id, request));
    }

    @PutMapping("/api/v1/admin/emergency/tasks/{id}/assign")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER') or hasRole('GOVT_OFFICIAL')")
    public ResponseEntity<TaskResponse> assignTask(@PathVariable UUID id,
            @RequestParam UUID volunteerId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(emergencyService.assignTask(id, volunteerId, principal.getUser().getId()));
    }

    @DeleteMapping("/api/v1/admin/emergency/tasks/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER') or hasRole('GOVT_OFFICIAL')")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id) {
        emergencyService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    // ── Admin SOS endpoints ─────────────────────────────────

    @GetMapping("/api/v1/admin/sos")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER') or hasRole('GOVT_OFFICIAL')")
    public ResponseEntity<List<SosResponse>> getActiveSosIncidents() {
        return ResponseEntity.ok(emergencyService.getActiveSosIncidents());
    }

    @PatchMapping("/api/v1/admin/sos/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER') or hasRole('GOVT_OFFICIAL')")
    public ResponseEntity<SosResponse> updateSosStatus(@PathVariable UUID id,
            @RequestParam String status,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(emergencyService.updateSosStatus(id, status, principal.getUser().getId()));
    }

    @PostMapping("/api/v1/admin/sos/{id}/respond")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESPONDER') or hasRole('GOVT_OFFICIAL')")
    public ResponseEntity<SosResponse> respondToSos(@PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(emergencyService.respondToSos(id, principal.getUser().getId()));
    }

    // Allow SOS owner to cancel/close their own SOS
    @DeleteMapping("/api/v1/emergency/sos/{id}")
    public ResponseEntity<SosResponse> closeMySos(@PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(emergencyService.updateSosStatus(id, "RESOLVED", principal.getUser().getId()));
    }
}
