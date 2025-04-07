import type { Meta, StoryObj } from '@storybook/react';
import CreateProjectModal from '../../components/modals/CreateProjectModal';
import { ProjectContextDecorator } from '../decorators/ProjectContextDecorator';
import { within, userEvent } from '@storybook/testing-library';

const meta = {
  title: 'Modals/CreateProjectModal',
  component: CreateProjectModal,
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
          'A modal component for creating new projects. Features a dark theme, validation, and error handling. Allows users to specify project title and description.',
      },
      source: {
        type: 'code',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [ProjectContextDecorator],
  argTypes: {
    onClose: {
      action: 'closed',
      description: 'Callback function called when the modal is closed',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
} satisfies Meta<typeof CreateProjectModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state of the create project modal.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitButton = canvas.getByTestId('submit-create-project');
    await userEvent.click(submitButton);
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal showing validation error when submitting without a title.',
      },
    },
  },
};

export const FillingForm: Story = {
  args: {
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const titleInput = canvas.getByTestId('create-project-title');
    const descriptionInput = canvas.getByTestId('create-project-description');

    await userEvent.type(titleInput, 'Sample Project', { delay: 100 });
    await userEvent.type(descriptionInput, 'This is a sample project description that demonstrates form interaction.', {
      delay: 50,
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of filling out the form fields.',
      },
    },
  },
};

export const WithPrefilledData: Story = {
  args: {
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const titleInput = canvas.getByTestId('create-project-title');
    const descriptionInput = canvas.getByTestId('create-project-description');

    await userEvent.type(titleInput, 'Sample Project');
    await userEvent.type(
      descriptionInput,
      'This is a sample project description that demonstrates how pre-filled data appears in the form.',
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with pre-filled title and description fields.',
      },
    },
  },
};

export const WithLongContent: Story = {
  args: {
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const titleInput = canvas.getByTestId('create-project-title');
    const descriptionInput = canvas.getByTestId('create-project-description');

    await userEvent.type(titleInput, 'Project with Very Long Title That Might Need Wrapping');
    await userEvent.type(
      descriptionInput,
      `This is a very long project description that demonstrates how the modal handles large amounts of text content. It includes multiple paragraphs and longer content to show text wrapping and scrolling behavior.

      Features of this project:
      • Responsive design
      • Dark theme
      • Error handling
      • Form validation
      • Accessibility features
      
      The modal should properly contain this content while maintaining its usability and visual appeal.`,
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with long-form content to demonstrate text wrapping and scrolling behavior.',
      },
    },
  },
};
