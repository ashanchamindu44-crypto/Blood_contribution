package com.blooddonation.donorservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class DonationRequestDTO {
    
    @NotNull(message = "Donation date is required")
    private LocalDate donationDate;
    
    @NotNull(message = "Units donated is required")
    @Min(value = 1, message = "At least 1 unit must be donated")
    private Integer unitsDonated;
    
    @NotBlank(message = "Location is required")
    private String location;

    // Getters and Setters
    public LocalDate getDonationDate() { return donationDate; }
    public void setDonationDate(LocalDate donationDate) { this.donationDate = donationDate; }
    
    public Integer getUnitsDonated() { return unitsDonated; }
    public void setUnitsDonated(Integer unitsDonated) { this.unitsDonated = unitsDonated; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
