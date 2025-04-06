package com.projectmanage.main.service;

import java.util.List;
import java.util.Objects;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.projectmanage.main.model.dto.MilestoneDTO;
import com.projectmanage.main.model.dto.TaskDTO;
import com.projectmanage.main.model.mapper.MilestoneMapper;
import com.projectmanage.main.repository.MilestoneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class MilestoneService {
  // Service
  private final TaskService taskService;
  // Repository
  private final MilestoneRepository milestoneRepository;
  // Mapper
  private final MilestoneMapper milestoneMapper;

  // 마일스톤 목록 읽기
  @Transactional(readOnly = true)
  public List<MilestoneDTO> getMilestoneList(Long projectId) {
    return milestoneMapper.toDTOList(milestoneRepository.findByProjectId(projectId));
  }

  // 마일스톤 읽기
  @Transactional(readOnly = true)
  public MilestoneDTO getMilestone(Long milestoneId) {
    try {
      return milestoneMapper.toDTO(milestoneRepository.findById(milestoneId).orElseThrow(
          () -> new IllegalArgumentException("Milestone not found with id: " + milestoneId)));
    } catch (Exception e) {
      log.error("Error fetching milestone with id {}: {}", milestoneId, e.getMessage());
      throw e;
    }
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
      log.error("Error occurred while updating milestone: {}", e.getMessage());
    }
  }

  // 마일스톤 삭제(DELETE CASCADE)
  @Transactional
  public void deleteMilestone(Long milestoneId, Boolean isCascadeDelete) {
    try {
      if (isCascadeDelete) {
        List<Long> taskIds =
            taskService.getTasksByMilestoneId(milestoneId).stream().map(TaskDTO::getId).toList();
        taskIds.forEach(taskService::deleteTask);
      }
      milestoneRepository.deleteById(milestoneId);
    } catch (Exception e) {
      log.error("Error occurred while deleting milestone: {}", e.getMessage());
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
