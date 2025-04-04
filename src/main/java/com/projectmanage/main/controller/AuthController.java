package com.projectmanage.main.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projectmanage.main.dto.CustomUserDetails;
import com.projectmanage.main.exception.TokenRefreshException;
import com.projectmanage.main.jwt.JWTUtil;
import com.projectmanage.main.model.RefreshToken;
import com.projectmanage.main.model.User;
import com.projectmanage.main.model.dto.TokenRefreshRequest;
import com.projectmanage.main.model.dto.TokenRefreshResponse;
import com.projectmanage.main.model.dto.UserDTO;
import com.projectmanage.main.service.RefreshTokenService;
import com.projectmanage.main.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final JWTUtil jwtUtil;
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;

    // JWT expiration: 1 hour for access token
    private static final Long JWT_EXPIRATION = 1000L * 60 * 60;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getAuthStatus(
                    @AuthenticationPrincipal CustomUserDetails principal) {
        Map<String, Object> response = new HashMap<>();

        if (principal != null) {
            response.put("authenticated", true);
            response.put("name", principal.getName());
            response.put("email", principal.getUsername());
            response.put("picture", principal.getPicture());
            return ResponseEntity.ok(response);
        } else {
            response.put("authenticated", false);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest,
                    HttpServletResponse response) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        try {
            User user = userService.authenticateUser(email, password);

            // Create access token
            String accessToken =
                            jwtUtil.createJwt(user.getUsername(), user.getRole(), JWT_EXPIRATION);

            // Create refresh token
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername());

            // Set cookie
            Cookie cookie = new Cookie("Authorization", accessToken);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60); // 1 hour in seconds
            response.addCookie(cookie);

            // Return tokens in response for client-side storage
            Map<String, Object> result = new HashMap<>();
            result.put("accessToken", accessToken);
            result.put("refreshToken", refreshToken.getToken());
            result.put("tokenType", "Bearer");
            result.put("authenticated", true);
            result.put("name", user.getName());
            result.put("email", user.getEmail());
            result.put("picture", user.getPicture());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Authentication failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map
                            .of("authenticated", false, "message", "Invalid email or password"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserDTO userDTO,
                    HttpServletResponse response) {
        try {
            User user = userService.registerUser(userDTO);

            // Create access token
            String accessToken =
                            jwtUtil.createJwt(user.getUsername(), user.getRole(), JWT_EXPIRATION);

            // Create refresh token
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername());

            // Set cookie
            Cookie cookie = new Cookie("Authorization", accessToken);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60); // 1 hour in seconds
            response.addCookie(cookie);

            // Return tokens in response for client-side storage
            Map<String, Object> result = new HashMap<>();
            result.put("accessToken", accessToken);
            result.put("refreshToken", refreshToken.getToken());
            result.put("tokenType", "Bearer");
            result.put("authenticated", true);
            result.put("name", user.getName());
            result.put("email", user.getEmail());

            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            log.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("authenticated", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                        .map(refreshTokenService::verifyExpiration).map(RefreshToken::getUser)
                        .map(user -> {
                            String newAccessToken = jwtUtil.createJwt(user.getUsername(), user
                                            .getRole(), JWT_EXPIRATION);

                            return ResponseEntity.ok(new TokenRefreshResponse(newAccessToken,
                                            requestRefreshToken, "Bearer"));
                        }).orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                                        "Refresh token is not in database!"));
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getUser(
                    @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }

        Map<String, Object> userDetails = new HashMap<>();
        userDetails.put("authenticated", true);
        userDetails.put("name", principal.getName());
        userDetails.put("email", principal.getUsername());
        userDetails.put("picture", principal.getPicture());

        return ResponseEntity.ok(userDetails);
    }
}
