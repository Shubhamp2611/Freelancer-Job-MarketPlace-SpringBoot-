package com.marketplace.setup;

import com.marketplace.user.Role;
import com.marketplace.user.User;
import com.marketplace.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public DatabaseInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public void run(String... args) throws Exception {
        // Create admin user if not exists
        if (!userRepository.existsByEmail("admin@marketplace.com")) {
            User admin = new User();
            admin.setName("Administrator");
            admin.setEmail("admin@marketplace.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Admin user created");
        }
        
        // Create sample client
        if (!userRepository.existsByEmail("client@example.com")) {
            User client = new User();
            client.setName("John Client");
            client.setEmail("client@example.com");
            client.setPassword(passwordEncoder.encode("client123"));
            client.setRole(Role.CLIENT);
            userRepository.save(client);
            System.out.println("Sample client created");
        }
        
        // Create sample freelancer
        if (!userRepository.existsByEmail("freelancer@example.com")) {
            User freelancer = new User();
            freelancer.setName("Jane Freelancer");
            freelancer.setEmail("freelancer@example.com");
            freelancer.setPassword(passwordEncoder.encode("freelancer123"));
            freelancer.setRole(Role.FREELANCER);
            freelancer.setSkills("Java,Spring Boot,React");
            freelancer.setHourlyRate(50.0);
            userRepository.save(freelancer);
            System.out.println("Sample freelancer created");
        }
    }
}