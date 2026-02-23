package com.sidms.backend.controller;

import com.sidms.backend.model.CustomAlert;
import com.sidms.backend.repository.CustomAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CustomAlertController {

    private final CustomAlertRepository alertRepository;

    // GET all alerts (active first, then by date)
    @GetMapping
    public List<CustomAlert> getAllAlerts() {
        return alertRepository.findAll()
                .stream()
                .sorted((a, b) -> {
                    if (a.isActive() != b.isActive())
                        return a.isActive() ? -1 : 1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .toList();
    }

    // GET active alerts only
    @GetMapping("/active")
    public List<CustomAlert> getActiveAlerts() {
        return alertRepository.findByActiveTrueOrderByCreatedAtDesc();
    }

    // GET single alert by ID
    @GetMapping("/{id}")
    public ResponseEntity<CustomAlert> getAlert(@PathVariable UUID id) {
        return alertRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create new alert
    @PostMapping
    public CustomAlert createAlert(@RequestBody CustomAlert alert) {
        return alertRepository.save(alert);
    }

    // PUT update existing alert
    @PutMapping("/{id}")
    public ResponseEntity<CustomAlert> updateAlert(@PathVariable UUID id, @RequestBody CustomAlert updated) {
        return alertRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(updated.getTitle());
                    existing.setMessage(updated.getMessage());
                    existing.setSeverity(updated.getSeverity());
                    existing.setActive(updated.isActive());
                    return ResponseEntity.ok(alertRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE alert
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(@PathVariable UUID id) {
        if (alertRepository.existsById(id)) {
            alertRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
