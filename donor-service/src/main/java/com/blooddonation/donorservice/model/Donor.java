package com.blooddonation.donorservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "donors")
public class Donor {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String phone;

    private String bloodType;

    private String location;

    private LocalDate lastDonationDate;

    private String eligibilityStatus; // e.g., ELIGIBLE, INELIGIBLE

    // Constructors, Getters, and Setters

    public Donor() {
    }

    public Donor(String name, String email, String phone, String bloodType, String location, LocalDate lastDonationDate, String eligibilityStatus) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.bloodType = bloodType;
        this.location = location;
        this.lastDonationDate = lastDonationDate;
        this.eligibilityStatus = eligibilityStatus;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getLastDonationDate() {
        return lastDonationDate;
    }

    public void setLastDonationDate(LocalDate lastDonationDate) {
        this.lastDonationDate = lastDonationDate;
    }

    public String getEligibilityStatus() {
        return eligibilityStatus;
    }

    public void setEligibilityStatus(String eligibilityStatus) {
        this.eligibilityStatus = eligibilityStatus;
    }
}
