package com.projectmanage.main.model.mapper;

import com.projectmanage.main.model.Milestone;
import com.projectmanage.main.model.dto.MilestoneDTO;
import com.projectmanage.main.repository.ProjectRepository;
import com.projectmanage.main.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MilestoneMapper {
    public final TaskMapper taskBuilder;
    public final ProjectRepository projectRepository;
    public final TaskRepository taskRepository;

    public MilestoneDTO toDTO(Milestone milestone) {
        MilestoneDTO dto = new MilestoneDTO();
        dto.setId(milestone.getId());
        dto.setTitle(milestone.getTitle());
        dto.setDescription(milestone.getDescription());

        if (milestone.getProject() != null) {
            dto.setProjectId(milestone.getProject().getId());
        }

        dto.setStartDate(milestone.getStartDate());
        dto.setDueDate(milestone.getDueDate());
        dto.setCompleted(milestone.isCompleted());

        dto.setTasks(milestone.getTasks().stream().map(taskBuilder::toDTO).toList());

        dto.setCreatedAt(milestone.getCreatedAt());
        dto.setUpdatedAt(milestone.getUpdatedAt());

        return dto;
    }

    public Milestone toEntity(MilestoneDTO milestone){
        Milestone entity = new Milestone();
        entity.setId(milestone.getId());
        entity.setTitle(milestone.getTitle());
        entity.setDescription(milestone.getDescription());

        if (milestone.getProjectId()!= null) {
            entity.setProject(projectRepository.findById(milestone.getProjectId()).orElse(null));
        }

        entity.setStartDate(milestone.getStartDate());
        entity.setDueDate(milestone.getDueDate());
        entity.setCompleted(milestone.isCompleted());

        entity.setTasks(taskRepository.findByMilestone_Id(milestone.getId()));

        entity.setCreatedAt(milestone.getCreatedAt());
        entity.setUpdatedAt(milestone.getUpdatedAt());
        return entity;
    }
}
