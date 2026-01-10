package com.marketplace.auth;

import jakarta.transaction.Transactional;
import java.time.Instant;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.marketplace.security.JwtUtil;
import com.marketplace.user.Role;
import com.marketplace.user.User;
import com.marketplace.user.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    private final long REFRESH_TOKEN_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       RefreshTokenRepository refreshTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Transactional
    public AuthResponse register(RegistrationRequest request) {
        System.out.println("=== Starting registration ===");
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.USER);

        System.out.println("Saving user...");
        User savedUser = userRepository.save(user);
        System.out.println("User saved with ID: " + savedUser.getId());

        // Generate tokens
        return generateTokens(savedUser);
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return generateTokens(user);
    }

    @Transactional
    private AuthResponse generateTokens(User user) {
        System.out.println("Generating tokens for user ID: " + user.getId());
        
        String accessToken = jwtUtil.generateToken(user.getEmail());

        // Create refresh token
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(REFRESH_TOKEN_DURATION_MS));

        // Remove old tokens
        try {
            refreshTokenRepository.deleteByUser(user);
        } catch (Exception e) {
            System.out.println("No old tokens to delete: " + e.getMessage());
        }
        
        // Save refresh token
        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);
        System.out.println("Refresh token saved with ID: " + savedToken.getId());

        return new AuthResponse(accessToken, refreshToken.getToken(), user.getEmail());
    }

    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        RefreshToken tokenEntity = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (tokenEntity.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(tokenEntity);
            throw new RuntimeException("Refresh token expired");
        }

        String newAccessToken = jwtUtil.generateToken(tokenEntity.getUser().getEmail());
        return new AuthResponse(newAccessToken, refreshToken, tokenEntity.getUser().getEmail());
    }
}