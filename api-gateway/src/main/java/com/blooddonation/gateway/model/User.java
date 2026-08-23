package com.blooddonation.gateway.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String email;
    private String password;
    private String fullName;
    private String bloodGroup;
    private String city;
    private String phone;
    private UserRole role;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

    public User() {}

    public User(String id, String email, String password, String fullName, String bloodGroup, String city, String phone, UserRole role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.bloodGroup = bloodGroup;
        this.city = city;
        this.phone = phone;
        this.role = role;
        this.createdAt = LocalDateTime.now();
        this.lastLogin = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
}
