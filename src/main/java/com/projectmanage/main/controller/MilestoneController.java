package com.projectmanage.main.controller;

import com.projectmanage.main.dto.CustomUserDetails;
import com.projectmanage.main.model.dto.MilestoneDTO;
import com.projectmanage.main.service.MilestoneService;
import com.projectmanage.main.service.ProjectService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    @GetMapping
    public ResponseEntity<?> getAllMilestones(@PathVariable(name = "projectId") Long projectId) {
        return ResponseEntity.ok(milestoneService.getMilestoneList(projectId));
    }

    //마일스톤 등록하기
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<?> registerMilestone(@PathVariable(name = "projectId") Long projectId, @RequestBody MilestoneDTO milestone) {
        MilestoneDTO newMilestone = milestoneService.addMilestone(projectId, milestone);
        return ResponseEntity.ok(newMilestone);
    }

    //마일스톤 하나 읽기
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{milestoneId}")
    public ResponseEntity<?> getMilestoneById(@PathVariable(name = "projectId") Long projectId,
                                              @PathVariable(name = "milestoneId") Long milestoneId) {
        MilestoneDTO milestone = milestoneService.getMilestone(milestoneId);
        return ResponseEntity.ok(milestone);
    }

    //마일스톤 수정
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{milestoneId}")
    public ResponseEntity<?> updateMilestone(@AuthenticationPrincipal CustomUserDetails userDetails,
                                             @PathVariable(name = "projectId") Long projectId,
                                             @PathVariable(name = "milestoneId") Long milestoneId,
                                             @RequestBody MilestoneDTO milestoneDTO){
        milestoneService.updateMilestone(milestoneId,milestoneDTO);
        return ResponseEntity.ok("Milestone updated successfully");
    }

    //마일스톤 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{milestoneId}")
    public ResponseEntity<?> deleteMilestone(@AuthenticationPrincipal CustomUserDetails userDetails,
                                             @PathVariable(name = "projectId") Long projectId,
                                             @PathVariable(name = "milestoneId") Long milestoneId){
        milestoneService.deleteMilestone(milestoneId);
        return ResponseEntity.ok("Milestone deleted successfully");
    }
}
