import type { Meta, StoryObj } from '@storybook/react';
import CreateTaskModal from '../../components/modals/CreateTaskModal';
import { ProjectContextDecorator } from '../decorators/ProjectContextDecorator';

const meta = {
  title: 'Modals/CreateTaskModal',
  component: CreateTaskModal,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
    docs: {
      description: {
        component:
          'A modal component for creating new tasks. Allows users to specify task details and optionally assign it to a milestone.',
      },
      source: {
        type: 'code',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [ProjectContextDecorator],
  argTypes: {
    projectId: {
      control: 'number',
      description: 'ID of the project to create the task in',
      table: {
        type: { summary: 'number' },
      },
    },
    milestones: {
      control: 'object',
      description: 'Array of available milestones to assign the task to',
      table: {
        type: { summary: 'Milestone[]' },
      },
    },
    onClose: {
      action: 'closed',
      description: 'Callback function called when the modal is closed',
      table: {
        type: { summary: '() => void' },
      },
    },
    onTaskCreated: {
      action: 'task created',
      description: 'Callback function called when a task is successfully created',
      table: {
        type: { summary: '() => void' },
      },
    },
    selectedMilestoneId: {
      control: 'number',
      description: 'ID of the pre-selected milestone',
      table: {
        type: { summary: 'number | null' },
      },
    },
  },
} satisfies Meta<typeof CreateTaskModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    projectId: 1,
    milestones: [
      {
        id: 1,
        title: 'Sprint 1',
        description: 'First sprint',
        dueDate: new Date('2024-04-30'),
        completed: false,
        projectId: 1,
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'Sprint 2',
        description: 'Second sprint',
        dueDate: new Date('2024-05-15'),
        completed: false,
        projectId: 1,
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    onClose: () => {},
    onTaskCreated: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state of the create task modal with available milestones.',
      },
    },
  },
};

export const WithSelectedMilestone: Story = {
  args: {
    ...Default.args,
    selectedMilestoneId: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'Create task modal with a pre-selected milestone.',
      },
    },
  },
};

export const NoMilestones: Story = {
  args: {
    ...Default.args,
    milestones: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Create task modal when no milestones are available.',
      },
    },
  },
};
