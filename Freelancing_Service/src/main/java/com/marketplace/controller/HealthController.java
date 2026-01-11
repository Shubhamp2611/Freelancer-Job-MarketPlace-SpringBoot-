package com.marketplace.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")  // All endpoints will start with /api
public class HealthController {
    
    @GetMapping("/")
    public String root() {
        return "Freelance Marketplace API is running!";
    }
    
    @GetMapping("/health")
    public String health() {
        return "{\"status\":\"UP\"}";
    }
    
    @GetMapping("/status")
    public String status() {
        return "{\"service\":\"freelance-marketplace\",\"version\":\"1.0\",\"status\":\"running\"}";
    }
}