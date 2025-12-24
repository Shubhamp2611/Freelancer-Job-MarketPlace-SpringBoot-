package com.marketplace.auth;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.marketplace.user.User;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
}
