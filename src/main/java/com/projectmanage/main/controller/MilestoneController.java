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
import com.projectmanage.main.service.MilestoneService;
import com.projectmanage.main.service.ProjectService;
import com.projectmanage.main.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/projects/{projectId}/milestones")
@RequiredArgsConstructor
@Slf4j
public class MilestoneController {

    private final MilestoneService milestoneService;
    private final ProjectService projectService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<MilestoneDTO>> getMilestonesByProjectId(
            @PathVariable Long projectId,
            @AuthenticationPrincipal CustomUserDetails principal) {

        User user = userService.getUserFromPrincipal(principal);
        ProjectDTO project = projectService.getProjectById(projectId);

        // Ensure the user owns this project
        if (!project.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<MilestoneDTO> milestones = milestoneService.getMilestonesByProjectId(projectId);
        return ResponseEntity.ok(milestones);
    }

    @GetMapping("/{milestoneId}")
    public ResponseEntity<MilestoneDTO> getMilestoneById(
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

        return ResponseEntity.ok(milestone);
    }

    @PostMapping
    public ResponseEntity<MilestoneDTO> createMilestone(
            @PathVariable(name = "projectId") Long projectId,
            @RequestBody MilestoneDTO milestoneDTO,
            @AuthenticationPrincipal CustomUserDetails principal) {

        User user = userService.getUserFromPrincipal(principal);
        ProjectDTO project = projectService.getProjectById(projectId);

        // Ensure the user owns this project
        if (!project.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        MilestoneDTO createdMilestone = milestoneService.createMilestone(milestoneDTO, projectId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMilestone);
    }

    @PutMapping("/{milestoneId}")
    public ResponseEntity<MilestoneDTO> updateMilestone(
            @PathVariable Long projectId,
            @PathVariable Long milestoneId,
            @RequestBody MilestoneDTO milestoneDTO,
            @AuthenticationPrincipal CustomUserDetails principal) {

        User user = userService.getUserFromPrincipal(principal);
        ProjectDTO project = projectService.getProjectById(projectId);

        // Ensure the user owns this project
        if (!project.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        MilestoneDTO existingMilestone = milestoneService.getMilestoneById(milestoneId);

        // Ensure the milestone belongs to the specified project
        if (!existingMilestone.getProjectId().equals(projectId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        MilestoneDTO updatedMilestone = milestoneService.updateMilestone(milestoneId, milestoneDTO);
        return ResponseEntity.ok(updatedMilestone);
    }

    @DeleteMapping("/{milestoneId}")
    public ResponseEntity<Void> deleteMilestone(
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

        milestoneService.deleteMilestone(milestoneId);
        return ResponseEntity.noContent().build();
    }
}