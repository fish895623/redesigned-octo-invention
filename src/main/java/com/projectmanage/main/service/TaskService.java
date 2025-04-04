package com.projectmanage.main.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.projectmanage.main.model.Milestone;
import com.projectmanage.main.model.Project;
import com.projectmanage.main.model.Task;
import com.projectmanage.main.model.dto.TaskDTO;
import com.projectmanage.main.model.mapper.TaskMapper;
import com.projectmanage.main.repository.MilestoneRepository;
import com.projectmanage.main.repository.ProjectRepository;
import com.projectmanage.main.repository.TaskRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final MilestoneRepository milestoneRepository;
    private final TaskMapper taskMapper;

    public List<TaskDTO> getTasksByProjectId(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));
        List<Task> tasks = taskRepository.findByProjectOrderByUpdatedAtDesc(project);
        return taskMapper.toDTOList(tasks);
    }

    public List<TaskDTO> getTasksByMilestoneId(Long milestoneId) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new EntityNotFoundException("Milestone not found with id: " + milestoneId));
        List<Task> tasks = taskRepository.findByMilestoneOrderByUpdatedAtDesc(milestone);
        return taskMapper.toDTOList(tasks);
    }

    public TaskDTO getTaskById(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));
        return taskMapper.toDTO(task);
    }

    @Transactional
    public TaskDTO createTask(TaskDTO taskDTO, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));

        Task task = taskMapper.toEntity(taskDTO);
        task.setProject(project);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        // If milestone ID is provided, associate the task with the milestone
        if (taskDTO.getMilestoneId() != null) {
            Milestone milestone = milestoneRepository.findById(taskDTO.getMilestoneId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Milestone not found with id: " + taskDTO.getMilestoneId()));

            // Ensure the milestone belongs to the same project
            if (!milestone.getProject().getId().equals(projectId)) {
                throw new IllegalArgumentException("Milestone does not belong to the specified project");
            }

            task.setMilestone(milestone);
        }

        Task savedTask = taskRepository.save(task);
        return taskMapper.toDTO(savedTask);
    }

    @Transactional
    public TaskDTO updateTask(Long taskId, TaskDTO taskDTO) {
        Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));

        existingTask.setTitle(taskDTO.getTitle());
        existingTask.setDescription(taskDTO.getDescription());
        existingTask.setCompleted(taskDTO.isCompleted());
        existingTask.setDueDate(taskDTO.getDueDate());
        existingTask.setUpdatedAt(LocalDateTime.now());

        // Handle milestone association
        if (taskDTO.getMilestoneId() != null) {
            Milestone milestone = milestoneRepository.findById(taskDTO.getMilestoneId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Milestone not found with id: " + taskDTO.getMilestoneId()));

            // Ensure the milestone belongs to the same project
            if (!milestone.getProject().getId().equals(existingTask.getProject().getId())) {
                throw new IllegalArgumentException("Milestone does not belong to the same project as the task");
            }

            existingTask.setMilestone(milestone);
        } else {
            existingTask.setMilestone(null);
        }

        Task updatedTask = taskRepository.save(existingTask);
        return taskMapper.toDTO(updatedTask);
    }

    @Transactional
    public void deleteTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));

        taskRepository.delete(task);
    }
}