package com.projectmanage.main.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projectmanage.main.dto.CustomUserDetails;
import com.projectmanage.main.jwt.JWTUtil;
import com.projectmanage.main.model.User;
import com.projectmanage.main.model.dto.UserDTO;
import com.projectmanage.main.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final JWTUtil jwtUtil;
    private final UserService userService;
    
    // JWT expiration: 24 hours
    private static final Long JWT_EXPIRATION = 1000L * 60 * 60 * 24;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest, 
                                                     HttpServletResponse response) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        try {
            User user = userService.authenticateUser(email, password);
            
            String token = jwtUtil.createJwt(user.getUsername(), user.getRole(), JWT_EXPIRATION);
            
            // Set cookie
            Cookie cookie = new Cookie("Authorization", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60); // 24 hours in seconds
            response.addCookie(cookie);
            
            // Also return token in response for client-side storage
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("authenticated", true);
            result.put("name", user.getName());
            result.put("email", user.getEmail());
            result.put("picture", user.getPicture());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Authentication failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("authenticated", false, "message", "Invalid email or password"));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserDTO userDTO, 
                                                       HttpServletResponse response) {
        try {
            User user = userService.registerUser(userDTO);
            
            String token = jwtUtil.createJwt(user.getUsername(), user.getRole(), JWT_EXPIRATION);
            
            // Set cookie
            Cookie cookie = new Cookie("Authorization", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60); // 24 hours in seconds
            response.addCookie(cookie);
            
            // Also return token in response for client-side storage
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
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

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getUser(@AuthenticationPrincipal CustomUserDetails principal) {
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

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response) {
        // Clear the security context
        SecurityContextHolder.clearContext();

        // Invalidate the HTTP session
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        // Clear all cookies
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                cookie.setValue("");
                cookie.setPath("/");
                cookie.setMaxAge(0);
                response.addCookie(cookie);
            }
        }

        return ResponseEntity.ok(Map.of("message", "Successfully logged out"));
    }
}