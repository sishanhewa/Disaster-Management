package com.sidms.backend.service.notification;

/**
 * SMS Service interface for sending text notifications.
 */
public interface SmsGatewayService {
    /**
     * Send SMS to a phone number.
     * @param phone Phone number (will be formatted to international format)
     * @param text Message text
     * @return true if sent successfully, false otherwise
     */
    boolean sendSms(String phone, String text);
}
