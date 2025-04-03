package com.projectmanage.main.controller;

import com.projectmanage.main.model.dto.MilestoneDTO;
import com.projectmanage.main.service.MilestoneService;
import com.projectmanage.main.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects/{projectId}/milestones")
public class MilestoneController {

    private final MilestoneService milestoneService;
    private final ProjectService projectService;

    //마일스톤 목록 읽기
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/api/projects/{projectId}/milestones")
    public ResponseEntity<?> getAllMilestones(@PathVariable Long projectId) {
        return ResponseEntity.ok(milestoneService.getMilestoneList(projectId));
    }

    //마일스톤 등록하기
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/api/projects/{projectId}/milestones")
    public ResponseEntity<?> registerMilestone(@PathVariable Long projectId, @RequestBody MilestoneDTO milestone) {
        try {
            MilestoneDTO newMilestone = milestoneService.addMilestone(projectId, milestone);
            return ResponseEntity.ok(newMilestone);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //마일스톤 하나 읽기
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/api/projects/{projectId}/milestones/{milestoneId}")
    public ResponseEntity<?> getMilestoneById(@PathVariable Long projectId, @PathVariable Long milestoneId) {
        try {
            MilestoneDTO milestone = milestoneService.getMilestone(milestoneId);
            return ResponseEntity.ok(milestone);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



}
