package com.marketplace.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class TestController {
    
    @GetMapping("/")
    public String home() {
        return "Freelance Marketplace API is running!";
    }
    
    @GetMapping("/api")
    public String apiRoot() {
        return "API endpoints available at /api/*";
    }
    
    @GetMapping("/health")
    public String health() {
        return "{\"status\":\"UP\"}";
    }
    
    @GetMapping("/api/test")
    public String test() {
        return "Test endpoint working!";
    }
}