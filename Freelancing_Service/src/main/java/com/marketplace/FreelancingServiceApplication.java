package com.marketplace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import jakarta.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
public class FreelancingServiceApplication {
    
    @PostConstruct
    void started() {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }
    
    public static void main(String[] args) {
        // Render provides PORT env variable
        String port = System.getenv("PORT");
        if (port != null) {
            System.setProperty("server.port", port);
        } else {
            System.setProperty("server.port", "10000");
        }
        
        SpringApplication.run(FreelancingServiceApplication.class, args);
    }
}