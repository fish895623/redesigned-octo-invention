package com.projectmanage.main.model.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDTO {

    private Long id;
    private String title;
    private String description;
    private Long userId;
    @Builder.Default private List<MilestoneDTO> milestones = new ArrayList<>();
    @Builder.Default private List<TaskDTO> tasks = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
