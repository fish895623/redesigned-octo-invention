import type { Meta, StoryObj } from '@storybook/react';
import EditMilestoneModal from '../../components/modals/EditMilestoneModal';
import { ProjectContextDecorator } from '../decorators/ProjectContextDecorator';

const meta = {
  title: 'Modals/EditMilestoneModal',
  component: EditMilestoneModal,
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
    milestone: {
      control: 'object',
      description: 'Milestone object containing the details to be edited',
      table: {
        type: {
          summary: 'Milestone',
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
} satisfies Meta<typeof EditMilestoneModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockMilestone = {
  id: 1,
  title: 'Example Milestone',
  description: 'This is an example milestone description',
  projectId: 1,
  completed: false,
  tasks: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const Default: Story = {
  args: {
    milestone: mockMilestone,
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
    milestone: {
      ...mockMilestone,
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
