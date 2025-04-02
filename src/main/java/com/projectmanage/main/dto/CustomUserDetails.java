package com.projectmanage.main.dto;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.projectmanage.main.model.User;

import lombok.Getter;

@Getter
public class CustomUserDetails implements UserDetails {

    private final String username;
    private final String password;
    private final String name;
    private final String picture;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean enabled;

    public CustomUserDetails(User user) {
        this.username = user.getEmail();
        this.password = user.getUsername(); // Note: In a real app, you'd store password hash
        this.name = user.getName();
        this.picture = user.getPicture();
        this.authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
        this.enabled = true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}