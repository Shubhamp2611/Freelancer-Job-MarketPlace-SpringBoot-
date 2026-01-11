package com.marketplace.tes;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marketplace.security.SecurityUtil;

@RestController
@RequestMapping("/api/test")
public class UserTestController {

	private final SecurityUtil securityUtil;

	public UserTestController(SecurityUtil securityUtil) {
		super();
		this.securityUtil = securityUtil;
	}
	
	@GetMapping("/current-user")
	public String getCurrentUserInfo() {
		 return "User ID: %d, Email: %s, Role: %s".formatted(
                 securityUtil.getCurrentUserId(),
                 securityUtil.getCurrentUser().getEmail(),
                 securityUtil.getCurrentUser().getRole());
	}
}
