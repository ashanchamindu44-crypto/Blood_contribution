package com.blooddonation.notificationservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class EmailNotificationRequestDTO {

    // Optional link back to the donor/recipient record in another service
    private String recipientId;

    @NotBlank(message = "Recipient email is required")
    @Email(message = "Recipient email must be a valid email address")
    private String recipientEmail;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Message is required")
    private String message;

    public String getRecipientId() { return recipientId; }
    public void setRecipientId(String recipientId) { this.recipientId = recipientId; }

    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
