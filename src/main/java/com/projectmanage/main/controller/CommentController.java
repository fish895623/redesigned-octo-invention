package com.projectmanage.main.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.projectmanage.main.model.Comment;
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
            @PathVariable(name = "taskId") Long taskId, @RequestBody CommentDTO commentDTO,
            @AuthenticationPrincipal UserDetails currentUser) {
        projectRepository.findById(projectId).orElseThrow(
                () -> new EntityNotFoundException("Project not found with id: " + projectId));

        Task task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Task not found with id: " + taskId + " for Project " + projectId));

        User user = userRepository.findById(commentDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "User not found with id: " + commentDTO.getUserId()));

        Comment comment = new Comment();
        comment.setContent(commentDTO.getContent());
        comment.setTask(task);
        comment.setUser(user);

        Comment savedComment = commentRepository.save(comment);
        return new ResponseEntity<>(commentMapper.toDTO(savedComment), HttpStatus.CREATED);
    }

    // Get all comments for a specific task within a project
    @GetMapping
    public ResponseEntity<List<CommentDTO>> getCommentsByTaskId(
            @PathVariable(name = "projectId") Long projectId,
            @PathVariable(name = "taskId") Long taskId) {
        if (!projectRepository.existsById(projectId)) {
            throw new EntityNotFoundException("Project not found with id: " + projectId);
        }
        if (!taskRepository.existsByIdAndProjectId(taskId, projectId)) {
            throw new EntityNotFoundException(
                    "Task not found with id: " + taskId + " for Project " + projectId);
        }

        List<Comment> comments = commentRepository.findByTaskId(taskId);
        return ResponseEntity.ok(commentMapper.toDTOList(comments));
    }

    // Update an existing comment
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable(name = "projectId") Long projectId,
            @PathVariable(name = "taskId") Long taskId,
            @PathVariable(name = "commentId") Long commentId, @RequestBody CommentDTO commentDTO,
            @AuthenticationPrincipal UserDetails currentUser) throws AccessDeniedException {
        if (!projectRepository.existsById(projectId)) {
            throw new EntityNotFoundException("Project not found with id: " + projectId);
        }
        if (!taskRepository.existsByIdAndProjectId(taskId, projectId)) {
            throw new EntityNotFoundException(
                    "Task not found with id: " + taskId + " for Project " + projectId);
        }

        Comment existingComment = commentRepository.findById(commentId).orElseThrow(
                () -> new EntityNotFoundException("Comment not found with id: " + commentId));

        if (!existingComment.getTask().getId().equals(taskId)) {
            throw new IllegalArgumentException(
                    "Comment " + commentId + " does not belong to Task " + taskId);
        }

        checkOwnershipOrAdmin(existingComment, currentUser);

        existingComment.setContent(commentDTO.getContent());

        Comment updatedComment = commentRepository.save(existingComment);
        return ResponseEntity.ok(commentMapper.toDTO(updatedComment));
    }

    // Delete a comment
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable(name = "projectId") Long projectId,
            @PathVariable(name = "taskId") Long taskId,
            @PathVariable(name = "commentId") Long commentId,
            @AuthenticationPrincipal UserDetails currentUser) throws AccessDeniedException {
        if (!projectRepository.existsById(projectId)) {
            throw new EntityNotFoundException("Project not found with id: " + projectId);
        }
        if (!taskRepository.existsByIdAndProjectId(taskId, projectId)) {
            throw new EntityNotFoundException(
                    "Task not found with id: " + taskId + " for Project " + projectId);
        }

        Comment commentToDelete = commentRepository.findById(commentId).orElseThrow(
                () -> new EntityNotFoundException("Comment not found with id: " + commentId));

        if (!commentToDelete.getTask().getId().equals(taskId)) {
            throw new IllegalArgumentException(
                    "Comment " + commentId + " does not belong to Task " + taskId);
        }

        checkOwnershipOrAdmin(commentToDelete, currentUser);

        commentRepository.deleteById(commentId);
        return ResponseEntity.noContent().build();
    }

    private void checkOwnershipOrAdmin(Comment comment, UserDetails currentUser)
            throws AccessDeniedException {
        if (currentUser == null) {
            throw new AccessDeniedException("User must be authenticated.");
        }
        Long currentUserId;
        try {
            currentUserId = Long.parseLong(currentUser.getUsername());
        } catch (NumberFormatException e) {
            throw new AccessDeniedException("Invalid user identifier in principal.");
        }

        boolean isAdmin =
                currentUser.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        boolean isOwner = comment.getUser().getId().equals(currentUserId);

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException(
                    "User does not have permission to modify this comment.");
        }
    }
}
