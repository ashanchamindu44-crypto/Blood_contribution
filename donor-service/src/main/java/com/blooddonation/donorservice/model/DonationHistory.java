package com.blooddonation.donorservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "donation_history")
public class DonationHistory {

    @Id
    private String id;

    // In MongoDB, we can store the donorId as a reference rather than a full join.
    private String donorId;

    private LocalDate donationDate;

    private Integer unitsDonated;

    private String location;

    // Constructors, Getters, and Setters
    
    public DonationHistory() {}

    public DonationHistory(String donorId, LocalDate donationDate, Integer unitsDonated, String location) {
        this.donorId = donorId;
        this.donationDate = donationDate;
        this.unitsDonated = unitsDonated;
        this.location = location;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDonorId() {
        return donorId;
    }

    public void setDonorId(String donorId) {
        this.donorId = donorId;
    }

    public LocalDate getDonationDate() {
        return donationDate;
    }

    public void setDonationDate(LocalDate donationDate) {
        this.donationDate = donationDate;
    }

    public Integer getUnitsDonated() {
        return unitsDonated;
    }

    public void setUnitsDonated(Integer unitsDonated) {
        this.unitsDonated = unitsDonated;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
