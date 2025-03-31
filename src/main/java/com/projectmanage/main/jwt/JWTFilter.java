package com.projectmanage.main.jwt;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.projectmanage.main.dto.CustomOAuth2User;
import com.projectmanage.main.model.dto.UserDTO;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authorization = null;
        Cookie[] cookies = request.getCookies();

        // Check if cookies exist
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("Authorization")) {
                    authorization = cookie.getValue();
                    break;
                }
            }
        } else {
            log.debug("No cookies found in the request");
        }

        // Check Authorization header if cookie not found
        if (authorization == null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                authorization = authHeader.substring(7);
                log.debug("Found token in Authorization header");
            }
        }

        // If no token found in cookies or header, continue filter chain
        if (authorization == null) {
            log.debug("No token found in request");
            filterChain.doFilter(request, response);
            return;
        }

        // Token validation
        String token = authorization;

        if (jwtUtil.isExpired(token)) {
            log.debug("Token is expired");
            filterChain.doFilter(request, response);
            return;
        }

        // Extract user details from token
        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);

        log.debug("Processing authenticated request for user: {}", username);

        // Create UserDTO with token information
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(username);
        userDTO.setRoles(Collections.singletonList(role));

        // Create custom OAuth2 user
        CustomOAuth2User customOAuth2User = new CustomOAuth2User(userDTO);

        // Create authentication token
        Authentication authToken = new UsernamePasswordAuthenticationToken(customOAuth2User, null,
                customOAuth2User.getAuthorities());

        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
