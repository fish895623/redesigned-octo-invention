package com.projectmanage.main.model.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDTO {

  private Long id;
  private String title;
  private String description;
  private boolean completed;
  private Long projectId;
  private Long milestoneId;
  private LocalDate dueDate;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
