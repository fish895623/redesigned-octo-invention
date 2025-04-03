package com.projectmanage.main.controller;

import com.projectmanage.main.dto.CustomUserDetails;
import com.projectmanage.main.model.dto.ProjectDTO;
import com.projectmanage.main.service.ProjectService;
import com.projectmanage.main.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService;

    //프로젝트 목록 읽기
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/")
    public ResponseEntity<?> getAllProjects(@AuthenticationPrincipal CustomUserDetails userDetails){
        return ResponseEntity.ok(projectService.getProjectListByUser(userDetails.getUsername()));
    }

    //프로젝트 등록
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/")
    public ResponseEntity<?> PostProject(@AuthenticationPrincipal CustomUserDetails userDetails,
                                         ProjectDTO projectDTO){
        projectDTO.setUserId(userService.getUserFromPrincipal(userDetails).getId());
        ProjectDTO newProject=projectService.addProject(projectDTO);
        return ResponseEntity.ok(newProject);
    }

    //프로젝트 하나 읽기
    @GetMapping("/{projectId}")
    public ResponseEntity<?> getProjectById(@PathVariable Long projectId,
                                          @AuthenticationPrincipal CustomUserDetails userDetails){
            ProjectDTO projectDTO=projectService.getProjectById(projectId);
            return ResponseEntity.ok(projectDTO);
    }

    //프로젝트 수정
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{projectId}")
    public ResponseEntity<?> updateProject(@AuthenticationPrincipal CustomUserDetails userDetails,
                                           @PathVariable Long projectId,
                                           @RequestBody ProjectDTO projectDTO){
        //추후 구현
        return ResponseEntity.ok("Project updated successfully");
    }

    //프로젝트 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProject(@AuthenticationPrincipal CustomUserDetails userDetails,
                                           @PathVariable Long projectId){
        //추후 구현
        return ResponseEntity.ok("Project deleted successfully");
    }

}
