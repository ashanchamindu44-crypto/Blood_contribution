package com.blooddonation.inventoryservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "blood_inventory")
public class BloodInventory {

    @Id
    private String id;

    @Indexed(unique = true)
    private String bloodType; // e.g. "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"

    private int units;

    private String location;

    private LocalDateTime lastUpdated;

    public BloodInventory() {
    }

    public BloodInventory(String bloodType, int units, String location, LocalDateTime lastUpdated) {
        this.bloodType = bloodType;
        this.units = units;
        this.location = location;
        this.lastUpdated = lastUpdated;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
