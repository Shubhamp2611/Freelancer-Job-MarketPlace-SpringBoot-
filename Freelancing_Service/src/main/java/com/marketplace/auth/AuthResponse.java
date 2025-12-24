package com.marketplace.auth;

public class AuthResponse {
	
	 private String accessToken;
	 private String refreshToken;
	 private String email;
	 
	public String getAccessToken() {
		return accessToken;
	}
	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}
	public String getRefreshToken() {
		return refreshToken;
	}
	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public AuthResponse(String accessToken, String refreshToken, String email) {
		super();
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.email = email;
	}
	public AuthResponse() {
		super();
	}
}
