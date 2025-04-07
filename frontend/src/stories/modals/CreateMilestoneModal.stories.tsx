import type { Meta, StoryObj } from '@storybook/react';
import CreateMilestoneModal from '../../components/modals/CreateMilestoneModal';
import { ProjectContextDecorator } from '../decorators/ProjectContextDecorator';

const meta = {
  title: 'Modals/CreateMilestoneModal',
  component: CreateMilestoneModal,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
    docs: {
      description: {
        component:
          'A modal component for creating new milestones. Allows users to specify milestone details including title, description, and optional dates.',
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
      description: 'ID of the project to create the milestone in',
      table: {
        type: { summary: 'number' },
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
} satisfies Meta<typeof CreateMilestoneModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    projectId: 1,
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state of the create milestone modal.',
      },
    },
  },
};
