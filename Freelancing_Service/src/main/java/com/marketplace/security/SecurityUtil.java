package com.marketplace.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.marketplace.user.User;
import com.marketplace.user.UserRepository;

@Component
public class SecurityUtil {

	private final UserRepository userRepository;

	public SecurityUtil(UserRepository userRepository) {
		super();
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
	
	public boolean isFreelancer() {
		return getCurrentUser().getRole() == com.marketplace.user.Role.FREELANCER;
	}
	
	public boolean isAdmin() {
		return getCurrentUser().getRole() == com.marketplace.user.Role.ADMIN;
	}
}
