package com.sidms.backend.controller;

import com.sidms.backend.dto.sos.*;
import com.sidms.backend.service.SosTrackingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.UUID;

/**
 * WebSocket controller for real-time SOS location tracking.
 *
 * Handles:
 * - Victim location updates (from mobile app)
 * - Responder location updates (as they move toward victim)
 * - Status updates broadcast to all connected responders
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class SosWebSocketController {

    private final SosTrackingService sosTrackingService;

    /**
     * Victim sends location update via WebSocket.
     * Broadcasts to all responders watching this SOS incident.
     */
    @MessageMapping("/sos/{incidentId}/location")
    @org.springframework.messaging.handler.annotation.SendTo("/topic/sos/{incidentId}/victim")
    public LocationUpdateMessage updateVictimLocation(
            @DestinationVariable UUID incidentId,
            @Payload LocationUpdateRequest request,
            Principal principal) {

        log.debug("[WebSocket] Victim location update for SOS {}: {}, {}",
                incidentId, request.getLat(), request.getLng());

        // Validate and store the location update
        sosTrackingService.updateVictimLocation(incidentId, request);

        return LocationUpdateMessage.builder()
                .type("VICTIM_LOCATION")
                .userId(principal != null ? principal.getName() : "unknown")
                .lat(request.getLat())
                .lng(request.getLng())
                .accuracy(request.getAccuracy())
                .batteryLevel(request.getBatteryLevel())
                .timestamp(java.time.Instant.now())
                .build();
    }

    /**
     * Responder sends their location update.
     * Broadcasts to all other responders and the dashboard.
     */
    @MessageMapping("/sos/{incidentId}/responder/location")
    @org.springframework.messaging.handler.annotation.SendTo("/topic/sos/{incidentId}/responders")
    public ResponderLocationMessage updateResponderLocation(
            @DestinationVariable UUID incidentId,
            @Payload LocationUpdateRequest request,
            Principal principal) {

        if (principal == null) {
            throw new IllegalArgumentException("Authentication required");
        }

        log.debug("[WebSocket] Responder {} location for SOS {}: {}, {}",
                principal.getName(), incidentId, request.getLat(), request.getLng());

        // Store responder location
        sosTrackingService.updateResponderLocation(incidentId, principal.getName(), request);

        return ResponderLocationMessage.builder()
                .type("RESPONDER_LOCATION")
                .responderId(principal.getName())
                .responderName(request.getResponderName())
                .lat(request.getLat())
                .lng(request.getLng())
                .status(request.getStatus()) // EN_ROUTE, ON_SCENE, etc.
                .timestamp(java.time.Instant.now())
                .build();
    }

    /**
     * Status update (en route, on scene, etc.)
     */
    @MessageMapping("/sos/{incidentId}/status")
    @org.springframework.messaging.handler.annotation.SendTo("/topic/sos/{incidentId}/status")
    public StatusUpdateMessage updateStatus(
            @DestinationVariable UUID incidentId,
            @Payload StatusUpdateRequest request,
            Principal principal) {

        log.info("[WebSocket] Status update for SOS {}: {} by {}",
                incidentId, request.getStatus(), principal != null ? principal.getName() : "system");

        sosTrackingService.updateSosStatus(incidentId, request.getStatus(),
                principal != null ? UUID.fromString(principal.getName()) : null);

        return StatusUpdateMessage.builder()
                .type("STATUS_UPDATE")
                .status(request.getStatus())
                .message(request.getMessage())
                .updatedBy(principal != null ? principal.getName() : "system")
                .timestamp(java.time.Instant.now())
                .build();
    }

    /**
     * Subscribe to personal notifications.
     */
    @MessageMapping("/user/notifications")
    @SendToUser("/queue/notifications")
    public String subscribeToNotifications(Principal principal) {
        log.debug("[WebSocket] User {} subscribed to notifications", principal.getName());
        return "Subscribed to notifications";
    }
}
