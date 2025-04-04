package com.projectmanage.main.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.projectmanage.main.model.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

  @Query("select p from Project p where p.user.email = :email")
  List<Project> findByUserEmail(@Param("email") String email);

  boolean existsByTitle(String title);
}
