package com.projectmanage.main.dto;

import java.util.Map;

import org.springframework.security.oauth2.core.user.OAuth2User;

import com.projectmanage.main.model.User;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class CustomOAuth2UserDetail implements OAuth2User {

    private Map<String, Object> attributes;
    private User user;

    public CustomOAuth2UserDetail(
            Map<String, Object> attributes,
            User user) {
        this.attributes = attributes;
        this.user = user;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getName() {
        return user.getEmail();
    }
}
