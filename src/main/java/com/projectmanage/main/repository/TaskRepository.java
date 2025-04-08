package com.projectmanage.main.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.projectmanage.main.model.Milestone;
import com.projectmanage.main.model.Project;
import com.projectmanage.main.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
  List<Task> findByProjectOrderByUpdatedAtDesc(Project project);

  List<Task> findByProjectId(Long projectId);

  List<Task> findByMilestoneId(Long milestoneId);

  List<Task> findByMilestoneOrderByUpdatedAtDesc(Milestone milestone);

  Optional<Task> findByIdAndProjectId(Long taskId, Long projectId);

  boolean existsByIdAndProjectId(Long taskId, Long projectId);
}
