package com.blooddonation.notificationservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class SmsNotificationRequestDTO {

    private String recipientId;

    @NotBlank(message = "Recipient phone number is required")
    @Pattern(regexp = "^\\+?[0-9\\-\\s]{7,15}$", message = "Recipient phone number is invalid")
    private String recipientPhone;

    @NotBlank(message = "Message is required")
    private String message;

    public String getRecipientId() { return recipientId; }
    public void setRecipientId(String recipientId) { this.recipientId = recipientId; }

    public String getRecipientPhone() { return recipientPhone; }
    public void setRecipientPhone(String recipientPhone) { this.recipientPhone = recipientPhone; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
