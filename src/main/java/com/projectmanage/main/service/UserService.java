package com.projectmanage.main.service;

import java.util.Map;
import java.util.Optional;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.projectmanage.main.dto.CustomOAuth2User;
import com.projectmanage.main.model.User;
import com.projectmanage.main.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    public User getUserFromPrincipal(OAuth2User principal) {
        if (principal == null) {
            log.error("Authentication error: User is not authenticated - principal is null");
            throw new UsernameNotFoundException("User is not authenticated");
        }

        log.debug("Resolving user from OAuth2User principal: {}", principal.getName());

        // Handle CustomOAuth2User specifically
        if (principal instanceof CustomOAuth2User) {
            log.debug("Principal is CustomOAuth2User, retrieving by username");
            CustomOAuth2User customUser = (CustomOAuth2User) principal;
            String username = customUser.getUsername();

            User user = userRepository.findByUsername(username);
            if (user != null) {
                return user;
            }

            // Try by email as fallback
            Object emailObj = customUser.getAttributes().get("email");
            if (emailObj != null) {
                String email = emailObj.toString();
                Optional<User> userByEmail = userRepository.findByEmail(email);
                if (userByEmail.isPresent()) {
                    return userByEmail.get();
                }
                log.error("User not found with email: {}", email);
            } else {
                log.error("Email attribute is null in CustomOAuth2User");
            }

            log.error("User not found with username: {}", username);
            throw new UsernameNotFoundException("User not found: " + username);
        }

        // Regular OAuth2User handling
        Map<String, Object> attributes = principal.getAttributes();
        if (attributes == null) {
            log.error("OAuth2User attributes are null - trying to find user by name");
            String name = principal.getName();
            if (name != null) {
                User user = userRepository.findByUsername(name);
                if (user == null) {
                    log.error("User not found with username: {}", name);
                    throw new UsernameNotFoundException("User not found with username: " + name);
                }
                return user;
            }
            log.error("OAuth2 principal has no attributes and no name");
            throw new UsernameNotFoundException("OAuth2 principal has no attributes and no name");
        }

        // Try to get user by email
        Object emailObj = attributes.get("email");
        if (emailObj == null) {
            log.error("OAuth2 principal has no email attribute");
            throw new UsernameNotFoundException("OAuth2 principal has no email attribute");
        }

        String email = emailObj.toString();
        log.debug("Looking up user by email: {}", email);
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (!userOptional.isPresent()) {
            log.error("User not found with email: {}", email);
        }

        return userOptional.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}