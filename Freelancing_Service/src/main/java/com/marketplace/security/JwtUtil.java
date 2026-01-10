package com.marketplace.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    
    // Use a simple hardcoded secret for now
    private final SecretKey key = Keys.hmacShaKeyFor("12345678901234567890123456789012".getBytes());
    private final long EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours 
    
    public String generateToken(String email) { 
        return Jwts.builder() 
               .setSubject(email) 
               .setIssuedAt(new Date()) 
               .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) 
               .signWith(key, SignatureAlgorithm.HS256) 
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