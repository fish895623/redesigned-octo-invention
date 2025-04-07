import type { Meta, StoryObj } from '@storybook/react';
import LoginModal from '../../components/modals/LoginModal';

const meta = {
  title: 'Modals/LoginModal',
  component: LoginModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoginModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
