package com.blooddonation.notificationservice.dto;

import com.blooddonation.notificationservice.model.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * Used to broadcast a single alert (e.g. "urgent need for O- blood in Colombo")
 * to a list of recipients in one call. Typically triggered by the
 * Request & Matching Service once matching donors have been found.
 */
public class AlertRequestDTO {

    @NotNull(message = "Channel is required (EMAIL or SMS)")
    private NotificationType channel;

    @NotBlank(message = "Message is required")
    private String message;

    private String subject; // used when channel = EMAIL, ignored for SMS

    private String bloodType;   // optional context, stored for traceability
    private String location;    // optional context, stored for traceability

    @NotEmpty(message = "At least one recipient contact is required")
    private List<@NotBlank String> recipientContacts; // list of emails or phone numbers

    public NotificationType getChannel() { return channel; }
    public void setChannel(NotificationType channel) { this.channel = channel; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public List<String> getRecipientContacts() { return recipientContacts; }
    public void setRecipientContacts(List<String> recipientContacts) { this.recipientContacts = recipientContacts; }
}
