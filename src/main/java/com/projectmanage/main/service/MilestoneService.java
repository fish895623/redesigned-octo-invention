package com.projectmanage.main.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.projectmanage.main.model.Milestone;
import com.projectmanage.main.model.Project;
import com.projectmanage.main.model.dto.MilestoneDTO;
import com.projectmanage.main.model.mapper.MilestoneMapper;
import com.projectmanage.main.repository.MilestoneRepository;
import com.projectmanage.main.repository.ProjectRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final ProjectRepository projectRepository;
    private final MilestoneMapper milestoneMapper;

    public List<MilestoneDTO> getMilestonesByProjectId(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));
        List<Milestone> milestones = milestoneRepository.findByProjectOrderByUpdatedAtDesc(project);
        return milestoneMapper.toDTOList(milestones);
    }

    public MilestoneDTO getMilestoneById(Long milestoneId) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new EntityNotFoundException("Milestone not found with id: " + milestoneId));
        return milestoneMapper.toDTO(milestone);
    }

    @Transactional
    public MilestoneDTO createMilestone(MilestoneDTO milestoneDTO, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));

        Milestone milestone = milestoneMapper.toEntity(milestoneDTO);
        milestone.setProject(project);
        milestone.setCreatedAt(LocalDateTime.now());
        milestone.setUpdatedAt(LocalDateTime.now());

        Milestone savedMilestone = milestoneRepository.save(milestone);
        return milestoneMapper.toDTO(savedMilestone);
    }

    @Transactional
    public MilestoneDTO updateMilestone(Long milestoneId, MilestoneDTO milestoneDTO) {
        Milestone existingMilestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new EntityNotFoundException("Milestone not found with id: " + milestoneId));

        existingMilestone.setTitle(milestoneDTO.getTitle());
        existingMilestone.setDescription(milestoneDTO.getDescription());
        existingMilestone.setStartDate(milestoneDTO.getStartDate());
        existingMilestone.setDueDate(milestoneDTO.getDueDate());
        existingMilestone.setCompleted(milestoneDTO.isCompleted());
        existingMilestone.setUpdatedAt(LocalDateTime.now());

        Milestone updatedMilestone = milestoneRepository.save(existingMilestone);
        return milestoneMapper.toDTO(updatedMilestone);
    }

    @Transactional
    public void deleteMilestone(Long milestoneId) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new EntityNotFoundException("Milestone not found with id: " + milestoneId));

        milestoneRepository.delete(milestone);
    }
}