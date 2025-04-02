package com.projectmanage.main.model.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.projectmanage.main.model.Milestone;
import com.projectmanage.main.model.dto.MilestoneDTO;
import com.projectmanage.main.model.dto.TaskDTO;
import com.projectmanage.main.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MilestoneMapper {

    private final ProjectRepository projectRepository;
    private final TaskMapper taskMapper;

    public MilestoneDTO toDTO(Milestone milestone) {
        if (milestone == null) {
            return null;
        }

        List<TaskDTO> tasks = milestone.getTasks() != null
                ? milestone.getTasks().stream()
                        .map(taskMapper::toDTO)
                        .collect(Collectors.toList())
                : List.of();

        return MilestoneDTO.builder()
                .id(milestone.getId())
                .title(milestone.getTitle())
                .description(milestone.getDescription())
                .projectId(milestone.getProject().getId())
                .startDate(milestone.getStartDate())
                .dueDate(milestone.getDueDate())
                .completed(milestone.isCompleted())
                .tasks(tasks)
                .createdAt(milestone.getCreatedAt())
                .updatedAt(milestone.getUpdatedAt())
                .build();
    }

    public List<MilestoneDTO> toDTOList(List<Milestone> milestones) {
        return milestones.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Milestone toEntity(MilestoneDTO milestoneDTO) {
        if (milestoneDTO == null) {
            return null;
        }

        Milestone.MilestoneBuilder builder = Milestone.builder()
                .title(milestoneDTO.getTitle())
                .description(milestoneDTO.getDescription())
                .startDate(milestoneDTO.getStartDate())
                .dueDate(milestoneDTO.getDueDate())
                .completed(milestoneDTO.isCompleted());

        if (milestoneDTO.getId() != null) {
            builder.id(milestoneDTO.getId());
        }

        if (milestoneDTO.getProjectId() != null) {
            projectRepository.findById(milestoneDTO.getProjectId())
                    .ifPresent(builder::project);
        }

        return builder.build();
    }
}