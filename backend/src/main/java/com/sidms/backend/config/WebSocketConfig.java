package com.sidms.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket configuration for real-time SOS tracking and responder updates.
 *
 * Uses STOMP protocol for simple message routing:
 * - /topic/sos/{incidentId} - SOS victim location updates (public to responders)
 * - /topic/sos/{incidentId}/responders - Responder location updates
 * - /user/queue/notifications - Personal notifications
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable simple in-memory broker for topics and user queues
        config.enableSimpleBroker("/topic", "/queue");

        // Prefix for messages from client to server
        config.setApplicationDestinationPrefixes("/app");

        // Prefix for user-specific messages
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // SOS WebSocket endpoint with SockJS fallback
        registry.addEndpoint("/ws/sos")
                .setAllowedOriginPatterns("*")
                .withSockJS();

        // Dashboard real-time endpoint
        registry.addEndpoint("/ws/dashboard")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
