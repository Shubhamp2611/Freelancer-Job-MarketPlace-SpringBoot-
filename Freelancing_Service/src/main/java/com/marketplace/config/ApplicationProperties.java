package com.marketplace.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
public class ApplicationProperties {
    
    private Jwt jwt = new Jwt();
    private Stripe stripe = new Stripe();
    private Platform platform = new Platform();
    private Cors cors = new Cors();
    
    public Jwt getJwt() {
		return jwt;
	}

	public void setJwt(Jwt jwt) {
		this.jwt = jwt;
	}

	public Stripe getStripe() {
		return stripe;
	}

	public void setStripe(Stripe stripe) {
		this.stripe = stripe;
	}

	public Platform getPlatform() {
		return platform;
	}

	public void setPlatform(Platform platform) {
		this.platform = platform;
	}

	public Cors getCors() {
		return cors;
	}

	public void setCors(Cors cors) {
		this.cors = cors;
	}

    public static class Jwt {
        private String secret;
        private long expirationMs;
		public String getSecret() {
			return secret;
		}
		public void setSecret(String secret) {
			this.secret = secret;
		}
		public long getExpirationMs() {
			return expirationMs;
		}
		public void setExpirationMs(long expirationMs) {
			this.expirationMs = expirationMs;
		}
    }

    public static class Stripe {
        private String secretKey;
        private String publicKey;
		public String getSecretKey() {
			return secretKey;
		}
		public void setSecretKey(String secretKey) {
			this.secretKey = secretKey;
		}
		public String getPublicKey() {
			return publicKey;
		}
		public void setPublicKey(String publicKey) {
			this.publicKey = publicKey;
		}
    }
    
    public static class Platform {
        private int feePercentage;
        private String currency;
		public int getFeePercentage() {
			return feePercentage;
		}
		public void setFeePercentage(int feePercentage) {
			this.feePercentage = feePercentage;
		}
		public String getCurrency() {
			return currency;
		}
		public void setCurrency(String currency) {
			this.currency = currency;
		}
    }
    
    public static class Cors {
        private String[] allowedOrigins;

		public String[] getAllowedOrigins() {
			return allowedOrigins;
		}

		public void setAllowedOrigins(String[] allowedOrigins) {
			this.allowedOrigins = allowedOrigins;
		}
    }
}