package com.projectmanage.main.repository;

import com.projectmanage.main.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository  extends JpaRepository<Task, Long> {

    List<Task> findByProject_Id(Long id);

    List<Task> findByMilestone_Id(Long id);

}