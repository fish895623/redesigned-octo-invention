package com.projectmanage.main.dto;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.projectmanage.main.model.User;

import lombok.extern.slf4j.Slf4j;

@Slf4j
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
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getName() {
        return user.getEmail();
    }
}
