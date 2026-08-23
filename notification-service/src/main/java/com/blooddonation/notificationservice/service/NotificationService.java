package com.blooddonation.notificationservice.service;

import com.blooddonation.notificationservice.dto.AlertRequestDTO;
import com.blooddonation.notificationservice.dto.EmailNotificationRequestDTO;
import com.blooddonation.notificationservice.dto.NotificationResponseDTO;
import com.blooddonation.notificationservice.dto.SmsNotificationRequestDTO;
import com.blooddonation.notificationservice.model.Notification;
import com.blooddonation.notificationservice.model.NotificationStatus;
import com.blooddonation.notificationservice.model.NotificationType;
import com.blooddonation.notificationservice.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final EmailSenderService emailSenderService;
    private final SmsSenderService smsSenderService;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository,
                                EmailSenderService emailSenderService,
                                SmsSenderService smsSenderService) {
        this.notificationRepository = notificationRepository;
        this.emailSenderService = emailSenderService;
        this.smsSenderService = smsSenderService;
    }

    public NotificationResponseDTO sendEmail(EmailNotificationRequestDTO request) {
        Notification notification = new Notification(
                request.getRecipientId(),
                request.getRecipientEmail(),
                NotificationType.EMAIL,
                request.getSubject(),
                request.getMessage()
        );

        dispatch(notification, () -> emailSenderService.send(
                request.getRecipientEmail(), request.getSubject(), request.getMessage()));

        return NotificationResponseDTO.fromEntity(notificationRepository.save(notification));
    }

    public NotificationResponseDTO sendSms(SmsNotificationRequestDTO request) {
        Notification notification = new Notification(
                request.getRecipientId(),
                request.getRecipientPhone(),
                NotificationType.SMS,
                null,
                request.getMessage()
        );

        dispatch(notification, () -> smsSenderService.send(request.getRecipientPhone(), request.getMessage()));

        return NotificationResponseDTO.fromEntity(notificationRepository.save(notification));
    }

    /**
     * Broadcasts one alert message to every contact in the request (e.g. all donors
     * matching a requested blood type). Each recipient gets its own persisted
     * Notification record so delivery can be tracked/audited individually.
     */
    public List<NotificationResponseDTO> sendAlert(AlertRequestDTO request) {
        List<Notification> results = new ArrayList<>();

        for (String contact : request.getRecipientContacts()) {
            Notification notification = new Notification(
                    null,
                    contact,
                    NotificationType.ALERT,
                    request.getSubject(),
                    buildAlertMessage(request)
            );

            if (request.getChannel() == NotificationType.EMAIL) {
                dispatch(notification, () -> emailSenderService.send(
                        contact,
                        Optional.ofNullable(request.getSubject()).orElse("Blood Donation Alert"),
                        buildAlertMessage(request)));
            } else {
                dispatch(notification, () -> smsSenderService.send(contact, buildAlertMessage(request)));
            }

            results.add(notification);
        }

        return notificationRepository.saveAll(results).stream()
                .map(NotificationResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<NotificationResponseDTO> getAllNotifications() {
        return notificationRepository.findAll().stream()
                .map(NotificationResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Optional<NotificationResponseDTO> getNotificationById(String id) {
        return notificationRepository.findById(id).map(NotificationResponseDTO::fromEntity);
    }

    public List<NotificationResponseDTO> getNotificationsByRecipient(String recipientId) {
        return notificationRepository.findByRecipientId(recipientId).stream()
                .map(NotificationResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    private String buildAlertMessage(AlertRequestDTO request) {
        StringBuilder sb = new StringBuilder(request.getMessage());
        if (request.getBloodType() != null && !request.getBloodType().isBlank()) {
            sb.append(" | Blood Type: ").append(request.getBloodType());
        }
        if (request.getLocation() != null && !request.getLocation().isBlank()) {
            sb.append(" | Location: ").append(request.getLocation());
        }
        return sb.toString();
    }

    private void dispatch(Notification notification, Runnable sendAction) {
        try {
            sendAction.run();
            notification.setStatus(NotificationStatus.SENT);
        } catch (Exception e) {
            log.error("Failed to dispatch {} notification to {}: {}",
                    notification.getType(), notification.getRecipientContact(), e.getMessage());
            notification.setStatus(NotificationStatus.FAILED);
            notification.setFailureReason(e.getMessage());
        }
    }
}
