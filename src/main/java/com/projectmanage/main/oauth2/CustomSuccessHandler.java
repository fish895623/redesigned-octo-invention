package com.projectmanage.main.oauth2;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.projectmanage.main.dto.CustomOAuth2User;
import com.projectmanage.main.jwt.JWTUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;

    public CustomSuccessHandler(JWTUtil jwtUtil) {

        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        // OAuth2User
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        String username = customUserDetails.getUsername();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        String token = jwtUtil.createJwt(username, role, 60 * 60 * 60 * 60L);

        // Add necessary headers for CORS
        // Set CORS headers explicitly for the redirect
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Expose-Headers", "Authorization, Set-Cookie");
        
        // Set the JWT token as a secure cookie
        response.addCookie(createCookie("Authorization", token));
        
        // Also add token as Authorization header for redundancy
        response.setHeader("Authorization", "Bearer " + token);
        
        // Redirect to the frontend callback URL and include token as a parameter
        // This provides another way for the frontend to capture the token
        response.sendRedirect("http://localhost:5173/oauth/callback?token=" + token);
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(60 * 60 * 24); // 24 hours
        cookie.setPath("/");
        cookie.setHttpOnly(true);  // Prevents JavaScript access
        
        // In development, we don't need secure, but for production it should be true
        // cookie.setSecure(true);  // Uncomment for production
        
        // SameSite=Lax is more compatible when testing locally
        cookie.setAttribute("SameSite", "Lax");
        
        return cookie;
    }
}
