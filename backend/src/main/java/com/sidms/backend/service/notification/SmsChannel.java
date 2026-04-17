package com.sidms.backend.service.notification;

import com.sidms.backend.entity.Notification;
import com.sidms.backend.entity.NotificationDelivery;
import com.sidms.backend.entity.User;
import com.sidms.backend.repository.NotificationDeliveryRepository;
import com.sidms.backend.repository.UserPreferencesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * SMS notification channel using Android SMS Gateway.
 * 
 * Integrates with sms-gate.app service for Sri Lankan mobile numbers.
 * Supports phone formats: 0771234567, 771234567, +94771234567
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SmsChannel implements NotificationChannel {

    private final NotificationDeliveryRepository deliveryRepository;
    private final UserPreferencesRepository userPreferencesRepository;
    private final AndroidSmsGatewayService smsGatewayService;

    @Value("${app.notifications.sms.enabled:false}")
    private boolean smsEnabled;

    @Override
    public NotificationDelivery.Channel getChannelType() {
        return NotificationDelivery.Channel.SMS;
    }

    @Override
    public boolean isEnabledForUser(User user) {
        if (!smsEnabled) {
            return false;
        }

        // Check user preferences - requires explicit opt-in for SMS
        var prefs = userPreferencesRepository.findById(user.getId());
        if (prefs.isPresent()) {
            Boolean notifSms = prefs.get().getNotifSms();
            return notifSms != null && notifSms && user.getPhone() != null;
        }

        return false; // SMS requires explicit opt-in
    }

    @Override
    public boolean send(Notification notification, User user, NotificationDelivery delivery) {
        if (!smsEnabled) {
            log.debug("[SmsChannel] SMS notifications are disabled");
            markFailed(delivery, "SMS channel disabled");
            return false;
        }

        if (user.getPhone() == null || user.getPhone().isBlank()) {
            log.warn("[SmsChannel] User {} has no phone number", user.getId());
            markFailed(delivery, "No phone number");
            return false;
        }

        // Build concise SMS message
        String smsBody = buildSmsBody(notification);

        // Send via Android SMS Gateway
        boolean sent = smsGatewayService.sendSms(user.getPhone(), smsBody);

        if (sent) {
            delivery.setStatus(NotificationDelivery.Status.DELIVERED);
            delivery.setDeliveredAt(LocalDateTime.now(java.time.ZoneOffset.UTC));
            delivery.setAttemptCount(delivery.getAttemptCount() + 1);
            delivery.setLastAttemptAt(LocalDateTime.now(java.time.ZoneOffset.UTC));
            deliveryRepository.save(delivery);
            log.info("[SmsChannel] SMS sent successfully to {}", user.getPhone());
            return true;
        } else {
            markFailed(delivery, "SMS gateway failed");
            return false;
        }
    }

    private void markFailed(NotificationDelivery delivery, String error) {
        delivery.setStatus(NotificationDelivery.Status.FAILED);
        delivery.setAttemptCount(delivery.getAttemptCount() + 1);
        delivery.setLastAttemptAt(LocalDateTime.now(java.time.ZoneOffset.UTC));
        delivery.setErrorMessage(error);
        deliveryRepository.save(delivery);
    }

    private String buildSmsBody(Notification notification) {
        // Build concise but informative SMS (160 chars max for single segment)
        String body = notification.getBody();
        String title = notification.getTitle();

        // Extract location from body (e.g., "Location: Dambulla")
        String location = extractLocation(body);

        // Build message: "SIDMS: [Location] - [Title]"
        // Keep total under 160 chars
        String prefix = "SIDMS";
        String message;

        if (location != null && !location.isEmpty()) {
            // "SIDMS: Dambulla - Max Temperature > 20 (forecast: 33.6)"
            String locationPart = location.length() > 30 ? location.substring(0, 27) + "..." : location;
            String titlePart = title.length() > 100 ? title.substring(0, 97) + "..." : title;
            message = prefix + ": " + locationPart + " - " + titlePart;
        } else {
            String titlePart = title.length() > 140 ? title.substring(0, 137) + "..." : title;
            message = prefix + ": " + titlePart;
        }

        // Final truncation if still too long
        if (message.length() > 155) {
            message = message.substring(0, 152) + "...";
        }

        return message;
    }

    private String extractLocation(String body) {
        if (body == null) return null;
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("Location: (.+)\\n");
        java.util.regex.Matcher matcher = pattern.matcher(body);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }
}
