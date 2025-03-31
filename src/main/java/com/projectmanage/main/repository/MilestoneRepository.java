package com.projectmanage.main.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projectmanage.main.model.Milestone;
import com.projectmanage.main.model.Project;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {

    List<Milestone> findByProject(Project project);

    List<Milestone> findByProjectOrderByCreatedAtDesc(Project project);

    List<Milestone> findByProjectOrderByUpdatedAtDesc(Project project);

    List<Milestone> findByProjectAndCompleted(Project project, boolean completed);

}