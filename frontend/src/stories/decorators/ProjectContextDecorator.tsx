import React from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { Project, Task, Milestone } from '../../types/project';

const mockProject: Project = {
  id: 1,
  title: 'Mock Project',
  description: 'Mock Description',
  milestones: [],
  tasks: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTask: Task = {
  id: 1,
  title: 'Mock Task',
  description: 'Mock Description',
  completed: false,
  projectId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockMilestone: Milestone = {
  id: 1,
  title: 'Mock Milestone',
  description: 'Mock Description',
  projectId: 1,
  completed: false,
  tasks: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProjectContext = {
  projects: [] as Project[],
  milestones: [] as Milestone[],
  tasks: [] as Task[],
  loading: false,
  error: null,
  selectedProject: null as Project | null,
  addProject: async () => mockProject,
  updateProject: async () => {},
  deleteProject: async () => {},
  addTask: async () => mockTask,
  updateTask: async () => {},
  deleteTask: async () => {},
  addMilestone: async () => mockMilestone,
  updateMilestone: async () => {},
  deleteMilestone: async () => {},
};

// Wrapper component to provide proper modal context
const ModalWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative min-h-[600px] min-w-[600px] bg-gray-100">{children}</div>
);

export const ProjectContextDecorator = (Story: React.ComponentType) => (
  <ProjectContext.Provider value={mockProjectContext}>
    <ModalWrapper>
      <Story />
    </ModalWrapper>
  </ProjectContext.Provider>
);
