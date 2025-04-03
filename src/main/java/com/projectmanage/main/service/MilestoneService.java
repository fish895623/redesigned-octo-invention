package com.projectmanage.main.service;

import com.projectmanage.main.model.dto.MilestoneDTO;
import com.projectmanage.main.model.mapper.MilestoneMapper;
import com.projectmanage.main.repository.MilestoneRepository;
import com.projectmanage.main.repository.ProjectRepository;
import com.projectmanage.main.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    private final MilestoneMapper milestoneMapper;

    //마일스톤 목록 읽기
    public List<MilestoneDTO> getMilestoneList(Long projectId){
        return milestoneMapper.toDTOList(milestoneRepository.findByProject_Id(projectId));
    }

    //마일스톤 읽기
    public MilestoneDTO getMilestone(Long milestoneId){
        return milestoneMapper.toDTO(milestoneRepository.findById(milestoneId).orElse(null));
    }

    //마일스톤 추가
    public MilestoneDTO addMilestone(Long projectId, MilestoneDTO milestoneDTO){
        milestoneDTO.setProjectId(projectId);
        if (!InvalidMilestone(milestoneDTO)) {
            throw new IllegalArgumentException("Invalid milestone");
        }
        return milestoneMapper.toDTO(milestoneRepository.save(milestoneMapper.toEntity(milestoneDTO)));
    }

    //마일스톤 수정
    public void updateMilestone(Long milestoneId, MilestoneDTO milestoneDTO) {
        try {
            if (!Objects.equals(milestoneId, milestoneDTO.getId())) {
                throw new IllegalArgumentException("Invalid milestone ID");
            }
            if (!InvalidMilestone2(milestoneDTO)) {
                throw new IllegalArgumentException("Invalid milestone");
            }
            milestoneRepository.save(milestoneMapper.toEntity(milestoneDTO));
        }catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    //마일스톤 삭제
    public void deleteMilestone(Long milestoneId){
        try {
            milestoneRepository.deleteById(milestoneId);
        }catch(Exception e){
            System.out.println(e.getMessage());
        }
    }

    //마일스톤 검증
    public boolean InvalidMilestone(MilestoneDTO milestone){

        //마일 스톤의 제목, 설명 검증
        if(milestone.getTitle().length()<=0 || milestone.getDescription().length()<=0){
            return false;
        }
        //같은 프로젝트 내 중복여부 검증
        if(milestoneRepository.existsByProject_IdAndTitle(milestone.getProjectId(), milestone.getTitle())){
            return false;
        }

        return true;
    }

    //마일스톤 검증2(제목, 설명 유효성만 검증)
    public boolean InvalidMilestone2(MilestoneDTO milestone){
        if(milestone.getTitle().length()<=0 || milestone.getDescription().length()<=0){
            return false;
        }
        return true;
    }
}
