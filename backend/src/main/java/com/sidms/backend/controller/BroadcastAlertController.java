package com.sidms.backend.controller;

import com.sidms.backend.entity.BroadcastAlert;
import com.sidms.backend.repository.BroadcastAlertRepository;
import com.sidms.backend.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for admin-issued broadcast alert messages.
 * Ported from Disaster-Management-master CustomAlertController (/api/alerts → /api/v1/broadcast-alerts).
 * Renamed to BroadcastAlert to avoid confusion with CS's alert_rules (user threshold triggers).
 *
 * GET /active — public (permitAll in SecurityConfig)
 * GET /       — ADMIN only (includes inactive)
 * POST/PUT/DELETE — ADMIN only
 */
@RestController
@RequestMapping("/api/v1/broadcast-alerts")
public class BroadcastAlertController {

    private final BroadcastAlertRepository repo;

    public BroadcastAlertController(BroadcastAlertRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/active")
    public ResponseEntity<List<BroadcastAlert>> getActive() {
        return ResponseEntity.ok(repo.findByIsActiveTrueOrderByCreatedAtDesc());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BroadcastAlert>> getAll() {
        return ResponseEntity.ok(repo.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BroadcastAlert> getById(@PathVariable UUID id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BroadcastAlert> create(@RequestBody BroadcastAlert alert,
            @AuthenticationPrincipal CustomUserDetails principal) {
        alert.setCreatedBy(principal.getUser().getId());
        alert.setCreatedAt(LocalDateTime.now());
        alert.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(repo.save(alert));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BroadcastAlert> update(@PathVariable UUID id,
                                                  @RequestBody BroadcastAlert updated) {
        return repo.findById(id).map(a -> {
            a.setTitle(updated.getTitle());
            a.setMessage(updated.getMessage());
            a.setSeverity(updated.getSeverity());
            a.setIsActive(updated.getIsActive());
            a.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(repo.save(a));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
