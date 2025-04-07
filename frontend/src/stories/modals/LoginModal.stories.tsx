import type { Meta, StoryObj } from '@storybook/react';
import LoginModal from '../../components/modals/LoginModal';

const meta = {
  title: 'Modals/LoginModal',
  component: LoginModal,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean', defaultValue: true },
    onClose: { action: 'closed' },
    onLogin: { action: 'logged in' },
    error: { control: 'text' },
    isLoading: { control: 'boolean' },
  },
} satisfies Meta<typeof LoginModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onLogin: (email: string, password: string, rememberMe: boolean) => {
      console.log({ email, password, rememberMe });
    },
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: 'Invalid username or password',
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};
