package com.blooddonation.requestservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BloodRequestDTO {

    private String id;

    @NotBlank(message = "recipientName is required")
    private String recipientName;

    @NotBlank(message = "bloodType is required")
    private String bloodType;

    @NotNull(message = "units is required")
    @Min(value = 1, message = "units must be at least 1")
    private Integer units;

    private String urgency; // CRITICAL, HIGH, NORMAL - defaults to NORMAL if omitted

    @NotBlank(message = "hospital is required")
    private String hospital;

    @NotBlank(message = "city is required")
    private String city;

    private String contact;

    private String status; // set by the server, ignored on create

    private String createdAt; // set by the server, ignored on create

    public BloodRequestDTO() {
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

    public Integer getUnits() {
        return units;
    }

    public void setUnits(Integer units) {
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

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
