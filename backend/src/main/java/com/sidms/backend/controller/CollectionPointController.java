package com.sidms.backend.controller;

import com.sidms.backend.entity.CollectionPoint;
import com.sidms.backend.repository.CollectionPointRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for donor drop-off collection points.
 * Ported from Disaster-Management-master ApiController (/api/collection-points → /api/v1/collection-points).
 */
@RestController
@RequestMapping("/api/v1/collection-points")
public class CollectionPointController {

    private final CollectionPointRepository repo;

    public CollectionPointController(CollectionPointRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public ResponseEntity<List<CollectionPoint>> getAll() {
        return ResponseEntity.ok(repo.findByIsActiveTrue());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONDER')")
    public ResponseEntity<CollectionPoint> create(@RequestBody CollectionPoint cp) {
        cp.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(repo.save(cp));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONDER')")
    public ResponseEntity<CollectionPoint> update(@PathVariable UUID id,
                                                   @RequestBody CollectionPoint updated) {
        return repo.findById(id).map(cp -> {
            cp.setName(updated.getName());
            cp.setAddress(updated.getAddress());
            cp.setOperatingHours(updated.getOperatingHours());
            cp.setIsActive(updated.getIsActive());
            return ResponseEntity.ok(repo.save(cp));
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
