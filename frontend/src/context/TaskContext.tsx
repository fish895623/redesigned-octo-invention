import { useState, useEffect, ReactNode } from 'react';
import { Project, Milestone, Task } from '../types/project';
import { API_ENDPOINTS } from '../config/api';
import { apiClient } from '../api/apiClient';
import { useAuth } from './AuthContextDefinition';
import { ProjectContext } from './ProjectContext';

interface ProjectProviderProps {
  children: ReactNode;
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch projects only when authenticated
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.authenticated) return;

      try {
        setLoading(true);
        const response = await apiClient.get<Project[]>(API_ENDPOINTS.projects.list);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user?.authenticated]);

  const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'milestones' | 'tasks'>) => {
    try {
      const response = await apiClient.post<Project>(API_ENDPOINTS.projects.create, project);
      setProjects((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project');
      throw error;
    }
  };

  const updateProject = async (updatedProject: Project) => {
    try {
      await apiClient.put<Project>(`${API_ENDPOINTS.projects.update}/${updatedProject.id}`, updatedProject);
      setProjects(projects.map((project) => (project.id === updatedProject.id ? updatedProject : project)));
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project');
      throw error;
    }
  };

  const deleteProject = async (projectId: number) => {
    try {
      await apiClient.delete(`${API_ENDPOINTS.projects.delete}/${projectId}`);
      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project');
      throw error;
    }
  };

  const addMilestone = async (
    projectId: number,
    milestone: Omit<Milestone, 'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'tasks'>,
  ) => {
    try {
      const response = await apiClient.post<Milestone>(`${API_ENDPOINTS.milestones.create}/${projectId}`, milestone);
      setProjects(
        projects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              milestones: [...project.milestones, response.data],
            };
          }
          return project;
        }),
      );
      return response.data;
    } catch (error) {
      console.error('Error creating milestone:', error);
      setError('Failed to create milestone');
      throw error;
    }
  };

  const updateMilestone = async (updatedMilestone: Milestone) => {
    try {
      await apiClient.put<Milestone>(
        `${API_ENDPOINTS.milestones.update}/${updatedMilestone.projectId}/${updatedMilestone.id}`,
        updatedMilestone,
      );
      setProjects(
        projects.map((project) => {
          if (project.id === updatedMilestone.projectId) {
            return {
              ...project,
              milestones: project.milestones.map((milestone) =>
                milestone.id === updatedMilestone.id ? updatedMilestone : milestone,
              ),
            };
          }
          return project;
        }),
      );
    } catch (error) {
      console.error('Error updating milestone:', error);
      setError('Failed to update milestone');
      throw error;
    }
  };

  const deleteMilestone = async (projectId: number, milestoneId: number) => {
    try {
      await apiClient.delete(`${API_ENDPOINTS.milestones.delete}/${projectId}/${milestoneId}`);
      setProjects(
        projects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              milestones: project.milestones.filter((milestone) => milestone.id !== milestoneId),
            };
          }
          return project;
        }),
      );
    } catch (error) {
      console.error('Error deleting milestone:', error);
      setError('Failed to delete milestone');
      throw error;
    }
  };

  const addTask = async (projectId: number, task: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await apiClient.post<Task>(`${API_ENDPOINTS.tasks.create}/${projectId}`, task);
      setProjects(
        projects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              tasks: [...project.tasks, response.data],
            };
          }
          return project;
        }),
      );
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task');
      throw error;
    }
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      await apiClient.put<Task>(
        `${API_ENDPOINTS.tasks.update}/${updatedTask.projectId}/${updatedTask.id}`,
        updatedTask,
      );
      setProjects(
        projects.map((project) => {
          if (project.id === updatedTask.projectId) {
            return {
              ...project,
              tasks: project.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
            };
          }
          return project;
        }),
      );
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
      throw error;
    }
  };

  const deleteTask = async (projectId: number, taskId: number) => {
    try {
      await apiClient.delete(`${API_ENDPOINTS.tasks.delete}/${projectId}/${taskId}`);
      setProjects(
        projects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
            };
          }
          return project;
        }),
      );
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
      throw error;
    }
  };

  // Calculate milestones and tasks from all projects
  const milestones = projects.flatMap((project) => project.milestones);
  const tasks = projects.flatMap((project) => project.tasks);

  const value = {
    projects,
    milestones,
    tasks,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    addTask,
    updateTask,
    deleteTask,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}
