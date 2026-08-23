package com.blooddonation.inventoryservice.dto;

public class InventoryDTO {

    private String bloodType;
    private int units;
    private String status; // Healthy, Warning, Critical - derived from units
    private String location;
    private String lastUpdated; // formatted "yyyy-MM-dd HH:mm"

    public InventoryDTO() {
    }

    public InventoryDTO(String bloodType, int units, String status, String location, String lastUpdated) {
        this.bloodType = bloodType;
        this.units = units;
        this.status = status;
        this.location = location;
        this.lastUpdated = lastUpdated;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
