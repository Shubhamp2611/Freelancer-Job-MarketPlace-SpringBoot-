package com.marketplace.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")  // This gives /api/test prefix
public class TestController {
    
    @GetMapping("/public")  // This becomes /api/test/public
    public String publicTest() {
        return "Public endpoint is accessible!";
    }
    
    @GetMapping("/health")  // This becomes /api/test/health
    public String health() {
        return "Test health endpoint working!";
    }
}