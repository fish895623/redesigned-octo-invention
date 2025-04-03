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

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/")
    public ResponseEntity<?> getAllProjects(@AuthenticationPrincipal CustomUserDetails userDetails){
        return ResponseEntity.ok(projectService.getProjectListByUser(userDetails.getUsername()));
    }


    @PreAuthorize("isAuthenticated()")
    @PostMapping("/")
    public ResponseEntity<?> PostProject(@AuthenticationPrincipal CustomUserDetails userDetails,
                                         ProjectDTO projectDTO){
        projectDTO.setUserId(userService.getUserFromPrincipal(userDetails).getId());
        ProjectDTO newProject=projectService.addProject(projectDTO);
        return ResponseEntity.ok(newProject);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{projectId}")
    public ResponseEntity<?> getProjectById(@PathVariable Long projectId,
                                          @AuthenticationPrincipal CustomUserDetails userDetails){
            ProjectDTO projectDTO=projectService.getProjectById(projectId);
            return ResponseEntity.ok(projectDTO);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{projectId}")
    public ResponseEntity<?> updateProject(@PathVariable Long projectId,
                                         @RequestBody ProjectDTO projectDTO){
        //추후 구현
        return ResponseEntity.ok("Project updated successfully");
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProject(@PathVariable Long projectId){
        //추후 구현
        return ResponseEntity.ok("Project deleted successfully");
    }

}
