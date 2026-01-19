import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from '../ui/Typography';

const meta: Meta<typeof Typography> = {
  title: 'Foundation/Typography',
  component: Typography,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A reusable Typography component that supports both MUI variants and custom variants (heading, text).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['heading', 'text', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'caption'],
      description: 'Typography variant',
    },
    children: {
      control: 'text',
      description: 'Text content',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Heading1: Story = {
  args: {
    variant: 'heading-lg',
    children: 'Identity Verification Required',
  },
};

export const Heading2: Story = {
  args: {
    variant: 'heading-md',
    children: 'Sign Up',
  },
};

export const Heading3: Story = {
  args: {
    variant: 'heading-sm',
    children: 'Sign Up',
  },
};
export const Text1: Story = {
  args: {
    variant: 'text-lg',
    children:
      ' Before you begin onboarding, we need to verify your identity for security and compliance purposes',
  },
};
export const Text2: Story = {
  args: {
    variant: 'text-md',
    children: 'Verified User',
  },
};
export const Text3: Story = {
  args: {
    variant: 'text-sm',
    children: 'We securely manage your account information and messages.',
  },
};
