package com.blooddonation.gateway.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "login_logs")
public class LoginLog {

    @Id
    private String id;
    private String userId;
    private String email;
    private UserRole role;
    private String action;
    private LocalDateTime timestamp;

    public LoginLog() {
    }

    public LoginLog(String userId, String email, UserRole role, String action) {
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.action = action;
        this.timestamp = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}