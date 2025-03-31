package com.projectmanage.main.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.projectmanage.main.model.Project;
import com.projectmanage.main.model.User;
import com.projectmanage.main.model.dto.ProjectDTO;
import com.projectmanage.main.model.mapper.ProjectMapper;
import com.projectmanage.main.repository.ProjectRepository;
import com.projectmanage.main.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;

    @Transactional(readOnly = true)
    public List<ProjectDTO> getProjectsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        // Using the non-EntityGraph method to avoid MultipleBagFetchException
        List<Project> projects = projectRepository.findByUserOrderByCreatedAtDesc(user);
        return projectMapper.toDTOList(projects);
    }

    @Transactional(readOnly = true)
    public ProjectDTO getProjectById(Long projectId) {
        // Fetch the project first without eager loading collections
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));

        // If milestones or tasks are needed in the DTO, you can individually load them
        // This depends on what ProjectMapper.toDTO requires

        return projectMapper.toDTO(project);
    }

    // Helper method to get project with milestones
    @Transactional(readOnly = true)
    public Project getProjectWithMilestones(Long projectId) {
        return projectRepository.findWithMilestonesById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));
    }

    // Helper method to get project with tasks
    @Transactional(readOnly = true)
    public Project getProjectWithTasks(Long projectId) {
        return projectRepository.findWithTasksById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));
    }

    @Transactional
    public ProjectDTO createProject(ProjectDTO projectDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        Project project = projectMapper.toEntity(projectDTO);
        project.setUser(user);
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());

        Project savedProject = projectRepository.save(project);
        return projectMapper.toDTO(savedProject);
    }

    @Transactional
    public ProjectDTO updateProject(Long projectId, ProjectDTO projectDTO) {
        Project existingProject = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));

        existingProject.setTitle(projectDTO.getTitle());
        existingProject.setDescription(projectDTO.getDescription());
        existingProject.setUpdatedAt(LocalDateTime.now());

        Project updatedProject = projectRepository.save(existingProject);
        return projectMapper.toDTO(updatedProject);
    }

    @Transactional
    public void deleteProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));

        projectRepository.delete(project);
    }
}