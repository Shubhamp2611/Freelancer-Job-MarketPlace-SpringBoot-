package com.marketplace.tes;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    
    @GetMapping("/test")
    public String test() {
        return "Application is running!";
    }
    
    @GetMapping("/api/test/public")
    public String publicTest() {
        return "Public endpoint is accessible!";
    }
}