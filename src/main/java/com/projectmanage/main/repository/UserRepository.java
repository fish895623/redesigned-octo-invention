package com.projectmanage.main.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projectmanage.main.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByLoginId(String loginId);

    Optional<User> findByUserEmail(String UserEmail);

    boolean existsByLoginId(String LoginId);

    boolean existsByUserEmail(String UserEmail);
}
