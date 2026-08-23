package com.blooddonation.notificationservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Wraps Spring's JavaMailSender. When notification.mock-mode=true (the default,
 * so the service is runnable during marking without real SMTP credentials) it
 * only logs the email instead of dispatching it. Set NOTIFICATION_MOCK_MODE=false
 * and provide MAIL_USERNAME / MAIL_PASSWORD to send real emails.
 */
@Service
public class EmailSenderService {

    private static final Logger log = LoggerFactory.getLogger(EmailSenderService.class);

    private final JavaMailSender mailSender;

    @Value("${notification.mock-mode:true}")
    private boolean mockMode;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    @Autowired
    public EmailSenderService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void send(String toEmail, String subject, String body) {
        if (mockMode || fromAddress == null || fromAddress.isBlank() || mailSender == null) {
            log.info("[MOCK EMAIL] to={} subject='{}' body='{}'", toEmail, subject, body);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}
