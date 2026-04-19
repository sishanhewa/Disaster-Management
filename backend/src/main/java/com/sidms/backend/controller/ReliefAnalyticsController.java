package com.sidms.backend.controller;

import com.sidms.backend.repository.CampRepository;
import com.sidms.backend.repository.ReliefNeedRepository;
import com.sidms.backend.repository.ReliefPledgeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Analytics summary for the relief camp domain.
 * Ported from Disaster-Management-master AnalyticsController (/api/analytics → /api/v1/relief/analytics).
 * Renamed to avoid collision with CS's existing AnalyticsController at /api/v1/analytics.
 */
@RestController
@RequestMapping("/api/v1/relief/analytics")
public class ReliefAnalyticsController {

    private final CampRepository campRepository;
    private final ReliefNeedRepository needRepository;
    private final ReliefPledgeRepository pledgeRepository;

    public ReliefAnalyticsController(CampRepository campRepository,
                                      ReliefNeedRepository needRepository,
                                      ReliefPledgeRepository pledgeRepository) {
        this.campRepository = campRepository;
        this.needRepository = needRepository;
        this.pledgeRepository = pledgeRepository;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        long totalItemsRequired = needRepository.findAll().stream()
                .mapToLong(n -> n.getQuantityRequired()).sum();
        long totalItemsPledged  = needRepository.findAll().stream()
                .mapToLong(n -> n.getQuantityPledged()).sum();

        return ResponseEntity.ok(Map.of(
                "totalCamps",         campRepository.count(),
                "totalActiveNeeds",   (long) needRepository.findByIsActiveTrue().size(),
                "totalPledges",       pledgeRepository.count(),
                "totalItemsRequired", totalItemsRequired,
                "totalItemsPledged",  totalItemsPledged
        ));
    }
}
