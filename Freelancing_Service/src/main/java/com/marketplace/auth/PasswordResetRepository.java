package com.marketplace.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import com.marketplace.user.User;

import java.util.Optional;

public interface PasswordResetRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUser(User user);
}