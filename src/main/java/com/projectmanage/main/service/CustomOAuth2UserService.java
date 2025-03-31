package com.projectmanage.main.service;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.projectmanage.main.model.User;
import com.projectmanage.main.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Process the OAuth2User and save/update user in database
        String provider = userRequest.getClientRegistration().getRegistrationId();
        log.info("Provider: {}", provider);
        String providerId = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        // Find existing user or create new one
        User user = userRepository.findByProviderId(providerId)
                .orElse(User.builder()
                        .providerId(providerId)
                        .email(email)
                        .name(name)
                        .picture(picture)
                        .build());

        // Update user information if it has changed
        if (!user.getName().equals(name) ||
                !user.getEmail().equals(email) ||
                (user.getPicture() != null && !user.getPicture().equals(picture))) {
            user.setName(name);
            user.setEmail(email);
            user.setPicture(picture);
        }

        userRepository.save(user);

        return oAuth2User;
    }
}