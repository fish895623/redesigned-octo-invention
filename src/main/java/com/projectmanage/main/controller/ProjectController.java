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
import com.projectmanage.main.model.dto.ProjectDTO;
import com.projectmanage.main.service.ProjectService;
import com.projectmanage.main.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Slf4j
public class ProjectController {
    private final ProjectService projectService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects(@AuthenticationPrincipal CustomUserDetails principal) {
        log.trace("ProjectController.getAllProjects");
        List<ProjectDTO> projects = projectService.getAllProjects();

        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        log.trace("ProjectController.getProjectById");
        User user = userService.getUserFromPrincipal(principal);
        ProjectDTO project = projectService.getProjectById(id);

        // Ensure the user owns this project
        if (!project.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(project);
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO projectDTO,
            @AuthenticationPrincipal CustomUserDetails principal) {
        log.trace("ProjectController.createProject");
        User user = userService.getUserFromPrincipal(principal);
        ProjectDTO createdProject = projectService.createProject(projectDTO, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(
            @PathVariable Long id,
            @RequestBody ProjectDTO projectDTO,
            @AuthenticationPrincipal CustomUserDetails principal) {
        log.trace("ProjectController.updateProject");

        User user = userService.getUserFromPrincipal(principal);
        ProjectDTO existingProject = projectService.getProjectById(id);

        // Ensure the user owns this project
        if (!existingProject.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        ProjectDTO updatedProject = projectService.updateProject(id, projectDTO);
        return ResponseEntity.ok(updatedProject);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        log.trace("deleteProject");

        User user = userService.getUserFromPrincipal(principal);
        ProjectDTO project = projectService.getProjectById(id);

        // Ensure the user owns this project
        if (!project.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}