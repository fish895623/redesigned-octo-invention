package com.projectmanage.main.service;

import java.util.Optional;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.projectmanage.main.dto.CustomUserDetails;
import com.projectmanage.main.model.User;
import com.projectmanage.main.model.dto.UserDTO;
import com.projectmanage.main.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        return new CustomUserDetails(userOptional.get());
    }

    public User authenticateUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new BadCredentialsException("Invalid email or password");
        }

        User user = userOptional.get();
        if (user.getPassword() == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        return user;
    }

    public User registerUser(UserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = User.builder().email(userDTO.getEmail()).name(userDTO.getName())
                        .password(passwordEncoder.encode(userDTO.getPassword())).role("USER")
                        .username(userDTO.getEmail()).build();

        return userRepository.save(user);
    }

    public User getUserFromPrincipal(CustomUserDetails principal) {
        if (principal == null) {
            log.error("Authentication error: User is not authenticated - principal is null");
            throw new UsernameNotFoundException("User is not authenticated");
        }

        log.debug("Resolving user from CustomUserDetails principal: {}", principal.getUsername());

        Optional<User> userOptional = userRepository.findByEmail(principal.getUsername());

        if (!userOptional.isPresent()) {
            log.error("User not found with email: {}", principal.getUsername());
        }

        return userOptional.orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with email: " + principal.getUsername()));
    }
}
