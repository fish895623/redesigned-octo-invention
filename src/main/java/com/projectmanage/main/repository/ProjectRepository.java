package com.projectmanage.main.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projectmanage.main.model.Project;
import com.projectmanage.main.model.User;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByUser(User user);

    List<Project> findByUserOrderByCreatedAtDesc(User user);

}