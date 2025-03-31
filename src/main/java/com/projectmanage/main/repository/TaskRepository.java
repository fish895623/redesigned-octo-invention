package com.projectmanage.main.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projectmanage.main.model.Milestone;
import com.projectmanage.main.model.Project;
import com.projectmanage.main.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject(Project project);

    List<Task> findByProjectOrderByCreatedAtDesc(Project project);

    List<Task> findByProjectOrderByUpdatedAtDesc(Project project);

    List<Task> findByMilestone(Milestone milestone);

    List<Task> findByMilestoneOrderByCreatedAtDesc(Milestone milestone);

    List<Task> findByMilestoneOrderByUpdatedAtDesc(Milestone milestone);

    List<Task> findByProjectAndCompleted(Project project, boolean completed);

    List<Task> findByMilestoneAndCompleted(Milestone milestone, boolean completed);

}