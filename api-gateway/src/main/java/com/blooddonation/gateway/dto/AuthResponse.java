package com.blooddonation.gateway.dto;

import com.blooddonation.gateway.model.UserRole;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private String userId;
    private String email;
    private UserRole role;

    public AuthResponse(String token, String userId, String email, UserRole role) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.role = role;
    }

    public String getToken() { return token; }
    public String getTokenType() { return tokenType; }
    public String getUserId() { return userId; }
    public String getEmail() { return email; }
    public UserRole getRole() { return role; }
}
