package com.marketplace.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {
    
    @Autowired(required = false)
    private JdbcTemplate jdbcTemplate;
    
    @GetMapping("/")
    public Map<String, Object> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "Freelance Marketplace API");
        response.put("status", "running");
        response.put("timestamp", new java.util.Date());
        response.put("version", "1.0.0");
        return response;
    }
    
    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", new java.util.Date());
        response.put("service", "freelance-marketplace-api");
        
        // Add database check
        Map<String, String> checks = new HashMap<>();
        checks.put("database", checkDatabase());
        checks.put("memory", checkMemory());
        
        response.put("checks", checks);
        return response;
    }
    
    @GetMapping("/health/detailed")
    public Map<String, Object> detailedHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", new java.util.Date());
        
        // System info
        Runtime runtime = Runtime.getRuntime();
        Map<String, Object> system = new HashMap<>();
        system.put("availableProcessors", runtime.availableProcessors());
        system.put("freeMemory", formatBytes(runtime.freeMemory()));
        system.put("totalMemory", formatBytes(runtime.totalMemory()));
        system.put("maxMemory", formatBytes(runtime.maxMemory()));
        system.put("usedMemory", formatBytes(runtime.totalMemory() - runtime.freeMemory()));
        
        response.put("system", system);
        
        // Database info
        if (jdbcTemplate != null) {
            try {
                String dbVersion = jdbcTemplate.queryForObject("SELECT VERSION()", String.class);
                response.put("database", "MySQL - " + dbVersion);
            } catch (Exception e) {
                response.put("database", "Error: " + e.getMessage());
            }
        }
        
        return response;
    }
    
    @GetMapping("/status")
    public Map<String, Object> status() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "freelance-marketplace");
        response.put("version", "1.0.0");
        response.put("status", "running");
        response.put("uptime", System.currentTimeMillis());
        return response;
    }
    
    @GetMapping("/test-public")
    public Map<String, Object> testPublic() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Public endpoint is accessible without authentication!");
        response.put("timestamp", new java.util.Date());
        response.put("type", "public");
        return response;
    }
    
    @GetMapping("/test-secure")
    public Map<String, Object> testSecure() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "This endpoint requires authentication!");
        response.put("timestamp", new java.util.Date());
        response.put("type", "secure");
        response.put("user", "authenticated");
        return response;
    }
    
    private String checkDatabase() {
        if (jdbcTemplate == null) {
            return "NOT AVAILABLE";
        }
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return result != null && result == 1 ? "UP" : "DOWN";
        } catch (Exception e) {
            return "DOWN: " + e.getMessage();
        }
    }
    
    private String checkMemory() {
        Runtime runtime = Runtime.getRuntime();
        long freeMemory = runtime.freeMemory();
        long totalMemory = runtime.totalMemory();
        long usedMemory = totalMemory - freeMemory;
        long maxMemory = runtime.maxMemory();
        
        double usedPercent = (usedMemory * 100.0) / maxMemory;
        
        if (usedPercent < 70) {
            return "HEALTHY (" + formatBytes(usedMemory) + " used)";
        } else if (usedPercent < 90) {
            return "WARNING (" + formatBytes(usedMemory) + " used)";
        } else {
            return "CRITICAL (" + formatBytes(usedMemory) + " used)";
        }
    }
    
    private String formatBytes(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp-1) + "";
        return String.format("%.1f %sB", bytes / Math.pow(1024, exp), pre);
    }
}