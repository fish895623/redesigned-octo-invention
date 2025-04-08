package com.projectmanage.main.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.projectmanage.main.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTaskId(Long taskId);

    // List all comments for projects
    @Query("SELECT c FROM Comment c WHERE c.task.project.id = :projectId")
    List<Comment> findByProjectId(Long projectId);
}
