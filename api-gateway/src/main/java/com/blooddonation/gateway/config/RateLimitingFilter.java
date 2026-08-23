package com.blooddonation.gateway.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    @Value("${gateway.rate-limit.requests-per-minute:60}")
    private int maxRequestsPerMinute;

    private final Map<String, ClientRequestCount> requestCounts = new ConcurrentHashMap<>();

    private static class ClientRequestCount {
        long minuteTimestamp;
        AtomicInteger count;

        ClientRequestCount(long minuteTimestamp) {
            this.minuteTimestamp = minuteTimestamp;
            this.count = new AtomicInteger(1);
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String clientIp = getClientIp(request);
        long currentMinute = System.currentTimeMillis() / 60000;

        ClientRequestCount clientCount = requestCounts.compute(clientIp, (ip, existing) -> {
            if (existing == null || existing.minuteTimestamp != currentMinute) {
                return new ClientRequestCount(currentMinute);
            }
            existing.count.incrementAndGet();
            return existing;
        });

        if (clientCount.count.get() > maxRequestsPerMinute) {
            response.setStatus(429); // 429 Too Many Requests
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Rate limit exceeded. Too many requests per minute.\"}");
            return;
        }

        response.addHeader("X-RateLimit-Limit", String.valueOf(maxRequestsPerMinute));
        response.addHeader("X-RateLimit-Remaining", String.valueOf(Math.max(0, maxRequestsPerMinute - clientCount.count.get())));

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
