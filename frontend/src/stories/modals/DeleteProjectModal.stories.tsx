import type { Meta, StoryObj } from '@storybook/react';
import DeleteProjectModal from '../../components/modals/DeleteProjectModal';
import { ProjectContextDecorator } from '../decorators/ProjectContextDecorator';
import { ProjectContext, ProjectContextType } from '../../context/ProjectContext';
import React from 'react';
import { Project } from '../../types/project';

// Create enhanced decorator with custom project data
const CustomProjectContextDecorator = (Story: React.ComponentType) => {
  const mockProject: Project = {
    id: 123,
    name: 'Test Project',
    title: 'Test Project',
    description: 'This is a test project for the delete modal',
    milestones: [],
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Create context with our test project
  const customContext: ProjectContextType = {
    projects: [mockProject],
    milestones: [],
    tasks: [],
    loading: false,
    error: null,
    addProject: async () => mockProject,
    updateProject: async () => {},
    deleteProject: async () => {},
    addTask: async (projectId, task) => ({ id: 1, projectId, ...task } as any),
    updateTask: async () => {},
    deleteTask: async () => {},
    addMilestone: async (projectId, milestone) => ({ id: 1, projectId, ...milestone } as any),
    updateMilestone: async () => {},
    deleteMilestone: async () => {},
  };

  // Wrapper component to provide proper modal context
  const ModalWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="relative min-h-[600px] min-w-[600px] bg-gray-900">{children}</div>
  );

  return (
    <ProjectContext.Provider value={customContext}>
      <ModalWrapper>
        <Story />
      </ModalWrapper>
    </ProjectContext.Provider>
  );
};

// Loading state decorator
const LoadingStateDecorator = (Story: React.ComponentType) => {
  const customContext: ProjectContextType = {
    projects: [],
    milestones: [],
    tasks: [],
    loading: true,
    error: null,
    addProject: async () => ({ id: 1 } as any),
    updateProject: async () => {},
    deleteProject: async () => {
      // simulate a long-running operation
      await new Promise((resolve) => setTimeout(resolve, 3000));
    },
    addTask: async (projectId, task) => ({ id: 1, projectId, ...task } as any),
    updateTask: async () => {},
    deleteTask: async () => {},
    addMilestone: async (projectId, milestone) => ({ id: 1, projectId, ...milestone } as any),
    updateMilestone: async () => {},
    deleteMilestone: async () => {},
  };

  const ModalWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="relative min-h-[600px] min-w-[600px] bg-gray-900">{children}</div>
  );

  return (
    <ProjectContext.Provider value={customContext}>
      <ModalWrapper>
        <Story />
      </ModalWrapper>
    </ProjectContext.Provider>
  );
};

// Error state decorator
const ErrorStateDecorator = (Story: React.ComponentType) => {
  const mockProject: Project = {
    id: 123,
    name: 'Test Project',
    title: 'Test Project',
    description: 'This is a test project for the delete modal',
    milestones: [],
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const customContext: ProjectContextType = {
    projects: [mockProject],
    milestones: [],
    tasks: [],
    loading: false,
    error: 'Failed to load project data',
    addProject: async () => ({ id: 1 } as any),
    updateProject: async () => {},
    deleteProject: async () => {
      throw new Error('Failed to delete project');
    },
    addTask: async (projectId, task) => ({ id: 1, projectId, ...task } as any),
    updateTask: async () => {},
    deleteTask: async () => {},
    addMilestone: async (projectId, milestone) => ({ id: 1, projectId, ...milestone } as any),
    updateMilestone: async () => {},
    deleteMilestone: async () => {},
  };

  const ModalWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="relative min-h-[600px] min-w-[600px] bg-gray-900">{children}</div>
  );

  return (
    <ProjectContext.Provider value={customContext}>
      <ModalWrapper>
        <Story />
      </ModalWrapper>
    </ProjectContext.Provider>
  );
};

const meta = {
  title: 'Modals/DeleteProjectModal',
  component: DeleteProjectModal,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1a1a1a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    docs: {
      description: {
        component:
          'A modal component for confirming project deletion. Requires user to type the project name to confirm deletion.',
      },
      source: {
        type: 'code',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    projectId: {
      control: 'number',
      description: 'ID of the project to delete',
    },
    onClose: {
      action: 'closed',
      description: 'Function called when the modal is closed',
    },
    onProjectDeleted: {
      action: 'deleted',
      description: 'Function called when the project is successfully deleted',
    },
  },
} satisfies Meta<typeof DeleteProjectModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    projectId: 123,
    onClose: () => console.log('Modal closed'),
    onProjectDeleted: () => console.log('Project deleted'),
  },
  decorators: [CustomProjectContextDecorator],
  parameters: {
    docs: {
      description: {
        story: 'Default state of the delete project modal.',
      },
    },
  },
};

export const ProjectNotFound: Story = {
  args: {
    projectId: 999, // ID that doesn't exist in our mock data
    onClose: () => console.log('Modal closed'),
    onProjectDeleted: () => console.log('Project deleted'),
  },
  decorators: [CustomProjectContextDecorator],
  parameters: {
    docs: {
      description: {
        story: 'State when the project to delete is not found.',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    projectId: 123,
    onClose: () => console.log('Modal closed'),
    onProjectDeleted: () => console.log('Project deleted'),
  },
  decorators: [LoadingStateDecorator],
  parameters: {
    docs: {
      description: {
        story: 'Loading state during deletion of the project.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Find the input field and type the project name
    const canvas = canvasElement.querySelector('input');
    if (canvas) {
      canvas.value = 'Test Project';
      canvas.dispatchEvent(new Event('input', { bubbles: true }));
      canvas.dispatchEvent(new Event('change', { bubbles: true }));

      // Find and click the delete button
      const deleteButton = canvasElement.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (deleteButton) {
        deleteButton.click();
      }
    }
  },
};

export const ErrorState: Story = {
  args: {
    projectId: 123,
    onClose: () => console.log('Modal closed'),
    onProjectDeleted: () => console.log('Project deleted'),
  },
  decorators: [ErrorStateDecorator],
  parameters: {
    docs: {
      description: {
        story: 'Error state when deletion fails.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Find the input field and type the project name
    const canvas = canvasElement.querySelector('input');
    if (canvas) {
      canvas.value = 'Test Project';
      canvas.dispatchEvent(new Event('input', { bubbles: true }));
      canvas.dispatchEvent(new Event('change', { bubbles: true }));

      // Find and click the delete button
      const deleteButton = canvasElement.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (deleteButton) {
        deleteButton.click();
      }
    }
  },
};
