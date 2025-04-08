package com.projectmanage.main.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.projectmanage.main.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Use JOIN FETCH to eagerly load the User associated with each Comment
    @Query("SELECT c FROM Comment c JOIN FETCH c.user WHERE c.task.id = :taskId")
    List<Comment> findByTaskId(@Param("taskId") Long taskId);

    // List all comments for projects (potentially also needs JOIN FETCH if user is accessed later)
    @Query("SELECT c FROM Comment c JOIN FETCH c.user WHERE c.task.project.id = :projectId")
    List<Comment> findByProjectId(@Param("projectId") Long projectId);
}
