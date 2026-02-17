package com.marketplace.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

	@Autowired
	private JwtFilter jwtFilter;

	@Value("${app.cors.allowed-origins}")
	private String allowedOrigins;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	    http
	        .csrf(csrf -> csrf.disable())
	        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
	        .sessionManagement(session -> session
	            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	        .authorizeHttpRequests(auth -> auth
	            // Public endpoints
	            .requestMatchers("/", "/health", "/api/health", "/api/status").permitAll()
	            .requestMatchers("/api/auth/**").permitAll()
	            .requestMatchers("/api/test/**").permitAll()
	            .requestMatchers("/api/jobs/open", "/api/jobs/search").permitAll()
	            .requestMatchers("/api/jobs/{id:[0-9]+}").permitAll()
	            .requestMatchers("/actuator/health/**", "/actuator/info").permitAll()
	            .requestMatchers("/uploads/**").permitAll()
	            
	            // Admin endpoints
	            .requestMatchers("/api/admin/**").hasRole("ADMIN")
	            
	            // Role-based endpoints
	            .requestMatchers("/api/client/**").hasRole("CLIENT")
	            .requestMatchers("/api/freelancer/**").hasRole("FREELANCER")
	            
	            // Authenticated endpoints
	            .requestMatchers("/api/jobs/**").authenticated()
	            .requestMatchers("/api/proposals/**").authenticated()
	            .requestMatchers("/api/contracts/**").authenticated()
	            .requestMatchers("/api/payments/**").authenticated()
	            .requestMatchers("/api/profile/**").authenticated()
	            
	            .anyRequest().authenticated()
	        )
	        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

	    return http.build();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration configuration = new CorsConfiguration();
	    configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
	    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
	    configuration.setAllowedHeaders(Arrays.asList(
	        "Origin", "Content-Type", "Accept", "Authorization", 
	        "X-Requested-With", "Access-Control-Request-Method", 
	        "Access-Control-Request-Headers"
	    ));
	    configuration.setExposedHeaders(Arrays.asList(
	        "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials", 
	        "Authorization", "Content-Disposition", "X-Rate-Limit-Remaining", 
	        "X-Rate-Limit-Limit"
	    ));
	    configuration.setAllowCredentials(true);
	    configuration.setMaxAge(3600L);
	    
	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", configuration);
	    return source;
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
	    return config.getAuthenticationManager();
	}
}