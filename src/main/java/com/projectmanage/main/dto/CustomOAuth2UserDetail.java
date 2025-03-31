package com.projectmanage.main.dto;

import com.projectmanage.main.entity.User;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Log4j2
public class CustomOAuth2UserDetail implements OAuth2User {

    private Map<String, Object> attributes;
    private String nameAttributeKey;
    private User user;

    public CustomOAuth2UserDetail(
                                  Map<String, Object> attributes,
                                  String nameAttributeKey,
                                  User user) {
        this.attributes = attributes;
        this.nameAttributeKey = nameAttributeKey;
        this.user = user;
    }
    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(() -> "ROLE_USER");
    }

    @Override
    public String getName() {

        return user.getUserEmail();
    }

}
