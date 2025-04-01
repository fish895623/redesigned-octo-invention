package com.projectmanage.main.model.mapper;


import com.projectmanage.main.model.User;
import com.projectmanage.main.model.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {

    public UserDTO toDTO(User user){
        UserDTO dto = new UserDTO();

        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setPicture(user.getPicture());
        dto.setProviderId(user.getProviderId());
        dto.setProvider(user.getProvider());

        return dto;
    }

    public User toEntity(UserDTO user){
        User entity = new User();

        entity.setId(user.getId());
        entity.setEmail(user.getEmail());
        entity.setName(user.getName());
        entity.setPicture(user.getPicture());
        entity.setProviderId(user.getProviderId());
        entity.setProvider(user.getProvider());

        return entity;
    }

}
