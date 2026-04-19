package com.sidms.backend.scheduler;

import com.sidms.backend.service.MeteoScraperService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class MeteoSyncScheduler {

    private final MeteoScraperService meteoScraperService;
    private final StringRedisTemplate stringRedisTemplate;

    // ──────────────────────────────────────────────
    // Meteo content sync: every 15 minutes
    // ──────────────────────────────────────────────
    @Scheduled(fixedDelayString = "${app.sync.meteo.interval}", initialDelayString = "${app.sync.meteo.initial-delay}")
    public void syncMeteoContent() {
        log.info("⏳ Meteo content sync started");
        try {
            meteoScraperService.scrapeMeteoContent();

            // Evict meteo:content to force fresh load on next request
            try {
                stringRedisTemplate.delete("meteo:content");
            } catch (Exception e) {
                log.warn("Failed to evict meteo:content cache: {}", e.getMessage());
            }

            log.info("✅ Meteo content sync completed");
        } catch (Exception e) {
            log.error("Meteo content sync failed: {}", e.getMessage());
        }
    }
}
