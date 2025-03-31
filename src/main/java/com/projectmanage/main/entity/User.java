package com.projectmanage.main.entity;

import com.projectmanage.main.dto.UserDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(length = 45, nullable = false)
    private String loginId;

    @Column(length = 100, nullable = false)
    private String password;

    @Column(length = 45, nullable = false)
    private String userName;

    @Column(length = 100, nullable = false)
    private String userEmail;

    @Column(length = 15, nullable = false)
    private String userPhone;

    public static User toEntity(UserDto dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setLoginId(dto.getLoginId());
        user.setPassword(dto.getPassword());
        user.setUserName(dto.getUserName());
        user.setUserEmail(dto.getUserEmail());
        user.setUserPhone(dto.getUserPhone());
        return user;
    }
}
