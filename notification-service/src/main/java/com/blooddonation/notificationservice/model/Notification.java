package com.blooddonation.notificationservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    // Optional reference to the donor/recipient/hospital this notification concerns
    // (kept as a plain String id rather than a foreign key, consistent with the
    // other services which each own their own MongoDB collection).
    private String recipientId;

    private String recipientContact; // email address or phone number

    private NotificationType type;   // EMAIL, SMS, ALERT

    private String subject;

    private String message;

    private NotificationStatus status; // PENDING, SENT, FAILED

    private String failureReason;

    private LocalDateTime sentAt;

    public Notification() {
    }

    public Notification(String recipientId, String recipientContact, NotificationType type,
                         String subject, String message) {
        this.recipientId = recipientId;
        this.recipientContact = recipientContact;
        this.type = type;
        this.subject = subject;
        this.message = message;
        this.status = NotificationStatus.PENDING;
        this.sentAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(String recipientId) {
        this.recipientId = recipientId;
    }

    public String getRecipientContact() {
        return recipientContact;
    }

    public void setRecipientContact(String recipientContact) {
        this.recipientContact = recipientContact;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public NotificationStatus getStatus() {
        return status;
    }

    public void setStatus(NotificationStatus status) {
        this.status = status;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}
