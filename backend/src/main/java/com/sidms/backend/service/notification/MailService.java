package com.sidms.backend.service.notification;

import java.util.Map;

/**
 * Mail Service interface for sending HTML email notifications.
 */
public interface MailService {
    /**
     * Send an email using a FreeMarker template.
     * 
     * @param to Recipient email address
     * @param emailType Type of email (determines template and subject)
     * @param model Template variables
     */
    void sendEmail(String to, EmailType emailType, Map<String, Object> model);
}
