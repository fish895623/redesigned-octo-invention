package com.projectmanage.main.dto;

import com.projectmanage.main.entity.User;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String loginId;
    private String password;
    private String userName;
    private String userEmail;
    private String userPhone;

    public static UserDto toDto(User entity) {
        UserDto userDto = new UserDto();
        userDto.setId(entity.getId());
        userDto.setLoginId(entity.getLoginId());
        userDto.setPassword(entity.getPassword());
        userDto.setUserName(entity.getUserName());
        userDto.setUserEmail(entity.getUserEmail());
        userDto.setUserPhone(entity.getUserPhone());
        return userDto;
    }
}
