package com.blooddonation.notificationservice.dto;

import com.blooddonation.notificationservice.model.Notification;
import com.blooddonation.notificationservice.model.NotificationStatus;
import com.blooddonation.notificationservice.model.NotificationType;

import java.time.LocalDateTime;

public class NotificationResponseDTO {

    private String id;
    private String recipientId;
    private String recipientContact;
    private NotificationType type;
    private String subject;
    private String message;
    private NotificationStatus status;
    private String failureReason;
    private LocalDateTime sentAt;

    public static NotificationResponseDTO fromEntity(Notification n) {
        NotificationResponseDTO dto = new NotificationResponseDTO();
        dto.id = n.getId();
        dto.recipientId = n.getRecipientId();
        dto.recipientContact = n.getRecipientContact();
        dto.type = n.getType();
        dto.subject = n.getSubject();
        dto.message = n.getMessage();
        dto.status = n.getStatus();
        dto.failureReason = n.getFailureReason();
        dto.sentAt = n.getSentAt();
        return dto;
    }

    public String getId() { return id; }
    public String getRecipientId() { return recipientId; }
    public String getRecipientContact() { return recipientContact; }
    public NotificationType getType() { return type; }
    public String getSubject() { return subject; }
    public String getMessage() { return message; }
    public NotificationStatus getStatus() { return status; }
    public String getFailureReason() { return failureReason; }
    public LocalDateTime getSentAt() { return sentAt; }
}
