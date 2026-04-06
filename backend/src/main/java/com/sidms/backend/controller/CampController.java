package com.sidms.backend.controller;

import com.sidms.backend.entity.Camp;
import com.sidms.backend.repository.CampRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for relief camp management.
 * Ported from Disaster-Management-master ApiController (/api/camps → /api/v1/camps).
 * Security: GET public, POST/PUT RESPONDER+ADMIN, DELETE ADMIN-only.
 */
@RestController
@RequestMapping("/api/v1/camps")
public class CampController {

    private final CampRepository campRepository;

    public CampController(CampRepository campRepository) {
        this.campRepository = campRepository;
    }

    @GetMapping
    public ResponseEntity<List<Camp>> getAll() {
        return ResponseEntity.ok(campRepository.findByIsActiveTrueOrderByCampNameAsc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Camp> getById(@PathVariable UUID id) {
        return campRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<List<Camp>> getByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(campRepository.findByDistrictIgnoreCase(district));
    }

    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<Camp>> getByManager(@PathVariable UUID managerId) {
        return ResponseEntity.ok(campRepository.findByManager_Id(managerId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONDER')")
    public ResponseEntity<Camp> create(@RequestBody Camp camp) {
        camp.setCreatedAt(LocalDateTime.now());
        camp.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(campRepository.save(camp));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONDER')")
    public ResponseEntity<Camp> update(@PathVariable UUID id, @RequestBody Camp updated) {
        return campRepository.findById(id).map(c -> {
            c.setCampName(updated.getCampName());
            c.setDistrict(updated.getDistrict());
            c.setAddress(updated.getAddress());
            c.setCapacity(updated.getCapacity());
            c.setLatitude(updated.getLatitude());
            c.setLongitude(updated.getLongitude());
            c.setIsActive(updated.getIsActive());
            c.setManager(updated.getManager());
            c.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(campRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!campRepository.existsById(id)) return ResponseEntity.notFound().build();
        campRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
