package com.projectmanage.main.repository;

import com.projectmanage.main.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository  extends JpaRepository<Project, Long> {

    @Query("select p from Project p where p.user.email = :email")
    List<Project> findByUserEmail(String email);

}