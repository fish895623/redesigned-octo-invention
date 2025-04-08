package com.projectmanage.main.model.mapper;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import com.projectmanage.main.model.Comment;
import com.projectmanage.main.model.dto.CommentDTO;

@Component
public class CommentMapper {

  public CommentDTO toDTO(Comment comment) {
    if (comment == null) {
      return null;
    }

    return CommentDTO.builder().id(comment.getId()).taskId(comment.getTask().getId())
        .userId(comment.getUser().getId()).userName(comment.getUser().getUsername())
        .content(comment.getContent()).createdAt(comment.getCreatedAt())
        .updatedAt(comment.getUpdatedAt()).build();
  }

  public List<CommentDTO> toDTOList(List<Comment> comments) {
    if (comments == null) {
      return List.of();
    }

    return comments.stream().map(this::toDTO).collect(Collectors.toList());
  }

  // Note: fromDTO method is not provided since Comments are typically created
  // through a separate CreateCommentRequest to ensure proper validation and security
}
