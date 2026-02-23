package com.sidms.backend.controller;

import com.sidms.backend.repository.CampRepository;
import com.sidms.backend.repository.NeedRepository;
import com.sidms.backend.repository.PledgeRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final CampRepository campRepository;
    private final NeedRepository needRepository;
    private final PledgeRepository pledgeRepository;

    @GetMapping("/summary")
    public AnalyticsStats getSummary() {
        AnalyticsStats stats = new AnalyticsStats();
        stats.setTotalCamps(campRepository.count());
        stats.setTotalActiveNeeds(needRepository.findByIsActiveTrue().size());
        stats.setTotalPledges(pledgeRepository.count());

        long totalItemsRequired = needRepository.findAll().stream().mapToInt(n -> n.getQuantityRequired()).sum();
        long totalItemsPledged = needRepository.findAll().stream().mapToInt(n -> n.getQuantityPledged()).sum();

        stats.setTotalItemsRequired(totalItemsRequired);
        stats.setTotalItemsPledged(totalItemsPledged);

        return stats;
    }
}

@Data
class AnalyticsStats {
    private long totalCamps;
    private long totalActiveNeeds;
    private long totalPledges;
    private long totalItemsRequired;
    private long totalItemsPledged;
}
