package com.projectmanage.main.controller;

import com.projectmanage.main.model.dto.TaskDTO;
import com.projectmanage.main.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects/{projectId}/tasks")
public class TaskController {

    public final TaskService taskService;

    // 테스트 목록 읽기
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<?> getTasks(@PathVariable(name = "projectId") Long projectId) {
        List<TaskDTO> taskDTOList = taskService.getTasksByProjectId(projectId);
        return ResponseEntity.ok(taskDTOList);
    }

    // 테스크 등록하기
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<?> createTask(@PathVariable(name = "projectId") Long projectId,
        @RequestBody TaskDTO taskDTO) {
        TaskDTO createdTaskDTO = taskService.createTask(taskDTO, projectId);
        return ResponseEntity.ok(createdTaskDTO);
    }

    // 테스크 하나 읽기
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{taskId}")
    public ResponseEntity<?> getTask(@PathVariable(name = "projectId") Long projectId,
        @PathVariable(name = "taskId") Long taskId) {
        TaskDTO readTaskDTO = taskService.getTaskById(taskId);
        return ResponseEntity.ok(readTaskDTO);
    }

    // 테스크 수정
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable(name = "projectId") Long projectId,
        @PathVariable(name = "taskId") Long taskId,
        @RequestBody TaskDTO taskDTO) {
        TaskDTO updatedTask = taskService.updateTask(taskId, taskDTO);
        return ResponseEntity.ok(updatedTask);
    }

    // 테스크 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable(name = "projectId") Long projectId,
        @PathVariable(name = "taskId") Long taskId){
        taskService.deleteTask(taskId);
        return ResponseEntity.ok("Task deleted successfully");
    }
}
