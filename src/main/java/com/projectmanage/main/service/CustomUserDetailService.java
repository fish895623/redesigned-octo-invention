package com.projectmanage.main.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.projectmanage.main.dto.CustomUserDetails;
import com.projectmanage.main.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CustomUserDetailService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {

        try {
            return userRepository.findByLoginId(loginId)
                    .map(user -> {
                        return new CustomUserDetails(user);
                    })
                    .orElseThrow(() -> {
                        log.error("No user found with login ID: {}", loginId);
                        return new UsernameNotFoundException("User not found with login ID: " + loginId);
                    });
        } catch (Exception e) {
            e.printStackTrace();
            log.error("로그인 도중 오류 발생!!: {}", e.getMessage());
            throw new RuntimeException("로그인 도중 오류 발생!!");
        }
    }

}