package com.sidms.backend.service.notification;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Android SMS Gateway integration for Sri Lanka.
 * 
 * Uses sms-gate.app service which works well for local numbers.
 * Configuration required in application.properties:
 * - sms.gateway.cloud.url=https://api.sms-gate.app/3rdparty/v1
 * - sms.gateway.username=YOUR_USERNAME
 * - sms.gateway.password=YOUR_PASSWORD
 */
@Service
@Slf4j
public class AndroidSmsGatewayService implements SmsGatewayService {

    @Value("${sms.gateway.cloud.url:https://api.sms-gate.app/3rdparty/v1}")
    private String gatewayUrl;

    @Value("${sms.gateway.username:}")
    private String username;

    @Value("${sms.gateway.password:}")
    private String password;

    @Value("${sms.gateway.sim-number:1}")
    private Integer simNumber;

    @Value("${app.notifications.sms.enabled:false}")
    private boolean smsEnabled;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public boolean sendSms(String phone, String text) {
        if (!smsEnabled) {
            log.debug("[AndroidSmsGateway] SMS notifications are disabled - would send to {}", phone);
            return false;
        }

        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            log.error("[AndroidSmsGateway] SMS Gateway credentials not configured");
            return false;
        }

        if (gatewayUrl == null || gatewayUrl.isEmpty()) {
            log.error("[AndroidSmsGateway] SMS Gateway URL not configured");
            return false;
        }

        String formattedPhone = formatPhoneNumber(phone);
        if (formattedPhone == null) {
            log.error("[AndroidSmsGateway] Invalid phone number format: {}", phone);
            return false;
        }

        // Truncate message if too long (SMS limit ~160 chars for single segment)
        String messageText = text;
        if (messageText.length() > 150) {
            messageText = messageText.substring(0, 147) + "...";
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBasicAuth(username, password);

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, String> textMessage = new HashMap<>();
            textMessage.put("text", messageText);

            requestBody.put("textMessage", textMessage);
            requestBody.put("simNumber", simNumber);
            requestBody.put("phoneNumbers", new String[]{formattedPhone});

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            log.debug("[AndroidSmsGateway] Sending SMS to {}: {}", formattedPhone, messageText);

            ResponseEntity<String> response = restTemplate.exchange(
                    gatewayUrl + "/messages",
                    HttpMethod.POST,
                    request,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                // Parse response to get message ID for tracking
                // Note: The immediate response shows "Pending" state - actual delivery is async
                String responseBody = response.getBody();
                log.debug("[AndroidSmsGateway] Response: {}", responseBody);

                try {
                    ObjectMapper mapper = new ObjectMapper();
                    JsonNode root = mapper.readTree(responseBody);

                    // Get message ID for tracking (delivery status requires polling or webhooks)
                    JsonNode idNode = root.path("id");
                    String messageId = idNode.isMissingNode() ? "unknown" : idNode.asText();

                    // Get initial state (will be "Pending" - delivery is async)
                    JsonNode stateNode = root.path("state");
                    String state = stateNode.isMissingNode() ? "unknown" : stateNode.asText();

                    log.info("[AndroidSmsGateway] SMS queued to {} (ID: {}, State: {}). Delivery is asynchronous.",
                            formattedPhone, messageId, state);
                    return true;

                } catch (Exception e) {
                    // If we can't parse, assume success since HTTP was 2xx
                    log.warn("[AndroidSmsGateway] Could not parse response for {}, assuming success: {}",
                            formattedPhone, responseBody);
                    return true;
                }
            } else {
                log.error("[AndroidSmsGateway] Failed to send SMS. Status: {}, Response: {}",
                        response.getStatusCode(), response.getBody());
                return false;
            }

        } catch (Exception e) {
            log.error("[AndroidSmsGateway] Error sending SMS to {}: {}", formattedPhone, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Format Sri Lankan phone numbers to international format.
     * 
     * Supported formats:
     * - 0771234567 → +94771234567
     * - 771234567 → +94771234567  
     * - +94771234567 → +94771234567 (unchanged)
     * - 0112123456 → +94112123456 (landline - probably not for SMS)
     */
    String formatPhoneNumber(String phone) {
        if (phone == null || phone.isBlank()) {
            return null;
        }

        // Remove all non-digit characters except +
        String cleaned = phone.replaceAll("[^\\+0-9]", "").trim();

        // Already in international format
        if (cleaned.startsWith("+94") && cleaned.length() == 12) {
            return cleaned;
        }

        // Starts with 0 (local format) - 10 digits total
        if (cleaned.startsWith("0") && cleaned.length() == 10) {
            return "+94" + cleaned.substring(1);
        }

        // Starts with 7 (mobile without prefix) - 9 digits
        if (cleaned.startsWith("7") && cleaned.length() == 9) {
            return "+94" + cleaned;
        }

        log.warn("[AndroidSmsGateway] Could not format phone number: {} (cleaned: {})", phone, cleaned);
        return null;
    }
}
