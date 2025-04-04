package com.projectmanage.main.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.projectmanage.main.exception.TokenRefreshException;
import com.projectmanage.main.model.RefreshToken;
import com.projectmanage.main.model.User;
import com.projectmanage.main.repository.RefreshTokenRepository;
import com.projectmanage.main.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("${app.jwt.refresh-token.expiration}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken createRefreshToken(String username) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException(
                        "User not found with email: " + username));

        // First, check if user already has a refresh token
        Optional<RefreshToken> existingToken = refreshTokenRepository.findByUser(user);
        if (existingToken.isPresent()) {
            // Update existing token
            RefreshToken refreshToken = existingToken.get();
            refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
            return refreshTokenRepository.save(refreshToken);
        }

        // Create new token if none exists
        RefreshToken refreshToken = RefreshToken.builder().user(user)
                        .token(UUID.randomUUID().toString())
                        .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs)).build();

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(),
                            "Refresh token was expired. Please make a new login request");
        }

        return token;
    }

    @Transactional
    public void deleteByUserId(String username) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException(
                        "User not found with email: " + username));
        refreshTokenRepository.deleteByUser(user);
    }
}
