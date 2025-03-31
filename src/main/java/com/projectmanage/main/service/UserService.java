package com.projectmanage.main.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.projectmanage.main.dto.UserDto;
import com.projectmanage.main.entity.User;
import com.projectmanage.main.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    @Autowired
    private UserRepository repository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private final JavaMailSender javaMailSender;
    @Value("${spring.mail.username}")
    private String adminEmail;

    // 유저 등록
    public boolean saveUser(UserDto userDto) {

        boolean isValid = UserRegisterValidation(userDto);
        if (!isValid) {
            return false;
        }
        userDto.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        User user = User.toEntity(userDto);
        repository.save(user);

        return true;
    }

    // 계정 정보 검증
    public boolean UserRegisterValidation(UserDto userDto) {
        boolean isExist = repository.existsByLoginId(userDto.getLoginId());
        int passLength = userDto.getPassword().length();
        boolean isEmailExist = UserMailValidation(userDto.getUserEmail());
        if (isExist) {
            return false;
        }
        if (passLength < 5) {
            return false;
        }
        if (!isEmailExist) {
            return false;
        }

        return true;
    }

    // 이메일 검증
    public boolean UserMailValidation(String Email) {

        if (repository.existsByUserEmail(Email)) {
            return false;
        }

        SimpleMailMessage smm = new SimpleMailMessage();
        smm.setFrom(adminEmail);
        smm.setTo(Email);
        smm.setSubject("이메일 검증!!");
        smm.setText("this is Mail Validation: " + Email);

        try {
            javaMailSender.send(smm);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 유저 정보 반환
    public UserDto getUserByLoginId(String LoginId) {
        User user = repository.findByLoginId(LoginId)
                .orElseThrow(() -> new RuntimeException("유저가 없습니다"));

        return UserDto.toDto(user);
    }

    public UserDto getUserById(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("유저가 없습니다"));
        return UserDto.toDto(user);
    }

    public String getUserLoginId(UserDetails userDetails) {
        if (userDetails != null) { // 로그인한 사용자가 있을 경우
            return userDetails.getUsername();
        }
        return null;
    }

    public User getUser(UserDetails userDetails) {
        if (userDetails != null) {
            String userLoginId = userDetails.getUsername();
            User user = repository.findByLoginId(userLoginId).orElse(null);
            if (user != null) {
                return user;
            }
        }
        return null;
    }

}
