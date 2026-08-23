package com.blooddonation.gateway.dto;

import com.blooddonation.gateway.model.User;
import com.blooddonation.gateway.model.UserRole;

public class UserProfileResponse {
    private String id;
    private String email;
    private String fullName;
    private String bloodGroup;
    private String city;
    private String phone;
    private UserRole role;

    public UserProfileResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.fullName = user.getFullName();
        this.bloodGroup = user.getBloodGroup();
        this.city = user.getCity();
        this.phone = user.getPhone();
        this.role = user.getRole();
    }

    public String getId() { return id; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public String getBloodGroup() { return bloodGroup; }
    public String getCity() { return city; }
    public String getPhone() { return phone; }
    public UserRole getRole() { return role; }
}
