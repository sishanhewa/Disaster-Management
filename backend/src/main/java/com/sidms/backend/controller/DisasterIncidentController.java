package com.sidms.backend.controller;

import com.sidms.backend.model.DisasterIncident;
import com.sidms.backend.repository.DisasterIncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DisasterIncidentController {

    private final DisasterIncidentRepository repo;

    @GetMapping
    public List<DisasterIncident> getAll() {
        return repo.findAllByOrderByIncidentDateDesc();
    }

    @GetMapping("/active")
    public List<DisasterIncident> getActive() {
        return repo.findByResponseStatusNotOrderByIncidentDateDesc("resolved");
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisasterIncident> getById(@PathVariable UUID id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public DisasterIncident create(@RequestBody DisasterIncident incident) {
        return repo.save(incident);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DisasterIncident> update(@PathVariable UUID id, @RequestBody DisasterIncident updated) {
        return repo.findById(id)
                .map(existing -> {
                    existing.setTitle(updated.getTitle());
                    existing.setDistrict(updated.getDistrict());
                    existing.setHazardType(updated.getHazardType());
                    existing.setSeverity(updated.getSeverity());
                    existing.setAffectedPeople(updated.getAffectedPeople());
                    existing.setCasualties(updated.getCasualties());
                    existing.setDamageEstimateLkr(updated.getDamageEstimateLkr());
                    existing.setResponseStatus(updated.getResponseStatus());
                    existing.setDescription(updated.getDescription());
                    existing.setLatitude(updated.getLatitude());
                    existing.setLongitude(updated.getLongitude());
                    existing.setReportedBy(updated.getReportedBy());
                    existing.setIncidentDate(updated.getIncidentDate());
                    return ResponseEntity.ok(repo.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
