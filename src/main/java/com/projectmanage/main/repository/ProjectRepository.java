package com.projectmanage.main.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projectmanage.main.model.Project;
import com.projectmanage.main.model.User;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByUser(User user);

    @EntityGraph(attributePaths = { "milestones", "tasks" })
    List<Project> findByUserOrderByCreatedAtDesc(User user);

    @EntityGraph(attributePaths = { "milestones", "tasks" })
    @Override
    Optional<Project> findById(Long id);
}