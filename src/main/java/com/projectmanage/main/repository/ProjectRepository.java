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

    @EntityGraph(attributePaths = { "milestones" })
    List<Project> findWithMilestonesByUserOrderByCreatedAtDesc(User user);

    @EntityGraph(attributePaths = { "tasks" })
    List<Project> findWithTasksByUserOrderByCreatedAtDesc(User user);

    List<Project> findByUserOrderByCreatedAtDesc(User user);

    @EntityGraph(attributePaths = { "milestones" })
    Optional<Project> findWithMilestonesById(Long id);

    @EntityGraph(attributePaths = { "tasks" })
    Optional<Project> findWithTasksById(Long id);
}