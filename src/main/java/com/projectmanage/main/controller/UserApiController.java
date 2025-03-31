package com.projectmanage.main.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projectmanage.main.dto.CustomOAuth2UserDetail;
import com.projectmanage.main.dto.CustomUserDetails;
import com.projectmanage.main.dto.UserDto;
import com.projectmanage.main.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/user")
public class UserApiController {

    @Autowired
    public UserService service;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserDto userDto) {
        log.info("input UserInfo: {} {} {} {} {}", userDto.getLoginId(), userDto.getPassword(), userDto.getUserName(),
                userDto.getUserEmail(), userDto.getUserPhone());
        boolean success = service.saveUser(userDto);
        if (success) {
            log.info("User saved successfully,{}", userDto.getLoginId());
            return ResponseEntity.ok("User registered successfully. Verification email sent.");
        } else {
            log.error("Registration failed, {}", userDto.getLoginId());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Registration failed. Duplicate loginId, weak password, or invalid email.");
        }
    }

    // 구글 계정 로그인 정보 확인
    @GetMapping("/oauthInfo")
    public ResponseEntity<?> oauthLogin(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        return ResponseEntity.ok(principal.getAttributes());
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@AuthenticationPrincipal Object principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        String LoginId = null;

        if (principal instanceof CustomUserDetails) {
            CustomUserDetails customUserDetails = (CustomUserDetails) principal;
            LoginId = customUserDetails.getUsername();
        } else if (principal instanceof CustomOAuth2UserDetail) {
            CustomOAuth2UserDetail customOAuth2UserDetail = (CustomOAuth2UserDetail) principal;
            LoginId = customOAuth2UserDetail.getName();
        }
        log.info(LoginId);
        UserDto userDto = service.getUserByLoginId(LoginId);

        log.info(userDto.getUserEmail());
        userDto.setPassword(null);
        return ResponseEntity.ok(userDto);
    }
}
