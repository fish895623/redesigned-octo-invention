package com.projectmanage.main.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.projectmanage.main.model.Project;
import com.projectmanage.main.model.dto.ProjectDTO;
import com.projectmanage.main.model.mapper.ProjectMapper;
import com.projectmanage.main.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    // 특정 회원의 프로젝트 목록 읽기
    @Transactional(readOnly = true)
    public List<ProjectDTO> getProjectListByUser(String userEmail) {
        List<ProjectDTO> projects =
                projectMapper.toDTOList(projectRepository.findByUserEmail(userEmail));
        return projects;
    }

    // 프로젝트 하나 읽기
    @Transactional(readOnly = true)
    public ProjectDTO getProjectById(Long projectId) {
        return projectMapper.toDTO(projectRepository.findById(projectId).orElse(null));
    }

    // 프로젝트 생성
    @Transactional
    public ProjectDTO addProject(ProjectDTO project) {
        if (!isValidProject(project)) {
            throw new IllegalArgumentException("Invalid project");
        }

        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());

        Project addProject = projectRepository.save(projectMapper.toEntity(project));
        return projectMapper.toDTO(addProject);
    }

    // 프로젝트 수정
    public void updateProject(Long projectId, ProjectDTO project) {
        // 프로젝트 아이디, 프로젝트 객체 내 아이디 동일 여부 검증
        try {
            if (!Objects.equals(projectId, project.getId())) {
                throw new IllegalArgumentException("Invalid project id");
            }
            if (!isValidProject2(project)) {
                throw new IllegalArgumentException("Invalid project");
            }
            projectRepository.save(projectMapper.toEntity(project));
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // 프로젝트 삭제
    public void deleteProject(Long projectId) {
        try {
            projectRepository.deleteById(projectId);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // 프로젝트 검증
    public boolean isValidProject(ProjectDTO project) {
        // 프로젝트의 각 속성 존재여부 검증
        if(project==null || project.getTitle()==null || project.getDescription()==null){
            return false;
        }
        if(project.getTitle().trim().isEmpty() || project.getDescription().trim().isEmpty()){
            return false;
        }

        // 프로젝트 제목 동일여부 파악
        if (projectRepository.existsByTitle(project.getTitle())) {
            return false;
        }
        return true;
    }

    // 프로젝트 검증2(제목, 설명 유효성만 검증)
    public boolean isValidProject2(ProjectDTO project) {
        if(project==null || project.getTitle()==null || project.getDescription()==null){
            return false;
        }
        if(project.getTitle().trim().isEmpty() || project.getDescription().trim().isEmpty()){
            return false;
        }

        return true;
    }

    private void projectId(Long id) {
        // ... existing code ...
    }
}
