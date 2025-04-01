package com.projectmanage.main.model.builder;

import com.projectmanage.main.model.Task;
import com.projectmanage.main.model.dto.TaskDTO;
import com.projectmanage.main.repository.MilestoneRepository;
import com.projectmanage.main.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TaskBuilder {

    public final ProjectRepository projectRepository;
    public final MilestoneRepository milestoneRepository;

    public TaskDTO toDTO(Task task){
        TaskDTO dto=new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setCompleted(task.isCompleted());

        if(task.getProject()!=null) {
            dto.setProjectId(task.getProject().getId());
        }
        if(task.getMilestone()!=null) {
            dto.setMilestoneId(task.getMilestone().getId());
        }

        dto.setDueDate(task.getDueDate());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }

    public Task toEntity(TaskDTO task){
        Task entity=new Task();
        entity.setId(task.getId());
        entity.setTitle(task.getTitle());
        entity.setDescription(task.getDescription());
        entity.setCompleted(task.isCompleted());

        if(task.getProjectId()!=null){
            entity.setProject(projectRepository.findById(task.getProjectId()).orElse(null));
        }
        if(task.getMilestoneId()!=null){
            entity.setMilestone(milestoneRepository.findById(task.getMilestoneId()).orElse(null));
        }

        entity.setDueDate(task.getDueDate());
        entity.setCreatedAt(task.getCreatedAt());
        entity.setUpdatedAt(task.getUpdatedAt());
        return entity;
    }
}
