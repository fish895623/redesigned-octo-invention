package com.projectmanage.main.dto;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
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
        this.attributes = attributes != null ? attributes : new HashMap<>();
        this.user = user;

        // Ensure essential attributes are present
        if (this.attributes.get("email") == null && user != null && user.getEmail() != null) {
            this.attributes.put("email", user.getEmail());
        }

        if (this.attributes.get("name") == null && user != null && user.getName() != null) {
            this.attributes.put("name", user.getName());
        }

        if (this.attributes.get("sub") == null && user != null && user.getUsername() != null) {
            this.attributes.put("sub", user.getUsername());
        }

        log.debug("CustomOAuth2UserDetail created with attributes: {}", this.attributes);
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (user != null && user.getRole() != null) {
            return Collections.singletonList(new SimpleGrantedAuthority(user.getRole()));
        }
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getName() {
        if (user != null && user.getEmail() != null) {
            return user.getEmail();
        } else if (attributes.containsKey("email")) {
            return attributes.get("email").toString();
        } else if (user != null && user.getUsername() != null) {
            return user.getUsername();
        }
        return "anonymous";
    }
}
