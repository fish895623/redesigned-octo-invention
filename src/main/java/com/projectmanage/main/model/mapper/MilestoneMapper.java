package com.projectmanage.main.model.mapper;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.annotation.PostConstruct;
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
    private static ProjectRepository staticProjectRepository;

    @PostConstruct
    public void init() {
        staticProjectRepository = projectRepository;
    }

    public static MilestoneDTO toDTO(Milestone milestone) {
        if (milestone == null) {
            return null;
        }

        List<TaskDTO> tasks = milestone.getTasks() != null
                ? milestone.getTasks().stream()
                        .map(TaskMapper::toDTO)
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

    public static List<MilestoneDTO> toDTOList(List<Milestone> milestones) {
        return milestones.stream()
                .map(MilestoneMapper::toDTO)
                .collect(Collectors.toList());
    }

    public static Milestone toEntity(MilestoneDTO milestoneDTO) {

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
            staticProjectRepository.findById(milestoneDTO.getProjectId())
                    .ifPresent(builder::project);
        }

        return builder.build();
    }
}