package com.projectmanage.main.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.projectmanage.main.model.User;
import com.projectmanage.main.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getUserFromPrincipal(OAuth2User principal) {
        if (principal == null) {
            throw new UsernameNotFoundException("User is not authenticated");
        }

        String email = principal.getAttribute("email");
        if (email == null) {
            throw new UsernameNotFoundException("OAuth2 principal has no email attribute");
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        return userOptional.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}