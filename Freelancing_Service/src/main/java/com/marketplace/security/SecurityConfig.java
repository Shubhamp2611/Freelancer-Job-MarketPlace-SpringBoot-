package com.marketplace.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // ========== PUBLIC ENDPOINTS ==========
                // Specific endpoints first (most specific to least specific)
                .requestMatchers("/").permitAll()
                .requestMatchers("/health").permitAll()
                .requestMatchers("/api").permitAll()
                .requestMatchers("/api/").permitAll()
                .requestMatchers("/api/health").permitAll()
                .requestMatchers("/api/status").permitAll()  // ADDED THIS
                .requestMatchers("/api/test-public").permitAll()  // ADDED THIS
                .requestMatchers("/api/test-secure").permitAll()  // Let's make this public for testing
                
                // Auth endpoints (pattern)
                .requestMatchers("/api/auth/**").permitAll()
                
                // Test endpoints (pattern)
                .requestMatchers("/api/test/**").permitAll()
                
                // Public job endpoints
                .requestMatchers("/api/jobs/open").permitAll()
                .requestMatchers("/api/jobs/search").permitAll()
                .requestMatchers("/api/jobs/{id:[0-9]+}").permitAll()
                
                // Swagger/OpenAPI documentation
                .requestMatchers("/v3/api-docs/**").permitAll()
                .requestMatchers("/swagger-ui/**").permitAll()
                .requestMatchers("/swagger-ui.html").permitAll()
                
                // Actuator endpoints (for monitoring)
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/actuator/health/**").permitAll()
                .requestMatchers("/actuator/info").permitAll()
                
                // Uploads directory
                .requestMatchers("/uploads/**").permitAll()
                
                // ========== ROLE-BASED ENDPOINTS ==========
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/client/**").hasRole("CLIENT")
                .requestMatchers("/api/freelancer/**").hasRole("FREELANCER")
                
                // ========== AUTHENTICATED ENDPOINTS ==========
                // Job endpoints (except the public ones above)
                .requestMatchers("/api/jobs/**").authenticated()
                
                // Proposal endpoints
                .requestMatchers("/api/proposals/**").authenticated()
                .requestMatchers("/api/proposals/my-proposals").authenticated()
                
                // Contract endpoints
                .requestMatchers("/api/contracts/**").authenticated()
                
                // Payment endpoints
                .requestMatchers("/api/payments/**").authenticated()
                
                // Profile endpoints
                .requestMatchers("/api/profile/**").authenticated()
                
                // ========== CATCH-ALL FOR OTHER /API ENDPOINTS ==========
                // This should come AFTER all specific /api rules
                .requestMatchers("/api/**").authenticated()
                
                // ========== FINAL CATCH-ALL ==========
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("http://localhost:8080");
        config.addAllowedOrigin("http://localhost:10000");  // ADDED THIS
        config.addAllowedHeader("*");
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("PATCH");
        config.addAllowedMethod("OPTIONS");
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}