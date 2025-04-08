package com.projectmanage.main.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.projectmanage.main.model.Comment;
import com.projectmanage.main.model.Project;
import com.projectmanage.main.model.Task;
import com.projectmanage.main.model.User;
import com.projectmanage.main.model.dto.CommentDTO;
import com.projectmanage.main.model.mapper.CommentMapper;
import com.projectmanage.main.repository.CommentRepository;
import com.projectmanage.main.repository.ProjectRepository;
import com.projectmanage.main.repository.TaskRepository;
import com.projectmanage.main.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks/{taskId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentRepository commentRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    // Create a new comment for a task within a project
    @PostMapping
    public ResponseEntity<CommentDTO> createComment(
            @PathVariable(name = "projectId") Long projectId,
            @PathVariable(name = "taskId") Long taskId, @RequestBody CommentDTO commentDTO) {
        // Validate project exists
        Project project = projectRepository.findById(projectId).orElseThrow(
                () -> new EntityNotFoundException("Project not found with id: " + projectId));
        // Validate task exists and belongs to the project
        Task task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Task not found with id: " + taskId + " for Project " + projectId));
        // In a real app, user ID might come from security context, not DTO
        User user = userRepository.findById(commentDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "User not found with id: " + commentDTO.getUserId()));

        Comment comment = new Comment();
        comment.setContent(commentDTO.getContent());
        comment.setTask(task); // Task already validated to be in the project
        comment.setUser(user);

        Comment savedComment = commentRepository.save(comment);
        return new ResponseEntity<>(commentMapper.toDTO(savedComment), HttpStatus.CREATED);
    }

    // Get all comments for a specific task within a project
    @GetMapping
    public ResponseEntity<List<CommentDTO>> getCommentsByTaskId(
            @PathVariable(name = "projectId") Long projectId,
            @PathVariable(name = "taskId") Long taskId) {
        // Validate project exists
        if (!projectRepository.existsById(projectId)) {
            throw new EntityNotFoundException("Project not found with id: " + projectId);
        }
        // Validate task exists and belongs to the project
        // TODO: Add 'boolean existsByIdAndProjectId(Long taskId, Long projectId);' to
        // TaskRepository
        if (!taskRepository.existsByIdAndProjectId(taskId, projectId)) {
            throw new EntityNotFoundException(
                    "Task not found with id: " + taskId + " for Project " + projectId);
        }

        List<Comment> comments = commentRepository.findByTaskId(taskId); // Fetches comments for the
                                                                         // validated task
        return ResponseEntity.ok(commentMapper.toDTOList(comments));
    }

    // Update an existing comment
    @PutMapping("/{commentId}") // Added commentId to path
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable(name = "projectId") Long projectId,
            @PathVariable(name = "taskId") Long taskId,
            @PathVariable(name = "commentId") Long commentId, // Explicitly named
            @RequestBody CommentDTO commentDTO) {

        // Validate project exists
        if (!projectRepository.existsById(projectId)) {
            throw new EntityNotFoundException("Project not found with id: " + projectId);
        }
        // Validate task exists and belongs to the project
        // TODO: Add 'boolean existsByIdAndProjectId(Long taskId, Long projectId);' to
        // TaskRepository
        if (!taskRepository.existsByIdAndProjectId(taskId, projectId)) {
            throw new EntityNotFoundException(
                    "Task not found with id: " + taskId + " for Project " + projectId);
        }

        Comment existingComment = commentRepository.findById(commentId).orElseThrow(
                () -> new EntityNotFoundException("Comment not found with id: " + commentId));

        // Optional: Validate comment belongs to the correct task
        if (!existingComment.getTask().getId().equals(taskId)) {
            throw new IllegalArgumentException(
                    "Comment " + commentId + " does not belong to Task " + taskId);
        }

        // Basic update - only content changeable here
        existingComment.setContent(commentDTO.getContent());

        Comment updatedComment = commentRepository.save(existingComment);
        return ResponseEntity.ok(commentMapper.toDTO(updatedComment));
    }

    // Delete a comment
    @DeleteMapping("/{commentId}") // Added commentId to path
    public ResponseEntity<Void> deleteComment(@PathVariable(name = "projectId") Long projectId,
            @PathVariable(name = "taskId") Long taskId,
            @PathVariable(name = "commentId") Long commentId) { // Explicitly named

        // Validate project exists
        if (!projectRepository.existsById(projectId)) {
            throw new EntityNotFoundException("Project not found with id: " + projectId);
        }
        // Validate task exists and belongs to the project
        // TODO: Add 'boolean existsByIdAndProjectId(Long taskId, Long projectId);' to
        // TaskRepository
        if (!taskRepository.existsByIdAndProjectId(taskId, projectId)) {
            throw new EntityNotFoundException(
                    "Task not found with id: " + taskId + " for Project " + projectId);
        }

        Comment commentToDelete = commentRepository.findById(commentId).orElseThrow(
                () -> new EntityNotFoundException("Comment not found with id: " + commentId));

        // Optional: Validate comment belongs to the correct task before deleting
        if (!commentToDelete.getTask().getId().equals(taskId)) {
            throw new IllegalArgumentException(
                    "Comment " + commentId + " does not belong to Task " + taskId);
        }

        commentRepository.deleteById(commentId);
        return ResponseEntity.noContent().build();
    }
}
