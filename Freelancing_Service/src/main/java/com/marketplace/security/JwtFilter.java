package com.marketplace.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private CustomUserDetailsService userDetailsService;

    // ADD THIS METHOD to skip JWT validation for public endpoints
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        
        // Skip JWT filter for these public endpoints
        return path.startsWith("/api/auth/") ||
               path.equals("/") ||
               path.equals("/health") ||
               path.equals("/api") ||
               path.equals("/api/") ||
               path.equals("/api/health") ||
               path.equals("/api/status") ||
               path.equals("/api/test-public") ||
               path.equals("/api/test-secure") ||
               path.startsWith("/api/test/") ||
               path.equals("/api/jobs/open") ||
               path.startsWith("/api/jobs/search") ||
               path.matches("/api/jobs/\\d+") ||  // Matches /api/jobs/{id}
               path.startsWith("/v3/api-docs/") ||
               path.startsWith("/swagger-ui/") ||
               path.equals("/swagger-ui.html") ||
               path.startsWith("/actuator/") ||
               path.startsWith("/uploads/");
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) 
            throws ServletException, IOException {
            
        String authHeader = request.getHeader("Authorization");
        
        String token = null;
        String email = null;
        
        if(authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            email = jwtUtil.extractEmail(token);
        }
        
        if(email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            
            if(jwtUtil.validateToken(token)) {
                
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authToken);
                
                // ========== ADD THIS LINE ==========
                // Set userId attribute for rate limiting filter
                request.setAttribute("userId", email);
                // ===================================
            }
        }
        
        filterChain.doFilter(request, response);
    }
}