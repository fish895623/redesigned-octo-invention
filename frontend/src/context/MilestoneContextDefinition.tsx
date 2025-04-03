import { createContext, useContext } from 'react';
import { Project, Milestone, Task } from '../types/project';

export interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'milestones' | 'tasks'>) => Promise<Project>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  addMilestone: (
    projectId: string,
    milestone: Omit<Milestone, 'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'tasks'>,
  ) => Promise<Milestone>;
  updateMilestone: (milestone: Milestone) => Promise<void>;
  deleteMilestone: (projectId: string, milestoneId: string) => Promise<void>;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (projectId: string, taskId: string) => Promise<void>;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
