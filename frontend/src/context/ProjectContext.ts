import { createContext } from 'react';
import { Project, Milestone, Task } from '../types/project';
import { ProjectProvider } from './ProjectContextDefinition';
import { useProject } from './useProject';

export interface ProjectContextType {
  projects: Project[];
  milestones: Milestone[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'milestones' | 'tasks'>) => Promise<Project>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (projectId: number) => Promise<void>;
  addMilestone: (
    projectId: number,
    milestone: Omit<Milestone, 'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'tasks'>,
  ) => Promise<Milestone>;
  updateMilestone: (milestone: Milestone) => Promise<void>;
  deleteMilestone: (projectId: number, milestoneId: number) => Promise<void>;
  addTask: (projectId: number, task: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (projectId: number, taskId: number) => Promise<void>;
}

// Create the context with undefined as default value
export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Re-export the ProjectProvider for easier imports
export { ProjectProvider, useProject };
