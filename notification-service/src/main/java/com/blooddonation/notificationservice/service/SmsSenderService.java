package com.blooddonation.notificationservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Mock SMS provider. No third-party SMS account is required to run/mark this
 * service - every "send" is logged and recorded as SENT in MongoDB. To wire up
 * a real provider (e.g. Twilio), replace the body of send() with an HTTP/SDK
 * call and read the credentials from notification.sms.* properties.
 */
@Service
public class SmsSenderService {

    private static final Logger log = LoggerFactory.getLogger(SmsSenderService.class);

    @Value("${notification.sms.provider:mock}")
    private String provider;

    public void send(String toPhone, String body) {
        // Real integration point: if ("twilio".equalsIgnoreCase(provider)) { ... }
        log.info("[{} SMS] to={} body='{}'", provider.toUpperCase(), toPhone, body);
    }
}
