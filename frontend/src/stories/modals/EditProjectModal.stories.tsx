import type { Meta, StoryObj } from '@storybook/react';
import EditProjectModal from '../../components/modals/EditProjectModal';
import { ProjectContextDecorator } from '../decorators/ProjectContextDecorator';

const meta = {
  title: 'Modals/EditProjectModal',
  component: EditProjectModal,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
    docs: {
      description: {
        component:
          'A modal component for editing project details. Allows users to modify the project title and description.',
      },
      source: {
        type: 'code',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [ProjectContextDecorator],
  argTypes: {
    project: {
      control: 'object',
      description: 'Project object containing the details to be edited',
      table: {
        type: {
          summary: 'Project',
          detail:
            '{ id: number; title: string; description?: string; milestones: Milestone[]; tasks: Task[]; createdAt: Date; updatedAt: Date; }',
        },
      },
    },
    onClose: {
      action: 'closed',
      description: 'Callback function called when the modal is closed',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
} satisfies Meta<typeof EditProjectModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockProject = {
  id: 1,
  title: 'Example Project',
  description: 'This is an example project description',
  milestones: [],
  tasks: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const Default: Story = {
  args: {
    project: mockProject,
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state of the edit project modal with both title and description.',
      },
    },
  },
};

export const WithoutDescription: Story = {
  args: {
    project: {
      ...mockProject,
      description: undefined,
    },
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Edit project modal state when the project has no description.',
      },
    },
  },
};
