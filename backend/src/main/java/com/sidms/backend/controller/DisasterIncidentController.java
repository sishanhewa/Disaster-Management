package com.sidms.backend.controller;

import com.sidms.backend.entity.DisasterIncident;
import com.sidms.backend.repository.DisasterIncidentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for field-reported / ArcGIS-sourced disaster incidents.
 * Distinct from DisasterWarningController (official government bulletins).
 * Ported from Disaster-Management-master DisasterIncidentController (/api/incidents → /api/v1/incidents).
 */
@RestController
@RequestMapping("/api/v1/incidents")
public class DisasterIncidentController {

    private final DisasterIncidentRepository repo;

    public DisasterIncidentController(DisasterIncidentRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public ResponseEntity<List<DisasterIncident>> getAll() {
        return ResponseEntity.ok(repo.findAllByOrderByIncidentDateDesc());
    }

    @GetMapping("/active")
    public ResponseEntity<List<DisasterIncident>> getActive() {
        return ResponseEntity.ok(repo.findByResponseStatusNotOrderByIncidentDateDesc("resolved"));
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<List<DisasterIncident>> getByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(repo.findByDistrictOrderByIncidentDateDesc(district));
    }

    @GetMapping("/hazard/{hazardType}")
    public ResponseEntity<List<DisasterIncident>> getByHazard(@PathVariable String hazardType) {
        return ResponseEntity.ok(repo.findByHazardTypeOrderByIncidentDateDesc(hazardType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisasterIncident> getById(@PathVariable UUID id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONDER')")
    public ResponseEntity<DisasterIncident> create(@RequestBody DisasterIncident incident) {
        incident.setCreatedAt(LocalDateTime.now());
        incident.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(repo.save(incident));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONDER')")
    public ResponseEntity<DisasterIncident> update(@PathVariable UUID id,
                                                    @RequestBody DisasterIncident updated) {
        return repo.findById(id).map(i -> {
            i.setTitle(updated.getTitle());
            i.setDistrict(updated.getDistrict());
            i.setHazardType(updated.getHazardType());
            i.setSeverity(updated.getSeverity());
            i.setAffectedPeople(updated.getAffectedPeople());
            i.setCasualties(updated.getCasualties());
            i.setDamageEstimateLkr(updated.getDamageEstimateLkr());
            i.setResponseStatus(updated.getResponseStatus());
            i.setDescription(updated.getDescription());
            i.setLatitude(updated.getLatitude());
            i.setLongitude(updated.getLongitude());
            i.setReportedBy(updated.getReportedBy());
            i.setIncidentDate(updated.getIncidentDate());
            i.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(repo.save(i));
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
