package com.marketplace.profile;

import com.marketplace.security.SecurityUtil;
import com.marketplace.user.User;
import com.marketplace.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;
    private final ProfileService profileService;
    
    public ProfileController(UserRepository userRepository, 
                           SecurityUtil securityUtil,
                           ProfileService profileService) {
        this.userRepository = userRepository;
        this.securityUtil = securityUtil;
        this.profileService = profileService;
    }
    
    // GET: Get my profile
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMyProfile() {
        User user = securityUtil.getCurrentUser();
        
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole());
        profile.put("createdAt", user.getCreatedAt());
        
        // Add additional profile info
        profile.put("bio", user.getBio());
        profile.put("skills", user.getSkills());
        profile.put("profilePicture", user.getProfilePicture());
        profile.put("hourlyRate", user.getHourlyRate());
        profile.put("rating", user.getRating());
        profile.put("completedJobs", user.getCompletedJobs());
        
        return ResponseEntity.ok(profile);
    }
    
    // PUT: Update profile
    @PutMapping
    public ResponseEntity<Map<String, Object>> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        User user = securityUtil.getCurrentUser();
        
        // Update allowed fields
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getSkills() != null) {
            user.setSkills(request.getSkills());
        }
        if (request.getHourlyRate() != null) {
            user.setHourlyRate(request.getHourlyRate());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getCountry() != null) {
            user.setCountry(request.getCountry());
        }
        
        User updatedUser = userRepository.save(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profile updated successfully");
        response.put("user", updatedUser);
        
        return ResponseEntity.ok(response);
    }
    
    // POST: Upload profile picture
    @PostMapping("/picture")
    public ResponseEntity<Map<String, Object>> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            String pictureUrl = profileService.uploadProfilePicture(file, securityUtil.getCurrentUserId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile picture uploaded successfully");
            response.put("pictureUrl", pictureUrl);
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload profile picture");
        }
    }
    
    // GET: Get freelancer profiles (for browsing)
    @GetMapping("/freelancers")
    public ResponseEntity<?> getFreelancers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String skills,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double maxHourlyRate) {
        
        return ResponseEntity.ok(profileService.getFreelancers(page, size, skills, minRating, maxHourlyRate));
    }
    
    // GET: Get client profiles
    @GetMapping("/clients")
    public ResponseEntity<?> getClients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        return ResponseEntity.ok(profileService.getClients(page, size));
    }
}