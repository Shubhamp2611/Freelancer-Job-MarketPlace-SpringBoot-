package com.marketplace.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Base64;

@Component
public class JwtUtil {
    
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    
    @Value("${app.jwt.expiration-ms}")
    private long expirationTime;
    
    private SecretKey key;
    
    @PostConstruct
    public void init() {
        // Ensure secret is long enough
        byte[] keyBytes;
        if (jwtSecret.length() < 32) {
            // If secret is too short, use a default (should not happen in production)
            keyBytes = Base64.getEncoder().encode("thisIsASecretKeyThatIsAtLeast32CharactersLong".getBytes());
        } else {
            keyBytes = jwtSecret.getBytes();
        }
        this.key = Keys.hmacShaKeyFor(keyBytes);
        System.out.println("JwtUtil initialized");
    }
    
    public String generateToken(String email) { 
        return Jwts.builder() 
               .setSubject(email) 
               .setIssuedAt(new Date()) 
               .setExpiration(new Date(System.currentTimeMillis() + expirationTime)) 
               .signWith(key) 
               .compact(); 
    } 
    
    public String extractEmail(String token) { 
        return getClaims(token).getSubject(); 
    } 
    
    public boolean validateToken(String token) { 
        try { 
            getClaims(token);
            return true; 
        } catch (Exception e) { 
            return false; 
        } 
    }
    
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}