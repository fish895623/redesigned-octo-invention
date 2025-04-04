package com.projectmanage.main.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projectmanage.main.model.Milestone;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {

    List<Milestone> findByProjectId(Long projectId);

    boolean existsByProjectIdAndTitle(Long projectId, String title);
}
