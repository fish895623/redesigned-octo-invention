package com.projectmanage.main.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  private String description;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<Milestone> milestones = new ArrayList<>();

  @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<Task> tasks = new ArrayList<>();

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }

  // Helper methods to maintain bidirectional relationship
  public void addMilestone(Milestone milestone) {
    milestones.add(milestone);
    milestone.setProject(this);
  }

  public void removeMilestone(Milestone milestone) {
    milestones.remove(milestone);
    milestone.setProject(null);
  }

  public void addTask(Task task) {
    tasks.add(task);
    task.setProject(this);
  }

  public void removeTask(Task task) {
    tasks.remove(task);
    task.setProject(null);
  }
}
