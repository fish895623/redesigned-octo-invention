package com.projectmanage.main.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<List<ProjectDTO>> getAllProjects(@AuthenticationPrincipal OAuth2User principal) {
        log.info("Getting all projects");
        User user = userService.getUserFromPrincipal(principal);
        List<ProjectDTO> projects = projectService.getProjectsByUserId(user.getId());
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long projectId,
            @AuthenticationPrincipal OAuth2User principal) {
        User user = userService.getUserFromPrincipal(principal);
        ProjectDTO project = projectService.getProjectById(projectId);

        // Ensure the user owns this project
        if (!project.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(project);
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO projectDTO,
            @AuthenticationPrincipal OAuth2User principal) {
        log.info("Creating project: {}", projectDTO);
        User user = userService.getUserFromPrincipal(principal);
        ProjectDTO createdProject = projectService.createProject(projectDTO, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectDTO> updateProject(
            @PathVariable Long projectId,
            @RequestBody ProjectDTO projectDTO,
            @AuthenticationPrincipal OAuth2User principal) {

        User user = userService.getUserFromPrincipal(principal);
        ProjectDTO existingProject = projectService.getProjectById(projectId);

        // Ensure the user owns this project
        if (!existingProject.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        ProjectDTO updatedProject = projectService.updateProject(projectId, projectDTO);
        return ResponseEntity.ok(updatedProject);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId,
            @AuthenticationPrincipal OAuth2User principal) {
        User user = userService.getUserFromPrincipal(principal);
        ProjectDTO project = projectService.getProjectById(projectId);

        // Ensure the user owns this project
        if (!project.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }
}