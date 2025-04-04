package com.projectmanage.main.model.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.projectmanage.main.model.Task;
import com.projectmanage.main.model.dto.TaskDTO;
import com.projectmanage.main.repository.MilestoneRepository;
import com.projectmanage.main.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TaskMapper {

    private final ProjectRepository projectRepository;
    private final MilestoneRepository milestoneRepository;

    public TaskDTO toDTO(Task task) {
        if (task == null) {
            return null;
        }

        TaskDTO.TaskDTOBuilder builder = TaskDTO.builder().id(task.getId()).title(task.getTitle())
                        .description(task.getDescription()).completed(task.isCompleted())
                        .projectId(task.getProject().getId()).dueDate(task.getDueDate())
                        .createdAt(task.getCreatedAt()).updatedAt(task.getUpdatedAt());

        if (task.getMilestone() != null) {
            builder.milestoneId(task.getMilestone().getId());
        }

        return builder.build();
    }

    public List<TaskDTO> toDTOList(List<Task> tasks) {
        return tasks.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Task toEntity(TaskDTO taskDTO) {
        if (taskDTO == null) {
            return null;
        }

        Task.TaskBuilder builder = Task.builder().title(taskDTO.getTitle())
                        .description(taskDTO.getDescription()).completed(taskDTO.isCompleted())
                        .dueDate(taskDTO.getDueDate());

        if (taskDTO.getId() != null) {
            builder.id(taskDTO.getId());
        }

        if (taskDTO.getProjectId() != null) {
            projectRepository.findById(taskDTO.getProjectId()).ifPresent(builder::project);
        }

        if (taskDTO.getMilestoneId() != null) {
            milestoneRepository.findById(taskDTO.getMilestoneId()).ifPresent(builder::milestone);
        }

        return builder.build();
    }
}
