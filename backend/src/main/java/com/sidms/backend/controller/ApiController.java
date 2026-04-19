package com.sidms.backend.controller;

import com.sidms.backend.model.*;
import com.sidms.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApiController {

    private final CampRepository campRepository;
    private final NeedRepository needRepository;
    private final PledgeRepository pledgeRepository;
    private final CollectionPointRepository cpRepository;

    // --- CAMPS ---
    @GetMapping("/camps")
    public List<Camp> getCamps() {
        return campRepository.findAll();
    }

    @PostMapping("/camps")
    public Camp createCamp(@RequestBody Camp camp) {
        return campRepository.save(camp);
    }

    @GetMapping("/camps/manager/{id}")
    public List<Camp> getCampsByManager(@PathVariable UUID id) {
        return campRepository.findByManager_Id(id);
    }

    // --- NEEDS ---
    @GetMapping("/needs")
    public List<Need> getNeeds() {
        return needRepository.findAll();
    }

    @PostMapping("/needs")
    public Need createNeed(@RequestBody Need need) {
        return needRepository.save(need);
    }

    @PutMapping("/needs/{id}/status")
    public Need updateNeedStatus(@PathVariable UUID id, @RequestBody java.util.Map<String, Boolean> body) {
        Need need = needRepository.findById(id).orElseThrow(() -> new RuntimeException("Need not found"));
        need.setActive(body.get("isActive"));
        return needRepository.save(need);
    }

    @GetMapping("/needs/manager/{id}")
    public List<Need> getNeedsByManager(@PathVariable UUID id) {
        return needRepository.findByCamp_Manager_Id(id);
    }

    @DeleteMapping("/needs/{id}")
    public ResponseEntity<Void> deleteNeed(@PathVariable UUID id) {
        if (needRepository.existsById(id)) {
            needRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- PLEDGES ---
    @GetMapping("/pledges")
    public List<Pledge> getPledges() {
        return pledgeRepository.findAll();
    }

    @PostMapping("/pledges")
    public Pledge createPledge(@RequestBody Pledge pledge) {
        Need need = needRepository.findById(pledge.getNeed().getId())
                .orElseThrow(() -> new RuntimeException("Need not found"));
        need.setQuantityPledged(need.getQuantityPledged() + pledge.getQuantity());
        needRepository.save(need);
        return pledgeRepository.save(pledge);
    }

    @PutMapping("/pledges/{id}/status")
    public Pledge updatePledgeStatus(@PathVariable UUID id, @RequestBody java.util.Map<String, String> body) {
        Pledge p = pledgeRepository.findById(id).orElseThrow();
        p.setStatus(body.get("status"));
        return pledgeRepository.save(p);
    }

    @GetMapping("/pledges/manager/{id}")
    public List<Pledge> getPledgesByManager(@PathVariable UUID id) {
        return pledgeRepository.findByNeed_Camp_Manager_Id(id);
    }

    // --- COLLECTION POINTS ---
    @GetMapping("/collection-points")
    public List<CollectionPoint> getCollectionPoints() {
        return cpRepository.findAll();
    }
}
