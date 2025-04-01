package com.projectmanage.main.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projectmanage.main.dto.CustomUserDetails;
import com.projectmanage.main.model.User;
import com.projectmanage.main.model.dto.MilestoneDTO;
import com.projectmanage.main.model.dto.ProjectDTO;
import com.projectmanage.main.model.dto.TaskDTO;
import com.projectmanage.main.service.MilestoneService;
import com.projectmanage.main.service.ProjectService;
import com.projectmanage.main.service.TaskService;
import com.projectmanage.main.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/projects/{projectId}")
@RequiredArgsConstructor
@Slf4j
public class TaskController {

    private final TaskService taskService;
    private final ProjectService projectService;
    private final MilestoneService milestoneService;
    private final UserService userService;

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskDTO>> getTasksByProjectId(
            @PathVariable Long projectId,
            @AuthenticationPrincipal CustomUserDetails principal) {

        User user = userService.getUserFromPrincipal(principal);
        ProjectDTO project = projectService.getProjectById(projectId);

        // Ensure the user owns this project
        if (!project.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<TaskDTO> tasks = taskService.getTasksByProjectId(projectId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/milestones/{milestoneId}/tasks")
    public ResponseEntity<List<TaskDTO>> getTasksByMilestoneId(
            @PathVariable Long projectId,
            @PathVariable Long milestoneId,
            @AuthenticationPrincipal CustomUserDetails principal) {

        User user = userService.getUserFromPrincipal(principal);
        ProjectDTO project = projectService.getProjectById(projectId);

        // Ensure the user owns this project
        if (!project.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        MilestoneDTO milestone = milestoneService.getMilestoneById(milestoneId);

        // Ensure the milestone belongs to the specified project
        if (!milestone.getProjectId().equals(projectId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<TaskDTO> tasks = taskService.getTasksByMilestoneId(milestoneId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<TaskDTO> getTaskById(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @AuthenticationPrincipal CustomUserDetails principal) {

        User user = userService.getUserFromPrincipal(principal);
        ProjectDTO project = projectService.getProjectById(projectId);

        // Ensure the user owns this project
        if (!project.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        TaskDTO task = taskService.getTaskById(taskId);

        // Ensure the task belongs to the specified project
        if (!task.getProjectId().equals(projectId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(task);
    }

    @PostMapping("/tasks")
    public ResponseEntity<TaskDTO> createTask(
            @PathVariable Long projectId,
            @RequestBody TaskDTO taskDTO,
            @AuthenticationPrincipal CustomUserDetails principal) {

        User user = userService.getUserFromPrincipal(principal);
        ProjectDTO project = projectService.getProjectById(projectId);

        // Ensure the user owns this project
        if (!project.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // If milestone ID is provided, ensure it belongs to the project
        if (taskDTO.getMilestoneId() != null) {
            MilestoneDTO milestone = milestoneService.getMilestoneById(taskDTO.getMilestoneId());
            if (!milestone.getProjectId().equals(projectId)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(null); // Milestone doesn't belong to this project
            }
        }

        TaskDTO createdTask = taskService.createTask(taskDTO, projectId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<TaskDTO> updateTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @RequestBody TaskDTO taskDTO,
            @AuthenticationPrincipal CustomUserDetails principal) {

        User user = userService.getUserFromPrincipal(principal);
        ProjectDTO project = projectService.getProjectById(projectId);

        // Ensure the user owns this project
        if (!project.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        TaskDTO existingTask = taskService.getTaskById(taskId);

        // Ensure the task belongs to the specified project
        if (!existingTask.getProjectId().equals(projectId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // If milestone ID is provided, ensure it belongs to the project
        if (taskDTO.getMilestoneId() != null) {
            MilestoneDTO milestone = milestoneService.getMilestoneById(taskDTO.getMilestoneId());
            if (!milestone.getProjectId().equals(projectId)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(null); // Milestone doesn't belong to this project
            }
        }

        TaskDTO updatedTask = taskService.updateTask(taskId, taskDTO);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @AuthenticationPrincipal CustomUserDetails principal) {

        User user = userService.getUserFromPrincipal(principal);
        ProjectDTO project = projectService.getProjectById(projectId);

        // Ensure the user owns this project
        if (!project.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        TaskDTO task = taskService.getTaskById(taskId);

        // Ensure the task belongs to the specified project
        if (!task.getProjectId().equals(projectId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}