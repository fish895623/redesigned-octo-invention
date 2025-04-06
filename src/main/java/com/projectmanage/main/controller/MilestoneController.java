package com.projectmanage.main.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.projectmanage.main.dto.CustomUserDetails;
import com.projectmanage.main.model.dto.MilestoneDTO;
import com.projectmanage.main.service.MilestoneService;
import com.projectmanage.main.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects/{projectId}/milestones")
public class MilestoneController {

  private final MilestoneService milestoneService;
  private final TaskService taskService;

  // 마일스톤 목록 읽기
  @PreAuthorize("isAuthenticated()")
  @GetMapping
  public ResponseEntity<?> getAllMilestones(@PathVariable(name = "projectId") Long projectId) {
    return ResponseEntity.ok(milestoneService.getMilestoneList(projectId));
  }

  // 마일스톤 등록하기
  @PreAuthorize("isAuthenticated()")
  @PostMapping
  public ResponseEntity<?> registerMilestone(@PathVariable(name = "projectId") Long projectId,
      @RequestBody MilestoneDTO milestone) {
    MilestoneDTO newMilestone = milestoneService.addMilestone(projectId, milestone);
    return ResponseEntity.ok(newMilestone);
  }

  // 마일스톤 하나 읽기
  @PreAuthorize("isAuthenticated()")
  @GetMapping("/{milestoneId}")
  public ResponseEntity<MilestoneDTO> getMilestoneById(
      @PathVariable(name = "projectId") Long projectId,
      @PathVariable(name = "milestoneId") Long milestoneId) {
    try {
      MilestoneDTO milestone = milestoneService.getMilestone(milestoneId);
      if (milestone == null) {
        return ResponseEntity.notFound().build();
      }
      return ResponseEntity.ok(milestone);
    } catch (Exception e) {
      log.error("Error fetching milestone: {}", e.getMessage(), e);
      return ResponseEntity.internalServerError().build();
    }
  }

  // 마일스톤 수정
  @PreAuthorize("isAuthenticated()")
  @PutMapping("/{milestoneId}")
  public ResponseEntity<?> updateMilestone(@AuthenticationPrincipal CustomUserDetails userDetails,
      @PathVariable(name = "projectId") Long projectId,
      @PathVariable(name = "milestoneId") Long milestoneId,
      @RequestBody MilestoneDTO milestoneDTO) {
    milestoneService.updateMilestone(milestoneId, milestoneDTO);
    return ResponseEntity.ok("Milestone updated successfully");
  }

  // 마일스톤 삭제
  @PreAuthorize("isAuthenticated()")
  @DeleteMapping("/{milestoneId}")
  public ResponseEntity<?> deleteMilestone(@AuthenticationPrincipal CustomUserDetails userDetails,
      @PathVariable(name = "projectId") Long projectId,
      @PathVariable(name = "milestoneId") Long milestoneId,
      @RequestParam(name = "isCascadeDelete") boolean isCascadeDelete) {
    milestoneService.deleteMilestone(milestoneId, isCascadeDelete);
    return ResponseEntity.ok("Milestone deleted successfully");
  }

  // 마일 스톤에 속하는 테스크 목록 읽기
  @PreAuthorize("isAuthenticated()")
  @GetMapping("/{milestoneId}/tasks")
  public ResponseEntity<?> getTasks(@PathVariable(name = "milestoneId") Long milestoneId) {
    return ResponseEntity.ok(taskService.getTasksByMilestoneId(milestoneId));
  }
}
