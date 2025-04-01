package com.projectmanage.main.service;

import com.projectmanage.main.model.Project;
import com.projectmanage.main.model.dto.ProjectDTO;
import com.projectmanage.main.model.dto.UserDTO;
import com.projectmanage.main.model.mapper.ProjectMapper;
import com.projectmanage.main.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    public final ProjectRepository projectRepository;
    public final ProjectMapper projectMapper;

    //특정 회원의 프로젝트 목록 읽기
    @Transactional(readOnly = true)
    public List<ProjectDTO> getProjectListByUser(UserDTO userDTO) {
        List<ProjectDTO> projects = projectRepository.findByUserEmail(userDTO.getEmail()).stream().map(projectMapper::toDTO).toList();

        return projects;
    }

    //프로젝트 하나 읽기
    @Transactional(readOnly = true)
    public ProjectDTO getProjectById(Long projectId) {
        return projectMapper.toDTO(projectRepository.findById(projectId).orElse(null));
    }

    //프로젝트 생성
    @Transactional
    public ProjectDTO addProject(ProjectDTO project){
        if (!isValidProject(project)) {
            throw new IllegalArgumentException("Invalid project");
        }
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());

        Project addProject=projectRepository.save(projectMapper.toEntity(project));
        return projectMapper.toDTO(addProject);
    }

    //프로젝트 검증
    public boolean isValidProject(ProjectDTO project){
        //프로젝트 제목 동일여부 파악
        if(projectRepository.existsByTitle(project.getTitle())){
            return false;
        }
        return true;
    }

    //프로젝트 수정



    //프로젝트 삭제


}
