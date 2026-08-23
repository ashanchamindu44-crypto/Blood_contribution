package com.blooddonation.donorservice.dto;

import java.time.LocalDate;

public class DonorDTO {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String bloodType;
    private String location;
    private LocalDate lastDonationDate;
    private String eligibilityStatus;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public LocalDate getLastDonationDate() { return lastDonationDate; }
    public void setLastDonationDate(LocalDate lastDonationDate) { this.lastDonationDate = lastDonationDate; }
    
    public String getEligibilityStatus() { return eligibilityStatus; }
    public void setEligibilityStatus(String eligibilityStatus) { this.eligibilityStatus = eligibilityStatus; }
}
