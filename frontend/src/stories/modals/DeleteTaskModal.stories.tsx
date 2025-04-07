import type { Meta, StoryObj } from '@storybook/react';
import DeleteTaskModal from '../../components/modals/DeleteTaskModal';
import { ProjectContext, ProjectContextType } from '../../context/ProjectContext';
import React from 'react';
import { Project, Milestone, Task } from '../../types/project';

// Create enhanced decorator with custom project and task data
const CustomProjectContextDecorator = (Story: React.ComponentType) => {
  const mockTask: Task = {
    id: 789,
    title: 'Test Task',
    description: 'This is a test task for the delete modal',
    completed: false,
    projectId: 123,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMilestone: Milestone = {
    id: 456,
    title: 'Test Milestone',
    description: 'This is a test milestone',
    completed: false,
    projectId: 123,
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProject: Project = {
    id: 123,
    name: 'Test Project',
    title: 'Test Project',
    description: 'This is a test project for the delete modal',
    milestones: [mockMilestone],
    tasks: [mockTask],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Create context with our test project and task
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

// Create decorator with milestone task
const MilestoneTaskDecorator = (Story: React.ComponentType) => {
  const mockTask: Task = {
    id: 789,
    title: 'Milestone Task',
    description: 'This is a task associated with a milestone',
    completed: false,
    projectId: 123,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMilestone: Milestone = {
    id: 456,
    title: 'Test Milestone',
    description: 'This is a test milestone',
    completed: false,
    projectId: 123,
    tasks: [mockTask],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProject: Project = {
    id: 123,
    name: 'Test Project',
    title: 'Test Project',
    description: 'This is a test project',
    milestones: [mockMilestone],
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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
  const mockTask: Task = {
    id: 789,
    title: 'Test Task',
    description: 'This is a test task for the delete modal',
    completed: false,
    projectId: 123,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProject: Project = {
    id: 123,
    name: 'Test Project',
    title: 'Test Project',
    description: 'This is a test project for the delete modal',
    milestones: [],
    tasks: [mockTask],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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
    deleteTask: async () => {
      // simulate a long-running operation
      await new Promise((resolve) => setTimeout(resolve, 3000));
    },
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
  const mockTask: Task = {
    id: 789,
    title: 'Test Task',
    description: 'This is a test task for the delete modal',
    completed: false,
    projectId: 123,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProject: Project = {
    id: 123,
    name: 'Test Project',
    title: 'Test Project',
    description: 'This is a test project for the delete modal',
    milestones: [],
    tasks: [mockTask],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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
    deleteTask: async () => {
      throw new Error('Failed to delete task');
    },
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
  title: 'Modals/DeleteTaskModal',
  component: DeleteTaskModal,
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
          'A modal component for confirming task deletion. Requires user to type the task name to confirm deletion.',
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
      description: 'ID of the project that contains the task',
    },
    taskId: {
      control: 'number',
      description: 'ID of the task to delete',
    },
    onClose: {
      action: 'closed',
      description: 'Function called when the modal is closed',
    },
    onTaskDeleted: {
      action: 'deleted',
      description: 'Function called when the task is successfully deleted',
    },
  },
} satisfies Meta<typeof DeleteTaskModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    projectId: 123,
    taskId: 789,
    onClose: () => console.log('Modal closed'),
    onTaskDeleted: () => console.log('Task deleted'),
  },
  decorators: [CustomProjectContextDecorator],
  parameters: {
    docs: {
      description: {
        story: 'Default state of the delete task modal.',
      },
    },
  },
};

export const MilestoneTask: Story = {
  args: {
    projectId: 123,
    taskId: 789,
    onClose: () => console.log('Modal closed'),
    onTaskDeleted: () => console.log('Task deleted'),
  },
  decorators: [MilestoneTaskDecorator],
  parameters: {
    docs: {
      description: {
        story: 'Deleting a task that belongs to a milestone.',
      },
    },
  },
};

export const TaskNotFound: Story = {
  args: {
    projectId: 123,
    taskId: 999, // ID that doesn't exist in our mock data
    onClose: () => console.log('Modal closed'),
    onTaskDeleted: () => console.log('Task deleted'),
  },
  decorators: [CustomProjectContextDecorator],
  parameters: {
    docs: {
      description: {
        story: 'State when the task to delete is not found.',
      },
    },
  },
};

export const ProjectNotFound: Story = {
  args: {
    projectId: 999, // Project ID that doesn't exist in our mock data
    taskId: 789,
    onClose: () => console.log('Modal closed'),
    onTaskDeleted: () => console.log('Task deleted'),
  },
  decorators: [CustomProjectContextDecorator],
  parameters: {
    docs: {
      description: {
        story: 'State when the project containing the task is not found.',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    projectId: 123,
    taskId: 789,
    onClose: () => console.log('Modal closed'),
    onTaskDeleted: () => console.log('Task deleted'),
  },
  decorators: [LoadingStateDecorator],
  parameters: {
    docs: {
      description: {
        story: 'Loading state during deletion of the task.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Find the input field and type the task name
    const canvas = canvasElement.querySelector('input');
    if (canvas) {
      canvas.value = 'Test Task';
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
    taskId: 789,
    onClose: () => console.log('Modal closed'),
    onTaskDeleted: () => console.log('Task deleted'),
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
    // Find the input field and type the task name
    const canvas = canvasElement.querySelector('input');
    if (canvas) {
      canvas.value = 'Test Task';
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
