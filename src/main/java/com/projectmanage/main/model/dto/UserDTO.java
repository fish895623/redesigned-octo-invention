package com.projectmanage.main.model.dto;

import com.projectmanage.main.model.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String email;
    private String name;
    private String picture;
    private String providerId;
    private User.Provider provider;
}