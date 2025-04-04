package com.projectmanage.main.service;

import java.util.List;
import java.util.Objects;

import com.projectmanage.main.model.dto.TaskDTO;
import org.springframework.stereotype.Service;

import com.projectmanage.main.model.dto.MilestoneDTO;
import com.projectmanage.main.model.mapper.MilestoneMapper;
import com.projectmanage.main.repository.MilestoneRepository;
import com.projectmanage.main.repository.ProjectRepository;
import com.projectmanage.main.repository.TaskRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MilestoneService {

  private final TaskService taskService;

  private final MilestoneRepository milestoneRepository;
  private final ProjectRepository projectRepository;
  private final TaskRepository taskRepository;

  private final MilestoneMapper milestoneMapper;

  // 마일스톤 목록 읽기
  @Transactional(readOnly = true)
  public List<MilestoneDTO> getMilestoneList(Long projectId) {
    return milestoneMapper.toDTOList(milestoneRepository.findByProjectId(projectId));
  }

  // 마일스톤 읽기
  @Transactional(readOnly = true)
  public MilestoneDTO getMilestone(Long milestoneId) {
    return milestoneMapper.toDTO(milestoneRepository.findById(milestoneId).orElse(null));
  }

  // 마일스톤 추가
  @Transactional
  public MilestoneDTO addMilestone(Long projectId, MilestoneDTO milestoneDTO) {
    milestoneDTO.setProjectId(projectId);
    if (!isValidMilestone(milestoneDTO)) {
      throw new IllegalArgumentException("Invalid milestone");
    }
    return milestoneMapper.toDTO(milestoneRepository.save(milestoneMapper.toEntity(milestoneDTO)));
  }

  // 마일스톤 수정
  @Transactional
  public void updateMilestone(Long milestoneId, MilestoneDTO milestoneDTO) {
    try {
      if (!Objects.equals(milestoneId, milestoneDTO.getId())) {
        throw new IllegalArgumentException("Invalid milestone ID");
      }
      if (!isValidMilestoneTwo(milestoneDTO)) {
        throw new IllegalArgumentException("Invalid milestone");
      }
      milestoneRepository.save(milestoneMapper.toEntity(milestoneDTO));
    } catch (Exception e) {
      System.out.println(e.getMessage());
    }
  }

    // 마일스톤 삭제(DELETE CASCADE)
    @Transactional
    public void deleteMilestone(Long milestoneId) {
        try {
            List<Long> TaskIds =taskService.getTasksByMilestoneId(milestoneId).stream().map(TaskDTO::getId).toList();
            TaskIds.stream().forEach(taskService::deleteTask);
            milestoneRepository.deleteById(milestoneId);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

  // 마일스톤 검증
  public boolean isValidMilestone(MilestoneDTO milestone) {

    // 마일 스톤의 관련 속성들 유효성 확인
    if (milestone == null || milestone.getTitle() == null || milestone.getDescription() == null
        || milestone.getProjectId() == null) {
      return false;
    }
    if (milestone.getTitle().trim().isEmpty() || milestone.getDescription().trim().isEmpty()) {
      return false;
    }
    // 같은 프로젝트 내 중복여부 검증
    if (milestoneRepository.existsByProjectIdAndTitle(milestone.getProjectId(),
        milestone.getTitle())) {
      return false;
    }

    return true;
  }

  // 마일스톤 검증2(제목, 설명 유효성만 검증)
  public boolean isValidMilestoneTwo(MilestoneDTO milestone) {
    // 마일 스톤의 관련 속성들 유효성 확인
    if (milestone == null || milestone.getTitle() == null || milestone.getDescription() == null
        || milestone.getProjectId() == null) {
      return false;
    }
    if (milestone.getTitle().trim().isEmpty() || milestone.getDescription().trim().isEmpty()) {
      return false;
    }

    return true;
  }
}
