package com.sidms.backend.service.notification;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerConfigurationFactoryBean;

import java.io.IOException;
import java.io.StringWriter;
import java.util.Map;

/**
 * Mail Service implementation using Spring Mail + FreeMarker templates.
 * 
 * Configuration required:
 * - spring.mail.host
 * - spring.mail.port
 * - spring.mail.username
 * - spring.mail.password
 */
@Service
@Slf4j
public class MailServiceImpl implements MailService {

    private final JavaMailSender javaMailSender;
    private final Configuration freemarkerConfig;
    private final String mailFrom;

    public MailServiceImpl(JavaMailSender javaMailSender,
                           @Value("${spring.mail.username:noreply@sidms.lk}") String mailFrom,
                           @Qualifier("emailFreemarkerConfiguration") Configuration freemarkerConfig) {
        this.javaMailSender = javaMailSender;
        this.mailFrom = mailFrom;
        this.freemarkerConfig = freemarkerConfig;
    }

    @Override
    public void sendEmail(String to, EmailType emailType, Map<String, Object> model) {
        if (mailFrom == null || mailFrom.isEmpty()) {
            log.error("[MailService] Mail 'from' address not configured. Cannot send email.");
            return;
        }

        if (to == null || to.isBlank()) {
            log.warn("[MailService] No recipient email provided. Skipping.");
            return;
        }

        try {
            String htmlBody = processTemplate(emailType.getTemplatePath(), model);

            javaMailSender.send(mimeMessage -> {
                try {
                    MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                    messageHelper.setFrom(mailFrom);
                    messageHelper.setTo(to);
                    messageHelper.setSubject(emailType.getSubject() + " - " + model.getOrDefault("alertTitle", "Notification"));
                    messageHelper.setText(htmlBody, true);
                } catch (MessagingException e) {
                    log.error("[MailService] Error creating email message for {}: {}", to, e.getMessage());
                    throw new RuntimeException("Error setting up email message", e);
                }
            });

            log.info("[MailService] Successfully sent '{}' email to {}", emailType.name(), to);

        } catch (IOException | TemplateException e) {
            log.error("[MailService] Failed to process template {} or send email to {}: {}",
                    emailType.getTemplatePath(), to, e.getMessage(), e);
            throw new IllegalStateException("Could not process email template", e);
        } catch (Exception e) {
            log.error("[MailService] Failed to send email to {}: {}", to, e.getMessage(), e);
            throw new IllegalStateException("Could not send email", e);
        }
    }

    private String processTemplate(String templatePath, Map<String, Object> model) throws IOException, TemplateException {
        // Remove leading templates/ if present
        String cleanPath = templatePath.replaceFirst("^/?templates/", "");
        log.debug("[MailService] Loading Freemarker template: {}", cleanPath);

        Template template = freemarkerConfig.getTemplate(cleanPath);
        StringWriter writer = new StringWriter();
        template.process(model, writer);
        return writer.toString();
    }
}
