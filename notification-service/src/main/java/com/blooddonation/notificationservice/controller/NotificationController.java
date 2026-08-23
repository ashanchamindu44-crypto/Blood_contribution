package com.blooddonation.notificationservice.controller;

import com.blooddonation.notificationservice.dto.AlertRequestDTO;
import com.blooddonation.notificationservice.dto.EmailNotificationRequestDTO;
import com.blooddonation.notificationservice.dto.NotificationResponseDTO;
import com.blooddonation.notificationservice.dto.SmsNotificationRequestDTO;
import com.blooddonation.notificationservice.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notify")
@Tag(name = "Notification API", description = "API for sending email/SMS notifications and broadcast alerts")
@SecurityRequirement(name = "ApiKey")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/email")
    @Operation(summary = "Send an email notification to a single recipient")
    public ResponseEntity<?> sendEmail(@RequestBody @Valid EmailNotificationRequestDTO request) {
        NotificationResponseDTO result = notificationService.sendEmail(request);
        HttpStatus status = "FAILED".equals(result.getStatus().name())
                ? HttpStatus.BAD_GATEWAY
                : HttpStatus.CREATED;
        return new ResponseEntity<>(result, status);
    }

    @PostMapping("/sms")
    @Operation(summary = "Send an SMS notification to a single recipient")
    public ResponseEntity<?> sendSms(@RequestBody @Valid SmsNotificationRequestDTO request) {
        NotificationResponseDTO result = notificationService.sendSms(request);
        HttpStatus status = "FAILED".equals(result.getStatus().name())
                ? HttpStatus.BAD_GATEWAY
                : HttpStatus.CREATED;
        return new ResponseEntity<>(result, status);
    }

    @PostMapping("/alerts")
    @Operation(summary = "Broadcast a single alert message (e.g. urgent blood request) to multiple recipients")
    public ResponseEntity<?> sendAlert(@RequestBody @Valid AlertRequestDTO request) {
        List<NotificationResponseDTO> results = notificationService.sendAlert(request);
        return new ResponseEntity<>(Map.of(
                "totalRecipients", results.size(),
                "notifications", results
        ), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get the full notification log")
    public ResponseEntity<List<NotificationResponseDTO>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single notification record by ID")
    public ResponseEntity<?> getNotificationById(@PathVariable String id) {
        return notificationService.getNotificationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/recipient/{recipientId}")
    @Operation(summary = "Get all notifications sent to a given recipient/donor ID")
    public ResponseEntity<List<NotificationResponseDTO>> getByRecipient(@PathVariable String recipientId) {
        return ResponseEntity.ok(notificationService.getNotificationsByRecipient(recipientId));
    }
}
