package com.blooddonation.donorservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class ApiKeyAuthFilter extends OncePerRequestFilter {

    private static final String API_KEY_HEADER = "X-API-KEY";

    @Value("${api.security.key:blood_donation_secret_key_2026}")
    private String apiKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // Allow Swagger UI and API Docs without authentication
        String path = request.getRequestURI();
        if (path.startsWith("/swagger-ui") || path.startsWith("/api-docs") || path.startsWith("/v3/api-docs")) {
            filterChain.doFilter(request, response);
            return;
        }

        String requestApiKey = request.getHeader(API_KEY_HEADER);

        if (requestApiKey == null || !requestApiKey.equals(apiKey)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid or missing API Key");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
