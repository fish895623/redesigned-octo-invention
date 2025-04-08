package com.projectmanage.main.model.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
  private Long id;
  private Long taskId;
  private Long userId;
  private String content;
  private String userName; // Additional field to show who made the comment
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
