import type { Meta, StoryObj } from '@storybook/react';
import EditProjectModal from '../../components/modals/EditProjectModal';
import { ProjectContextDecorator } from '../decorators/ProjectContextDecorator';
import { within, userEvent } from '@storybook/testing-library';

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

export const ValidationError: Story = {
  args: {
    project: mockProject,
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const titleInput = canvas.getByPlaceholderText('Enter project title');

    // Clear the title field
    await userEvent.clear(titleInput);

    // Try to submit the form
    const submitButton = canvas.getByText('Save Changes');
    await userEvent.click(submitButton);
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows validation error when trying to submit with an empty title.',
      },
    },
  },
};

export const EditingTitle: Story = {
  args: {
    project: mockProject,
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const titleInput = canvas.getByPlaceholderText('Enter project title');

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Updated Project Title', { delay: 100 });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates editing the project title.',
      },
    },
  },
};

export const EditingDescription: Story = {
  args: {
    project: mockProject,
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const descriptionInput = canvas.getByPlaceholderText('Enter project description (optional)');

    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, 'This is an updated project description with new details.', { delay: 50 });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates editing the project description.',
      },
    },
  },
};

export const WithLongContent: Story = {
  args: {
    project: {
      ...mockProject,
      title: 'Project with a Very Long Title That Demonstrates Text Wrapping Behavior in the Modal Header',
      description: `This is a very detailed project description that demonstrates how the modal handles large amounts of text content. 
      
      Key Features:
      • Responsive design implementation
      • Dark theme support
      • Comprehensive error handling
      • Form validation
      • Accessibility features
      • Performance optimizations
      • Cross-browser compatibility
      
      The modal should properly contain and display this content while maintaining its usability and visual appeal. This helps verify that the layout remains stable with varying content lengths.`,
    },
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the modal handles long title and description content.',
      },
    },
  },
};
