package com.projectmanage.main.dto;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.projectmanage.main.model.dto.UserDTO;

public class CustomOAuth2User implements OAuth2User {

    private final UserDTO userDTO;

    public CustomOAuth2User(UserDTO userDTO) {
        this.userDTO = userDTO;
    }

    @Override
    public Map<String, Object> getAttributes() {
        // Create and return a map with essential user attributes
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("email", userDTO.getEmail());
        attributes.put("name", userDTO.getFullName());
        attributes.put("sub", userDTO.getUsername());
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return userDTO.getRoles().get(0);
            }
        });
        return collection;
    }

    @Override
    public String getName() {
        return userDTO.getFullName();
    }

    public String getUsername() {
        return userDTO.getUsername();
    }
}
