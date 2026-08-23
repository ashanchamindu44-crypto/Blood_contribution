package com.blooddonation.gateway.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.*;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;

@RestController
@Tag(name = "Gateway Reverse Proxy", description = "Routes client traffic to downstream microservices with authentication & API keys")
public class GatewayProxyController {

    private static final Logger log = LoggerFactory.getLogger(GatewayProxyController.class);

    private final RestTemplate restTemplate;

    @Value("${services.donor.url:http://localhost:8081}")
    private String donorServiceUrl;

    @Value("${services.inventory.url:http://localhost:8082}")
    private String inventoryServiceUrl;

    @Value("${services.request.url:http://localhost:8083}")
    private String requestServiceUrl;

    @Value("${services.notification.url:http://localhost:8084}")
    private String notificationServiceUrl;

    @Value("${gateway.security.api-key-secret:blood_donation_secret_key_2026}")
    private String apiKeySecret;

    public GatewayProxyController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @RequestMapping(value = {"/donors", "/donors/**"})
    @Operation(summary = "Proxy to Donor Microservice")
    public ResponseEntity<?> proxyDonorService(HttpServletRequest request,
                                               @RequestBody(required = false) byte[] body) {
        return forwardRequest(request, donorServiceUrl, body);
    }

    @RequestMapping(value = {"/inventory", "/inventory/**"})
    @Operation(summary = "Proxy to Blood Inventory Microservice")
    public ResponseEntity<?> proxyInventoryService(HttpServletRequest request,
                                                   @RequestBody(required = false) byte[] body) {
        return forwardRequest(request, inventoryServiceUrl, body);
    }

    @RequestMapping(value = {"/requests", "/requests/**"})
    @Operation(summary = "Proxy to Blood Request & Matching Microservice")
    public ResponseEntity<?> proxyRequestService(HttpServletRequest request,
                                                 @RequestBody(required = false) byte[] body) {
        return forwardRequest(request, requestServiceUrl, body);
    }

    @RequestMapping(value = {"/notify", "/notify/**"})
    @Operation(summary = "Proxy to Notification Microservice")
    public ResponseEntity<?> proxyNotificationService(HttpServletRequest request,
                                                      @RequestBody(required = false) byte[] body) {
        return forwardRequest(request, notificationServiceUrl, body);
    }

    private ResponseEntity<?> forwardRequest(HttpServletRequest request, String targetBaseUrl, byte[] body) {
        String requestUri = request.getRequestURI();
        String queryString = request.getQueryString();
        String targetUrl = targetBaseUrl + requestUri + (queryString != null ? "?" + queryString : "");

        HttpMethod method = HttpMethod.valueOf(request.getMethod());

        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            if (!headerName.equalsIgnoreCase("host") && !headerName.equalsIgnoreCase("content-length")) {
                headers.addAll(headerName, Collections.list(request.getHeaders(headerName)));
            }
        }

        // Always inject internal API Key for downstream service communication
        headers.set("X-API-KEY", apiKeySecret);

        HttpEntity<byte[]> httpEntity = new HttpEntity<>(body, headers);

        try {
            log.info("Gateway routing {} {} -> {}", method, requestUri, targetUrl);
            return restTemplate.exchange(new URI(targetUrl), method, httpEntity, byte[].class);
        } catch (HttpStatusCodeException e) {
            log.warn("Downstream service returned error: {} {}", e.getStatusCode(), e.getStatusText());
            return ResponseEntity.status(e.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(e.getResponseBodyAsString());
        } catch (ResourceAccessException e) {
            log.error("Downstream service unavailable at {}: {}", targetUrl, e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\": \"Downstream service is currently unavailable\", \"serviceUrl\": \"" + targetBaseUrl + "\"}");
        } catch (URISyntaxException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"Invalid URI syntax\"}");
        }
    }
}
