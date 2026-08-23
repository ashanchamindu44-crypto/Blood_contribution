package com.blooddonation.requestservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "blood_requests")
public class BloodRequest {

    @Id
    private String id;

    private String recipientName;

    private String bloodType; // e.g. "A+", "O-", etc.

    private int units;

    private String urgency; // CRITICAL, HIGH, NORMAL

    private String hospital;

    private String city; // used for location-proximity matching

    private String contact;

    private String status; // PENDING, MATCHING, FULFILLED

    private LocalDateTime createdAt;

    public BloodRequest() {
    }

    public BloodRequest(String recipientName, String bloodType, int units, String urgency,
                         String hospital, String city, String contact, String status, LocalDateTime createdAt) {
        this.recipientName = recipientName;
        this.bloodType = bloodType;
        this.units = units;
        this.urgency = urgency;
        this.hospital = hospital;
        this.city = city;
        this.contact = contact;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public int getUnits() {
        return units;
    }

    public void setUnits(int units) {
        this.units = units;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public String getHospital() {
        return hospital;
    }

    public void setHospital(String hospital) {
        this.hospital = hospital;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
