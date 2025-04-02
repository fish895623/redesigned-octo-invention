package com.projectmanage.main.jwt;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.projectmanage.main.dto.CustomUserDetails;
import com.projectmanage.main.model.User;
import com.projectmanage.main.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        // Skip token processing for token refresh endpoint
        if (request.getRequestURI().equals("/api/auth/refresh")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authorization = null;

        // Try to get token from cookies
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("Authorization")) {
                    authorization = cookie.getValue();
                    log.debug("Found token in cookies");
                    break;
                }
            }
        }

        // If not in cookies, try to get from Authorization header
        if (authorization == null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                authorization = authHeader.substring(7);
                log.debug("Found token in Authorization header");
            }
        }

        if (authorization == null) {
            log.debug("No token found in request");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorization;

        // Check if token is valid
        try {
            if (jwtUtil.isExpired(token)) {
                log.debug("Token is expired");
                filterChain.doFilter(request, response);
                return;
            }

            String username = jwtUtil.getUsername(token);
            String role = jwtUtil.getRole(token);

            log.debug("Processing authenticated request for user: {} with role: {}", username, role);

            User user = userRepository.findByEmail(username)
                    .orElse(null);

            if (user == null) {
                log.debug("User not found with email: {}", username);
                filterChain.doFilter(request, response);
                return;
            }

            CustomUserDetails customUserDetails = new CustomUserDetails(user);

            Authentication authToken = new UsernamePasswordAuthenticationToken(
                    customUserDetails, null, customUserDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authToken);
        } catch (Exception e) {
            log.debug("Error processing JWT token: {}", e.getMessage());
            // Token is invalid, continue without authentication
        }

        filterChain.doFilter(request, response);
    }
}