package com.sidms.backend.service;

import com.sidms.backend.dto.sos.*;
import com.sidms.backend.entity.*;
import com.sidms.backend.entity.enums.SosStatus;
import com.sidms.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * Service for real-time SOS tracking using Redis for ephemeral storage.
 *
 * Architecture:
 * - Victim location: Stored in Redis with short TTL (live tracking)
 * - Responder locations: Stored in Redis per incident
 * - Historical data: Batched writes to database
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SosTrackingService {

    private final StringRedisTemplate redisTemplate;
    private final SosIncidentRepository sosIncidentRepository;
    private final SosTimelineRepository sosTimelineRepository;

    private static final String SOS_VICTIM_KEY = "sos:victim:%s";
    private static final String SOS_RESPONDER_KEY = "sos:responder:%s:%s";
    private static final long LOCATION_TTL_MINUTES = 30;

    /**
     * Update victim location (from mobile app).
     * Stores in Redis for real-time tracking.
     */
    public void updateVictimLocation(UUID incidentId, LocationUpdateRequest request) {
        String key = String.format(SOS_VICTIM_KEY, incidentId);

        // Store location data as JSON
        String locationData = String.format("""
                {"lat":%s,"lng":%s,"accuracy":%s,"battery":%s,"timestamp":"%s"}""",
                request.getLat(),
                request.getLng(),
                request.getAccuracy(),
                request.getBatteryLevel(),
                LocalDateTime.now(ZoneOffset.UTC)
        );

        redisTemplate.opsForValue().set(key, locationData, LOCATION_TTL_MINUTES, TimeUnit.MINUTES);

        log.debug("[SosTracking] Updated victim location for SOS {}: {}, {}",
                incidentId, request.getLat(), request.getLng());
    }

    /**
     * Update responder location.
     * Stores in Redis keyed by incident + responder.
     */
    public void updateResponderLocation(UUID incidentId, String responderId, LocationUpdateRequest request) {
        String key = String.format(SOS_RESPONDER_KEY, incidentId, responderId);

        String locationData = String.format("""
                {"responderId":"%s","name":"%s","lat":%s,"lng":%s,"status":"%s","timestamp":"%s"}""",
                responderId,
                request.getResponderName(),
                request.getLat(),
                request.getLng(),
                request.getStatus(),
                LocalDateTime.now(ZoneOffset.UTC)
        );

        redisTemplate.opsForValue().set(key, locationData, LOCATION_TTL_MINUTES, TimeUnit.MINUTES);

        log.debug("[SosTracking] Updated responder {} location for SOS {}: {}, {}",
                responderId, incidentId, request.getLat(), request.getLng());
    }

    /**
     * Get current victim location from Redis.
     */
    public VictimLocation getVictimLocation(UUID incidentId) {
        String key = String.format(SOS_VICTIM_KEY, incidentId);
        String data = redisTemplate.opsForValue().get(key);

        if (data == null) {
            // Fallback to database (last known location from incident)
            return sosIncidentRepository.findById(incidentId)
                    .map(incident -> VictimLocation.builder()
                            .lat(incident.getLat())
                            .lng(incident.getLng())
                            .timestamp(incident.getUpdatedAt().toString())
                            .fromCache(false)
                            .build())
                    .orElse(null);
        }

        // Parse JSON (simplified - use ObjectMapper in production)
        try {
            // Quick parse of lat/lng
            String latStr = data.substring(data.indexOf("\"lat\"") + 6, data.indexOf(",", data.indexOf("\"lat\"")));
            String lngStr = data.substring(data.indexOf("\"lng\"") + 6, data.indexOf(",", data.indexOf("\"lng\"")));

            return VictimLocation.builder()
                    .lat(Double.parseDouble(latStr))
                    .lng(Double.parseDouble(lngStr))
                    .timestamp("Just now")
                    .fromCache(true)
                    .build();
        } catch (Exception e) {
            log.warn("[SosTracking] Failed to parse victim location: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Update SOS status and log to timeline.
     */
    @Transactional
    public void updateSosStatus(UUID incidentId, String newStatus, UUID actorId) {
        SosIncident incident = sosIncidentRepository.findById(incidentId)
                .orElseThrow(() -> new IllegalArgumentException("SOS incident not found: " + incidentId));

        SosStatus status = SosStatus.valueOf(newStatus.toUpperCase());
        incident.setStatus(status);
        incident.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));

        if (status == SosStatus.RESOLVED) {
            incident.setResolvedAt(LocalDateTime.now(ZoneOffset.UTC));
        }

        sosIncidentRepository.save(incident);

        // Create timeline entry
        SosTimeline timeline = SosTimeline.builder()
                .incidentId(incidentId)
                .action("STATUS_CHANGED_TO_" + newStatus.toUpperCase())
                .actorId(actorId)
                .notes("Status updated via WebSocket to: " + newStatus)
                .createdAt(LocalDateTime.now(ZoneOffset.UTC))
                .build();

        sosTimelineRepository.save(timeline);

        log.info("[SosTracking] Updated SOS {} status to {}", incidentId, newStatus);
    }

    /**
     * Simple DTO for victim location.
     */
    @lombok.Builder
    @lombok.Data
    public static class VictimLocation {
        private Double lat;
        private Double lng;
        private String timestamp;
        private Boolean fromCache;
    }
}
