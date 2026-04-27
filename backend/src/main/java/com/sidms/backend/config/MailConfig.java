package com.sidms.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.ui.freemarker.FreeMarkerConfigurationFactoryBean;

import java.util.Properties;

/**
 * Mail configuration for Spring Mail + FreeMarker templates.
 */
@Configuration
public class MailConfig {

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${spring.mail.port:587}")
    private int mailPort;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${spring.mail.properties.mail.smtp.auth:true}")
    private String smtpAuth;

    @Value("${spring.mail.properties.mail.smtp.starttls.enable:true}")
    private String starttlsEnable;

    @Value("${spring.mail.properties.mail.debug:false}")
    private String mailDebug;

    /**
     * JavaMailSender bean for sending emails.
     * Returns a minimal sender if mail is not configured (for dev/testing).
     */
    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        if (mailHost != null && !mailHost.isEmpty()) {
            mailSender.setHost(mailHost);
            mailSender.setPort(mailPort);
            mailSender.setUsername(mailUsername);
            mailSender.setPassword(mailPassword);

            Properties props = mailSender.getJavaMailProperties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.auth", smtpAuth);
            props.put("mail.smtp.starttls.enable", starttlsEnable);
            props.put("mail.debug", mailDebug);
        } else {
            log.warn("[MailConfig] Mail host not configured. Email functionality disabled.");
            // Return minimal config - emails will fail but app won't crash
            mailSender.setHost("localhost");
            mailSender.setPort(25);
        }

        return mailSender;
    }

    /**
     * FreeMarker configuration for email templates.
     */
    @Bean(name = "emailFreemarkerConfiguration")
    public freemarker.template.Configuration emailFreemarkerConfiguration() {
        FreeMarkerConfigurationFactoryBean factoryBean = new FreeMarkerConfigurationFactoryBean();
        factoryBean.setTemplateLoaderPath("classpath:/templates/");
        factoryBean.setDefaultEncoding("UTF-8");

        try {
            freemarker.template.Configuration config = factoryBean.createConfiguration();
            return config;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Freemarker configuration", e);
        }
    }

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(MailConfig.class);
}
