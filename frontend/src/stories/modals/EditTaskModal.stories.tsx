import type { Meta, StoryObj } from '@storybook/react';
import EditTaskModal from '../../components/modals/EditTaskModal';
import { ProjectContextDecorator } from '../decorators/ProjectContextDecorator';

const meta = {
  title: 'Modals/EditTaskModal',
  component: EditTaskModal,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  decorators: [ProjectContextDecorator],
  argTypes: {
    task: { control: 'object' },
    projectId: { control: 'number' },
    milestones: { control: 'object' },
    onClose: { action: 'closed' },
    onTaskEdited: { action: 'task edited' },
  },
} satisfies Meta<typeof EditTaskModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockTask = {
  id: 1,
  title: 'Example Task',
  description: 'This is an example task description',
  completed: false,
  projectId: 1,
  milestoneId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockMilestones = [
  {
    id: 1,
    title: 'Sprint 1',
    description: 'First sprint',
    projectId: 1,
    dueDate: new Date('2024-04-30'),
    completed: false,
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: 'Sprint 2',
    description: 'Second sprint',
    projectId: 1,
    dueDate: new Date('2024-05-15'),
    completed: false,
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const Default: Story = {
  args: {
    task: mockTask,
    projectId: 1,
    milestones: mockMilestones,
    onClose: () => {},
    onTaskEdited: () => {},
  },
};

export const CompletedTask: Story = {
  args: {
    ...Default.args,
    task: {
      ...mockTask,
      completed: true,
    },
  },
};

export const NoMilestones: Story = {
  args: {
    ...Default.args,
    milestones: [],
  },
};
