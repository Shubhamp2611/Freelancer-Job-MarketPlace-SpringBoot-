package com.marketplace.security;  // Change from com.marketplace.util to com.marketplace.security

import com.marketplace.user.User;
import com.marketplace.user.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {
    
    private final UserRepository userRepository;
    
    public SecurityUtil(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if(authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found in database"));
    }
    
    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
    
    public boolean isClient() {
        return getCurrentUser().getRole() == com.marketplace.user.Role.CLIENT;
    }
    
    public boolean isFreelancer() {
        return getCurrentUser().getRole() == com.marketplace.user.Role.FREELANCER;
    }
    
    public boolean isAdmin() {
        return getCurrentUser().getRole() == com.marketplace.user.Role.ADMIN;
    }
}