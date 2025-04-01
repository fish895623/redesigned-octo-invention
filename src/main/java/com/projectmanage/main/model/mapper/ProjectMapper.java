package com.projectmanage.main.model.mapper;


import com.projectmanage.main.model.Project;
import com.projectmanage.main.model.dto.ProjectDTO;
import com.projectmanage.main.repository.MilestoneRepository;
import com.projectmanage.main.repository.TaskRepository;
import com.projectmanage.main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProjectMapper {

    private final MilestoneMapper milestoneBuilder;
    private final TaskMapper taskBuilder;

    private final UserRepository userRepository;
    private final MilestoneRepository milestoneRepository;
    private final TaskRepository taskRepository;

    public ProjectDTO toDTO(Project project){

        if(project == null) return null;

        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setUserId(project.getUser().getId());

        if(project.getMilestones()!=null){
            dto.setMilestones(project.getMilestones().stream().map(milestoneBuilder::toDTO).toList());
        }
        if(project.getTasks()!=null){
            dto.setTasks(project.getTasks().stream().map(taskBuilder::toDTO).toList());
        }
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());

        return dto;
    }

    public Project toEntity(ProjectDTO projectDTO){

        if(projectDTO == null) return null;

        Project entity=new Project();
        entity.setId(projectDTO.getId());
        entity.setTitle(projectDTO.getTitle());
        entity.setDescription(projectDTO.getDescription());

        entity.setUser(userRepository.findById(projectDTO.getUserId()).orElse(null));

        entity.setMilestones(milestoneRepository.findByProject_Id(projectDTO.getId()));
        entity.setTasks(taskRepository.findByProject_Id(projectDTO.getId()));

        entity.setCreatedAt(projectDTO.getCreatedAt());
        entity.setUpdatedAt(projectDTO.getUpdatedAt());
        return entity;
    }

}
