package com.sidms.backend.service.notification;

import lombok.Getter;

/**
 * Email types with their subjects and FreeMarker template paths.
 */
@Getter
public enum EmailType {
    WEATHER_ALERT("[SIDMS] Weather Alert", "templates/emails/weather_alert.ftlh"),
    DISASTER_WARNING("[SIDMS] Disaster Warning", "templates/emails/disaster_warning.ftlh"),
    SOS_ALERT("[SIDMS EMERGENCY] SOS Alert - Immediate Action Required", "templates/emails/sos_alert.ftlh"),
    SYSTEM_NOTIFICATION("[SIDMS] System Notification", "templates/emails/system_notification.ftlh"),
    EMAIL_VERIFICATION("[SIDMS] Verify Your Email", "templates/emails/email_verification.ftlh"),
    SMS_VERIFICATION("[SIDMS] Phone Verification", "templates/emails/sms_verification.ftlh");

    private final String subject;
    private final String templatePath;

    EmailType(String subject, String templatePath) {
        this.subject = subject;
        this.templatePath = templatePath;
    }
}
