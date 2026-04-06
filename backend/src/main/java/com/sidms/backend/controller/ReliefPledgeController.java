package com.sidms.backend.controller;

import com.sidms.backend.entity.ReliefNeed;
import com.sidms.backend.entity.ReliefPledge;
import com.sidms.backend.repository.ReliefNeedRepository;
import com.sidms.backend.repository.ReliefPledgeRepository;
import com.sidms.backend.security.CustomUserDetails;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for donor pledges against relief needs.
 * Ported from Disaster-Management-master ApiController (/api/pledges → /api/v1/pledges).
 *
 * POST /api/v1/pledges is open (anonymous donors) per SecurityConfig Step 3.
 * The create() method is @Transactional to atomically increment quantityPledged on
 * the matching ReliefNeed — preserving DM's original side-effect logic.
 */
@RestController
@RequestMapping("/api/v1/pledges")
public class ReliefPledgeController {

    private final ReliefPledgeRepository pledgeRepository;
    private final ReliefNeedRepository needRepository;

    public ReliefPledgeController(ReliefPledgeRepository pledgeRepository,
                                   ReliefNeedRepository needRepository) {
        this.pledgeRepository = pledgeRepository;
        this.needRepository = needRepository;
    }

    @GetMapping("/manager/{managerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONDER')")
    public ResponseEntity<List<ReliefPledge>> getByManager(@PathVariable UUID managerId) {
        return ResponseEntity.ok(pledgeRepository.findByNeed_Camp_Manager_Id(managerId));
    }

    @GetMapping("/need/{needId}")
    public ResponseEntity<List<ReliefPledge>> getByNeed(@PathVariable UUID needId) {
        return ResponseEntity.ok(pledgeRepository.findByNeed_Id(needId));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReliefPledge>> getMyPledges(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(pledgeRepository.findByDonor_Id(principal.getUser().getId()));
    }

    /** Open to anonymous and authenticated donors (permitAll set in SecurityConfig). */
    @PostMapping
    @Transactional
    public ResponseEntity<ReliefPledge> create(@RequestBody ReliefPledge pledge) {
        // Preserve DM's side-effect: increment quantityPledged on the need atomically
        ReliefNeed need = needRepository.findById(pledge.getNeed().getId())
                .orElseThrow(() -> new RuntimeException("ReliefNeed not found: " + pledge.getNeed().getId()));
        need.setQuantityPledged(need.getQuantityPledged() + pledge.getQuantity());
        need.setUpdatedAt(LocalDateTime.now());
        needRepository.save(need);

        pledge.setQrCodeUuid(UUID.randomUUID());
        pledge.setCreatedAt(LocalDateTime.now());
        pledge.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(pledgeRepository.save(pledge));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONDER')")
    public ResponseEntity<ReliefPledge> updateStatus(@PathVariable UUID id,
                                                      @RequestBody Map<String, String> body) {
        return pledgeRepository.findById(id).map(p -> {
            p.setStatus(body.get("status"));
            p.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(pledgeRepository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }
}
