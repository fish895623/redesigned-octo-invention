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
import org.springframework.web.bind.annotation.RestController;
import com.projectmanage.main.dto.CustomUserDetails;
import com.projectmanage.main.model.dto.ProjectDTO;
import com.projectmanage.main.service.ProjectService;
import com.projectmanage.main.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects")
public class ProjectController {

  private final ProjectService projectService;
  private final UserService userService;

  // 프로젝트 목록 읽기
  @PreAuthorize("isAuthenticated()")
  @GetMapping
  public ResponseEntity<?> getAllProjects(@AuthenticationPrincipal CustomUserDetails userDetails) {
    return ResponseEntity.ok(projectService.getProjectListByUser(userDetails.getUsername()));
  }

  // 프로젝트 등록
  @PreAuthorize("isAuthenticated()")
  @PostMapping
  public ResponseEntity<?> postProject(@AuthenticationPrincipal CustomUserDetails userDetails,
      @RequestBody ProjectDTO projectDTO) {
    projectDTO.setUserId(userService.getUserFromPrincipal(userDetails).getId());
    ProjectDTO newProject = projectService.addProject(projectDTO);
    return ResponseEntity.ok(newProject);
  }

  // 프로젝트 하나 읽기
  @GetMapping("/{projectId}")
  public ResponseEntity<?> getProjectById(@PathVariable Long projectId,
      @AuthenticationPrincipal CustomUserDetails userDetails) {
    ProjectDTO projectDTO = projectService.getProjectById(projectId);
    return ResponseEntity.ok(projectDTO);
  }

  // 프로젝트 수정
  @PreAuthorize("isAuthenticated()")
  @PutMapping("/{projectId}")
  public ResponseEntity<?> updateProject(@AuthenticationPrincipal CustomUserDetails userDetails,
      @PathVariable Long projectId, @RequestBody ProjectDTO projectDTO) {
    projectService.updateProject(projectId, projectDTO);
    return ResponseEntity.ok("Project updated successfully");
  }

  // 프로젝트 삭제
  @PreAuthorize("isAuthenticated()")
  @DeleteMapping("/{projectId}")
  public ResponseEntity<?> deleteProject(@AuthenticationPrincipal CustomUserDetails userDetails,
      @PathVariable Long projectId) {
    projectService.deleteProject(projectId);
    return ResponseEntity.ok("Project deleted successfully");
  }
}
