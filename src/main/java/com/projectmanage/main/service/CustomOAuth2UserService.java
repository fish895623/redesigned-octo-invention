package com.projectmanage.main.service;

import java.util.Collections;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.projectmanage.main.dto.CustomOAuth2User;
import com.projectmanage.main.dto.GoogleResponse;
import com.projectmanage.main.dto.OAuth2Response;
import com.projectmanage.main.model.User;
import com.projectmanage.main.model.User.Provider;
import com.projectmanage.main.model.dto.UserDTO;
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
        log.debug("OAuth2User attributes: {}", oAuth2User.getAttributes());

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else {
            return null;
        }

        String username = oAuth2Response.getProvider() + " " + oAuth2Response.getProviderId();
        User existData = userRepository.findByUsername(username);

        if (existData == null) {
            // Create new user
            User user = new User();
            user.setUsername(username);
            user.setEmail(oAuth2Response.getEmail());
            user.setName(oAuth2Response.getName());
            user.setRole("ROLE_USER");
            user.setProviderId(oAuth2Response.getProviderId());
            user.setProvider(Provider.GOOGLE);

            // Set profile picture if available
            String picture = oAuth2Response.getPicture();
            if (picture != null && !picture.isEmpty()) {
                user.setPicture(picture);
            }

            userRepository.save(user);

            // Create UserDTO with avatar URL
            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(username);
            userDTO.setEmail(oAuth2Response.getEmail());
            userDTO.setName(oAuth2Response.getName());
            userDTO.setRoles(Collections.singletonList("ROLE_USER"));
            userDTO.setPicture(picture);

            return new CustomOAuth2User(userDTO);
        } else {
            // Update existing user
            existData.setEmail(oAuth2Response.getEmail());
            existData.setName(oAuth2Response.getName());
            existData.setProviderId(oAuth2Response.getProviderId());
            existData.setProvider(Provider.GOOGLE);

            // Update profile picture if available
            String picture = oAuth2Response.getPicture();
            if (picture != null && !picture.isEmpty()) {
                existData.setPicture(picture);
            }

            userRepository.save(existData);

            // Create UserDTO with avatar URL
            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(existData.getUsername());
            userDTO.setEmail(existData.getEmail());
            userDTO.setName(oAuth2Response.getName());
            userDTO.setRoles(Collections.singletonList(existData.getRole()));
            userDTO.setPicture(existData.getPicture());

            return new CustomOAuth2User(userDTO);
        }
    }
}