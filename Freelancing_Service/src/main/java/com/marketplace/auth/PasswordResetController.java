package com.marketplace.auth;

import com.marketplace.email.EmailService;
import com.marketplace.user.User;
import com.marketplace.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {
    
    private final UserRepository userRepository;
    private final PasswordResetRepository passwordResetRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    
    public PasswordResetController(UserRepository userRepository,
                                 PasswordResetRepository passwordResetRepository,
                                 EmailService emailService,
                                 PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordResetRepository = passwordResetRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }
    
    // Request password reset
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Delete existing tokens
        passwordResetRepository.deleteByUser(user);
        
        // Create new token
        PasswordResetToken token = new PasswordResetToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setExpiryDate(LocalDateTime.now().plusHours(24));
        
        passwordResetRepository.save(token);
        
        // Send email
        try {
            emailService.sendPasswordResetEmail(user.getEmail(), token.getToken());
        } catch (Exception e) {
            throw new RuntimeException("Failed to send reset email");
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset email sent");
        
        return ResponseEntity.ok(response);
    }
    
    // Reset password with token
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        PasswordResetToken token = passwordResetRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        
        // Check if token is expired
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }
        
        // Check if token already used
        if (token.getUsed()) {
            throw new RuntimeException("Token already used");
        }
        
        // Update password
        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        // Mark token as used
        token.setUsed(true);
        passwordResetRepository.save(token);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset successful");
        
        return ResponseEntity.ok(response);
    }
    
    // Change password (logged in user)
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        // Update to new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password changed successfully");
        
        return ResponseEntity.ok(response);
    }
}