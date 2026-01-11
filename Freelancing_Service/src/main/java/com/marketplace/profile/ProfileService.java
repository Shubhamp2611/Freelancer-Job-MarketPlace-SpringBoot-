package com.marketplace.profile;

import com.marketplace.user.User;
import com.marketplace.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

@Service
public class ProfileService {
    
    private final UserRepository userRepository;
    private final String UPLOAD_DIR = "uploads/profile-pictures/";
    
    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
        createUploadDirectory();
    }
    
    private void createUploadDirectory() {
        try {
            Files.createDirectories(Path.of(UPLOAD_DIR));
        } catch (IOException e) {
            System.err.println("Failed to create upload directory: " + e.getMessage());
        }
    }
    
    public String uploadProfilePicture(MultipartFile file, Long userId) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String fileName = userId + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Path.of(UPLOAD_DIR + fileName);
        
        Files.copy(file.getInputStream(), filePath);
        
        // Save path to database
        String pictureUrl = "/uploads/profile-pictures/" + fileName;
        user.setProfilePicture(pictureUrl);
        userRepository.save(user);
        
        return pictureUrl;
    }
    
    public Map<String, Object> getFreelancers(int page, int size, String skills, Double minRating, Double maxHourlyRate) {
        Pageable pageable = PageRequest.of(page, size);
        
        // This is a simplified version - implement filtering logic based on your needs
        Page<User> freelancers = userRepository.findByRole(com.marketplace.user.Role.FREELANCER, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("freelancers", freelancers.getContent());
        response.put("currentPage", freelancers.getNumber());
        response.put("totalItems", freelancers.getTotalElements());
        response.put("totalPages", freelancers.getTotalPages());
        
        return response;
    }
    
    public Map<String, Object> getClients(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        
        Page<User> clients = userRepository.findByRole(com.marketplace.user.Role.CLIENT, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("clients", clients.getContent());
        response.put("currentPage", clients.getNumber());
        response.put("totalItems", clients.getTotalElements());
        response.put("totalPages", clients.getTotalPages());
        
        return response;
    }
}