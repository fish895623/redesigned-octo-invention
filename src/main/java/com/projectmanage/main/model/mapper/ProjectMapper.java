package com.projectmanage.main.model.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.projectmanage.main.model.Project;
import com.projectmanage.main.model.dto.ProjectDTO;
import com.projectmanage.main.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProjectMapper {

    private final UserRepository userRepository;
    private final MilestoneMapper milestoneMapper;
    private final TaskMapper taskMapper;

    public ProjectDTO toDTO(Project project) {
        if (project == null) {
            return null;
        }

        ProjectDTO.ProjectDTOBuilder builder = ProjectDTO.builder().id(project.getId())
                        .title(project.getTitle()).description(project.getDescription())
                        .userId(project.getUser().getId()).createdAt(project.getCreatedAt())
                        .updatedAt(project.getUpdatedAt());

        // Safely handle milestones that might be null
        if (project.getMilestones() != null) {
            builder.milestones(project.getMilestones().stream().map(milestoneMapper::toDTO)
                            .collect(Collectors.toList()));
        } else {
            builder.milestones(List.of());
        }

        // Safely handle tasks that might be null
        if (project.getTasks() != null) {
            builder.tasks(project.getTasks().stream().map(taskMapper::toDTO)
                            .collect(Collectors.toList()));
        } else {
            builder.tasks(List.of());
        }

        return builder.build();
    }

    public List<ProjectDTO> toDTOList(List<Project> projects) {
        return projects.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Project toEntity(ProjectDTO projectDTO) {
        if (projectDTO == null) {
            return null;
        }

        Project.ProjectBuilder builder = Project.builder().title(projectDTO.getTitle())
                        .description(projectDTO.getDescription());

        if (projectDTO.getId() != null) {
            builder.id(projectDTO.getId());
        }

        if (projectDTO.getUserId() != null) {
            userRepository.findById(projectDTO.getUserId()).ifPresent(builder::user);
        }

        return builder.build();
    }
}
