package com.marketplace.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class HealthController {
    
    @GetMapping("/")
    public String root() {
        return "Freelance Marketplace API is running!";
    }
    
    @GetMapping("/health")
    public String health() {
        return "{\"status\":\"UP\", \"timestamp\":\"" + new java.util.Date() + "\"}";
    }
    
    @GetMapping("/status")
    public String status() {
        return "{\"service\":\"freelance-marketplace\",\"version\":\"1.0\",\"status\":\"running\"}";
    }
    
    @GetMapping("/test-public")
    public String testPublic() {
        return "{\"message\":\"Public endpoint is accessible without authentication!\", \"timestamp\":\"" + new java.util.Date() + "\"}";
    }
    
    @GetMapping("/test-secure")
    public String testSecure() {
        return "{\"message\":\"This endpoint requires authentication!\", \"timestamp\":\"" + new java.util.Date() + "\"}";
    }
}