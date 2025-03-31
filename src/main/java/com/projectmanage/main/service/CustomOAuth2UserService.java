package com.projectmanage.main.service;

import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.projectmanage.main.dto.CustomOAuth2UserDetail;
import com.projectmanage.main.entity.User;
import com.projectmanage.main.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    public BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> oAuthAttributes = oAuth2User.getAttributes();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        User user = repository.findByUserEmail(email).orElse(null);
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails()
                .getUserInfoEndpoint().getUserNameAttributeName();
        if (user == null) {
            User OAuth2User = new User();
            OAuth2User.setLoginId(email);
            OAuth2User.setUserEmail(email);
            OAuth2User.setUserName(name);
            OAuth2User.setUserPhone("00000000000");
            OAuth2User.setPassword(bCryptPasswordEncoder.encode(UUID.randomUUID().toString()));

            user = repository.save(OAuth2User);
        }
        return new CustomOAuth2UserDetail(oAuthAttributes, userNameAttributeName, user);
    }
}
