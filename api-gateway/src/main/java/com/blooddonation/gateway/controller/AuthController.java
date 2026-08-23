package com.blooddonation.gateway.controller;

import com.blooddonation.gateway.dto.AuthResponse;
import com.blooddonation.gateway.dto.LoginRequest;
import com.blooddonation.gateway.dto.RegisterRequest;
import com.blooddonation.gateway.dto.UserProfileResponse;
import com.blooddonation.gateway.service.AuthService;
import com.blooddonation.gateway.service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@Tag(name = "User & Auth Controller", description = "Endpoints for OAuth 2.0 User Registration, Authentication & Gateway Validation")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user (Donor, Recipient, Hospital)", description = "Handles user registration and issues an initial OAuth 2.0 JWT Token.")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate User and issue OAuth 2.0 JWT Token", description = "Validates user credentials and returns a Bearer JWT Token.")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/profile")
    @Operation(summary = "Get Authenticated User Profile", description = "Returns user profile details matching the Authorization Bearer JWT Token.")
    public ResponseEntity<?> getProfile(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing or invalid Authorization header"));
        }

        String token = authHeader.substring(7);
        if (!jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Expired or invalid JWT Token"));
        }

        String email = jwtService.getEmailFromToken(token);
        try {
            UserProfileResponse profile = authService.getProfile(email);
            return ResponseEntity.ok(profile);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/validate")
    @Operation(summary = "Gateway Token Validation Endpoint", description = "Used by downstream microservices (Donor, Inventory, Request, Notification) to validate token headers.")
    public ResponseEntity<?> validateToken(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false, "message", "Missing Authorization header"));
        }

        String token = authHeader.substring(7);
        boolean isValid = jwtService.validateToken(token);
        if (isValid) {
            String email = jwtService.getEmailFromToken(token);
            return ResponseEntity.ok(Map.of("valid", true, "email", email));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false, "message", "Invalid token"));
        }
    }

    @GetMapping("/logs")
    @Operation(summary = "Get User Login & Activity Audit Logs", description = "Returns all user login and registration audit logs stored in MongoDB gateway_db.login_logs.")
    public ResponseEntity<?> getLogs() {
        return ResponseEntity.ok(authService.getLoginLogs());
    }
}
