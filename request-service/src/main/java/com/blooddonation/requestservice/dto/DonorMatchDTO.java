package com.blooddonation.requestservice.dto;

public class DonorMatchDTO {

    private String donorId;
    private String name;
    private String bloodType;
    private String location;
    private String phone;
    private String email;
    private boolean sameCity; // true if donor is in the same city as the requesting hospital

    public DonorMatchDTO() {
    }

    public DonorMatchDTO(String donorId, String name, String bloodType, String location,
                          String phone, String email, boolean sameCity) {
        this.donorId = donorId;
        this.name = name;
        this.bloodType = bloodType;
        this.location = location;
        this.phone = phone;
        this.email = email;
        this.sameCity = sameCity;
    }

    public String getDonorId() {
        return donorId;
    }

    public void setDonorId(String donorId) {
        this.donorId = donorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isSameCity() {
        return sameCity;
    }

    public void setSameCity(boolean sameCity) {
        this.sameCity = sameCity;
    }
}
