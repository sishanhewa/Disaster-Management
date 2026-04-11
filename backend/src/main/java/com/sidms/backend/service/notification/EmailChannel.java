package com.sidms.backend.service.notification;

import com.sidms.backend.entity.Notification;
import com.sidms.backend.entity.NotificationDelivery;
import com.sidms.backend.entity.User;
import com.sidms.backend.entity.enums.DisasterSeverity;
import com.sidms.backend.repository.NotificationDeliveryRepository;
import com.sidms.backend.repository.UserPreferencesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * Email notification channel using Spring Mail + FreeMarker templates.
 * 
 * Sends rich HTML emails for weather alerts and disaster warnings.
 * Requires spring.mail.* properties to be configured.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EmailChannel implements NotificationChannel {

    private final NotificationDeliveryRepository deliveryRepository;
    private final UserPreferencesRepository userPreferencesRepository;
    private final MailService mailService;

    @Value("${app.notifications.email.enabled:false}")
    private boolean emailEnabled;

    @Value("${app.base-url:https://sidms.lk}")
    private String baseUrl;

    @Override
    public NotificationDelivery.Channel getChannelType() {
        return NotificationDelivery.Channel.EMAIL;
    }

    @Override
    public boolean isEnabledForUser(User user) {
        if (!emailEnabled) {
            return false;
        }

        // Check user preferences
        var prefs = userPreferencesRepository.findById(user.getId());
        if (prefs.isPresent()) {
            Boolean notifEmail = prefs.get().getNotifEmail();
            return notifEmail != null && notifEmail && user.getEmail() != null;
        }

        // Default to false until explicitly enabled
        return false;
    }

    @Override
    public boolean send(Notification notification, User user, NotificationDelivery delivery) {
        if (!emailEnabled) {
            log.debug("[EmailChannel] Email notifications are disabled");
            markFailed(delivery, "Email channel disabled");
            return false;
        }

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            log.warn("[EmailChannel] User {} has no email address", user.getId());
            markFailed(delivery, "No email address");
            return false;
        }

        try {
            // Determine email type and build template model
            EmailType emailType = determineEmailType(notification);
            Map<String, Object> model = buildEmailModel(notification, user);

            // Send via MailService (FreeMarker template)
            mailService.sendEmail(user.getEmail(), emailType, model);

            // Mark as delivered
            delivery.setStatus(NotificationDelivery.Status.DELIVERED);
            delivery.setDeliveredAt(LocalDateTime.now(java.time.ZoneOffset.UTC));
            delivery.setAttemptCount(delivery.getAttemptCount() + 1);
            delivery.setLastAttemptAt(LocalDateTime.now(java.time.ZoneOffset.UTC));
            deliveryRepository.save(delivery);

            log.info("[EmailChannel] Email sent successfully to {}", user.getEmail());
            return true;

        } catch (Exception e) {
            log.error("[EmailChannel] Failed to send email to {}: {}", user.getEmail(), e.getMessage());
            markFailed(delivery, e.getMessage());
            return false;
        }
    }

    private EmailType determineEmailType(Notification notification) {
        String type = notification.getType();
        if (type == null) {
            return EmailType.SYSTEM_NOTIFICATION;
        }

        if (type.contains("DISASTER") || type.contains("WARNING")) {
            return EmailType.DISASTER_WARNING;
        } else if (type.contains("WEATHER")) {
            return EmailType.WEATHER_ALERT;
        } else if (type.contains("SOS")) {
            return EmailType.SOS_ALERT;
        } else {
            return EmailType.SYSTEM_NOTIFICATION;
        }
    }

    private Map<String, Object> buildEmailModel(Notification notification, User user) {
        Map<String, Object> model = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a");

        // Common fields
        model.put("dashboardUrl", baseUrl + "/dashboard");
        model.put("alertTime", notification.getCreatedAt() != null 
            ? notification.getCreatedAt().format(formatter) 
            : LocalDateTime.now().format(formatter));

        // Type-specific fields
        String type = notification.getType();
        if (type != null && type.contains("DISASTER")) {
            model.put("warningHeadline", notification.getTitle());
            model.put("warningText", notification.getBody());
            model.put("severity", "HIGH");
            model.put("category", "Weather");
            model.put("areaText", "Affected area");
            model.put("expiresAt", "Check dashboard for updates");
            model.put("mapUrl", baseUrl + "/map");
            model.put("emergencyUrl", baseUrl + "/emergency");
        } else if (type != null && type.contains("WEATHER")) {
            model.put("alertTitle", notification.getTitle());
            model.put("alertDescription", notification.getBody());
            model.put("locationName", extractLocationFromBody(notification.getBody()));
            model.put("severity", extractSeverityFromBody(notification.getBody()));
            model.put("severityColor", getSeverityColor(model.get("severity").toString()));
            model.put("eventType", formatEventType(type));
        } else if (type != null && type.contains("SOS")) {
            model.put("alertTitle", notification.getTitle());
            model.put("alertDescription", notification.getBody());
            model.put("locationName", extractLocationFromBody(notification.getBody()));
            model.put("latitude", extractLatitudeFromBody(notification.getBody()));
            model.put("longitude", extractLongitudeFromBody(notification.getBody()));
            model.put("status", extractSosStatus(notification.getTitle()));
            model.put("statusColor", getSosStatusColor(model.get("status").toString()));
            model.put("userName", extractUserNameFromBody(notification.getBody()));
            model.put("contactPhone", extractContactPhone(notification.getBody()));
            model.put("medicalNotes", extractMedicalNotes(notification.getBody()));
            model.put("weatherContext", extractWeatherContext(notification.getBody()));
            model.put("batteryLevel", extractBatteryLevel(notification.getBody()));
            model.put("referenceId", notification.getSourceEntityId());
            model.put("mapUrl", baseUrl + "/map?sos=" + notification.getSourceEntityId());
            model.put("respondUrl", baseUrl + "/operations?sos=" + notification.getSourceEntityId() + "&action=respond");
            model.put("smsUrl", "sms:" + extractContactPhone(notification.getBody()));
        } else {
            model.put("notificationTitle", notification.getTitle());
            model.put("notificationBody", notification.getBody());
        }

        return model;
    }

    private void markFailed(NotificationDelivery delivery, String error) {
        delivery.setStatus(NotificationDelivery.Status.FAILED);
        delivery.setAttemptCount(delivery.getAttemptCount() + 1);
        delivery.setLastAttemptAt(LocalDateTime.now(java.time.ZoneOffset.UTC));
        delivery.setErrorMessage(error);
        deliveryRepository.save(delivery);
    }

    // ──────────────────────────────────────────────
    // Content extraction helpers
    // ──────────────────────────────────────────────

    private String extractLocationFromBody(String body) {
        if (body == null) return "Your location";
        // Extract location from "Location: <name>" line
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("Location: (.+)\\n");
        java.util.regex.Matcher matcher = pattern.matcher(body);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return "Your location";
    }

    private String extractSeverityFromBody(String body) {
        if (body == null) return "MODERATE";
        // Extract severity from "Severity: <level>" line
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("Severity: (\\w+)");
        java.util.regex.Matcher matcher = pattern.matcher(body);
        if (matcher.find()) {
            return matcher.group(1).trim().toUpperCase();
        }
        return "MODERATE";
    }

    private String getSeverityColor(String severity) {
        return switch (severity.toUpperCase()) {
            case "LOW" -> "#22c55e";
            case "MODERATE" -> "#f59e0b";
            case "HIGH" -> "#f97316";
            case "CRITICAL" -> "#dc2626";
            case "EXTREME" -> "#7c2d12";
            default -> "#f59e0b";
        };
    }

    private String formatEventType(String type) {
        return type.replace("WEATHER_", "").replace("_", " ");
    }

    // ──────────────────────────────────────────────
    // SOS-specific extraction helpers
    // ──────────────────────────────────────────────

    private String extractLatitudeFromBody(String body) {
        if (body == null) return "0.0";
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("Location: ([0-9.]+),");
        java.util.regex.Matcher matcher = pattern.matcher(body);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return "0.0";
    }

    private String extractLongitudeFromBody(String body) {
        if (body == null) return "0.0";
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("Location: [0-9.]+, ([0-9.]+)");
        java.util.regex.Matcher matcher = pattern.matcher(body);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return "0.0";
    }

    private String extractSosStatus(String title) {
        if (title == null) return "PENDING";
        if (title.contains("PENDING")) return "PENDING";
        if (title.contains("ASSIGNED")) return "ASSIGNED";
        if (title.contains("EN_ROUTE")) return "EN_ROUTE";
        if (title.contains("RESOLVED")) return "RESOLVED";
        return "PENDING";
    }

    private String getSosStatusColor(String status) {
        return switch (status.toUpperCase()) {
            case "PENDING" -> "#f59e0b";  // Amber
            case "ASSIGNED" -> "#3b82f6";  // Blue
            case "EN_ROUTE" -> "#8b5cf6";  // Purple
            case "RESOLVED" -> "#22c55e";  // Green
            default -> "#f59e0b";
        };
    }

    private String extractUserNameFromBody(String body) {
        if (body == null) return "Unknown";
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("Emergency SOS triggered by ([^\\(]+)");
        java.util.regex.Matcher matcher = pattern.matcher(body);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return "Unknown";
    }

    private String extractContactPhone(String body) {
        if (body == null) return "";
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\(Phone: ([^\\)]+)\\)");
        java.util.regex.Matcher matcher = pattern.matcher(body);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return "";
    }

    private String extractMedicalNotes(String body) {
        if (body == null) return "";
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("Medical Notes: ([^\\n]+)");
        java.util.regex.Matcher matcher = pattern.matcher(body);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return "";
    }

    private String extractWeatherContext(String body) {
        if (body == null) return "";
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("Weather Context: ([^\\n]+)");
        java.util.regex.Matcher matcher = pattern.matcher(body);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return "";
    }

    private Double extractBatteryLevel(String body) {
        if (body == null) return 100.0;
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("Battery Level: ([0-9.]+)%");
        java.util.regex.Matcher matcher = pattern.matcher(body);
        if (matcher.find()) {
            try {
                return Double.parseDouble(matcher.group(1).trim());
            } catch (NumberFormatException e) {
                return 100.0;
            }
        }
        return 100.0;
    }
}
