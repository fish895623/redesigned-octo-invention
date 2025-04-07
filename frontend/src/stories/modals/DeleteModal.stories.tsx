import type { Meta, StoryObj } from '@storybook/react';
import DeleteModal from '../../components/modals/DeleteModal';
import { ProjectContextDecorator } from '../decorators/ProjectContextDecorator';

const meta = {
  title: 'Modals/DeleteModal',
  component: DeleteModal,
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
          'A modal component for confirming deletion operations. Provides warning and confirmation steps before proceeding with deletion.',
      },
      source: {
        type: 'code',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [ProjectContextDecorator],
  argTypes: {
    name: {
      control: 'text',
    },
  },
} satisfies Meta<typeof DeleteModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Project',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state of the delete modal.',
      },
    },
  },
};
