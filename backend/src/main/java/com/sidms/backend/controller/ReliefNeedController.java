package com.sidms.backend.controller;

import com.sidms.backend.entity.ReliefNeed;
import com.sidms.backend.repository.ReliefNeedRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for relief aid needs per camp.
 * Ported from Disaster-Management-master ApiController (/api/needs → /api/v1/needs).
 */
@RestController
@RequestMapping("/api/v1/needs")
public class ReliefNeedController {

    private final ReliefNeedRepository needRepository;

    public ReliefNeedController(ReliefNeedRepository needRepository) {
        this.needRepository = needRepository;
    }

    @GetMapping
    public ResponseEntity<List<ReliefNeed>> getAll() {
        return ResponseEntity.ok(needRepository.findByIsActiveTrue());
    }

    @GetMapping("/camp/{campId}")
    public ResponseEntity<List<ReliefNeed>> getByCamp(@PathVariable UUID campId) {
        return ResponseEntity.ok(needRepository.findByCamp_Id(campId));
    }

    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<ReliefNeed>> getByManager(@PathVariable UUID managerId) {
        return ResponseEntity.ok(needRepository.findByCamp_Manager_Id(managerId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONDER')")
    public ResponseEntity<ReliefNeed> create(@RequestBody ReliefNeed need) {
        need.setCreatedAt(LocalDateTime.now());
        need.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(needRepository.save(need));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONDER')")
    public ResponseEntity<ReliefNeed> update(@PathVariable UUID id, @RequestBody ReliefNeed updated) {
        return needRepository.findById(id).map(n -> {
            n.setItemName(updated.getItemName());
            n.setCategory(updated.getCategory());
            n.setQuantityRequired(updated.getQuantityRequired());
            n.setQuantityPledged(updated.getQuantityPledged());
            n.setQuantityReceived(updated.getQuantityReceived());
            n.setUrgency(updated.getUrgency());
            n.setImageUrl(updated.getImageUrl());
            n.setIsActive(updated.getIsActive());
            n.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(needRepository.save(n));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONDER')")
    public ResponseEntity<ReliefNeed> updateStatus(@PathVariable UUID id,
                                                    @RequestBody Map<String, Boolean> body) {
        return needRepository.findById(id).map(n -> {
            n.setIsActive(body.get("isActive"));
            n.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(needRepository.save(n));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!needRepository.existsById(id)) return ResponseEntity.notFound().build();
        needRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
