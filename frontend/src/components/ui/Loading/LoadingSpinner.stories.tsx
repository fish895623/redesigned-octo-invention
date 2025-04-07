import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';

const meta = {
  title: 'UI/Loading/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithDarkBackground: Story = {
  args: {},
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const InContainer: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="p-8 bg-gray-800 rounded-lg">
        <Story />
      </div>
    ),
  ],
};
