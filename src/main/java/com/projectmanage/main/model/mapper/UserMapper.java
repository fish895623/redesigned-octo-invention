package com.projectmanage.main.model.mapper;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.projectmanage.main.model.User;
import com.projectmanage.main.model.dto.UserDTO;

import lombok.RequiredArgsConstructor;

/**
 * Mapper for converting between User entity and UserDTO
 */
@Component
@RequiredArgsConstructor
public class UserMapper {

    /**
     * Convert User entity to UserDTO
     *
     * @param user the User entity
     * @return the UserDTO
     */
    public UserDTO toDto(User user) {
        if (user == null) {
            return null;
        }

        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getName())
                .avatarUrl(user.getPicture())
                .isActive(true) // Assuming all users are active by default
                .roles(user.getRole() != null ? Collections.singletonList(user.getRole()) : Collections.emptyList())
                .build();
    }

    /**
     * Convert UserDTO to User entity
     *
     * @param userDTO the UserDTO
     * @return the User entity
     */
    public User toEntity(UserDTO userDTO) {
        if (userDTO == null) {
            return null;
        }

        return User.builder()
                .id(userDTO.getId())
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .name(userDTO.getFullName())
                .picture(userDTO.getAvatarUrl())
                .role(userDTO.getRoles() != null && !userDTO.getRoles().isEmpty() ? userDTO.getRoles().get(0) : null)
                .build();
    }

    /**
     * Convert a list of User entities to a list of UserDTOs
     *
     * @param users list of User entities
     * @return list of UserDTOs
     */
    public List<UserDTO> toDtoList(List<User> users) {
        if (users == null) {
            return Collections.emptyList();
        }

        return users.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Update a User entity with data from UserDTO
     *
     * @param user    the User entity to update
     * @param userDTO the UserDTO with updated data
     * @return the updated User entity
     */
    public User updateEntityFromDto(User user, UserDTO userDTO) {
        if (user == null || userDTO == null) {
            return user;
        }

        // Only update fields that are typically allowed to be updated
        if (userDTO.getUsername() != null) {
            user.setUsername(userDTO.getUsername());
        }

        if (userDTO.getFullName() != null) {
            user.setName(userDTO.getFullName());
        }

        if (userDTO.getAvatarUrl() != null) {
            user.setPicture(userDTO.getAvatarUrl());
        }

        // Roles are typically managed separately for security reasons
        // This is just a simple example - in production you'd likely have more complex
        // role management
        if (userDTO.getRoles() != null && !userDTO.getRoles().isEmpty()) {
            user.setRole(userDTO.getRoles().get(0));
        }

        return user;
    }
}