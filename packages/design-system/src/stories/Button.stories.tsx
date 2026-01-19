import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Button } from '../ui/Button';
import { Box, Stack, Typography } from '@mui/material';
import { Icon } from '../ui/Icon';
import DeleteIcon from '@mui/icons-material/Delete';
// Using simple icons for demo purposes - replace with your preferred icon library
const HomeIcon = () => <span>🏠</span>;
const SaveIcon = () => <span>💾</span>;
const DownloadIcon = () => <span>⬇️</span>;

const meta: Meta<typeof Button> = {
  title: 'Components/Buttons/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['contained', 'outlined', 'text', 'primary-dark', 'primary-light', 'blue-text'],
      description: 'The visual style variant of the button (includes custom Figma design variants)',
    },
    color: {
      control: { type: 'select' },
      options: ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'],
      description: 'The color of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'The size of the button',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Show loading spinner and disable the button',
    },
    loadingPosition: {
      control: { type: 'select' },
      options: ['start', 'center', 'end'],
      description: 'Position of the loading indicator',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Whether the button takes full width',
    },
    children: {
      control: { type: 'text' },
      description: 'The content of the button',
    },
  },
  args: {
    children: 'Button',
    variant: 'contained',
    color: 'primary',
    size: 'medium',
    loading: false,
    loadingPosition: 'center',
    disabled: false,
    fullWidth: false,
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

// Individual Custom Variant Stories
export const PrimaryDark1: Story = {
  args: {
    variant: 'primary-dark',
    children: 'Continue',
  },
};

export const PrimaryDark2: Story = {
  args: {
    variant: 'primary-dark-sm',
    children: 'Verify md ID',
  },
};
export const PrimaryLight: Story = {
  args: {
    variant: 'primary-light',
    children: 'Continue',
  },
};

export const PrimaryDanger1: Story = {
  args: {
    variant: 'primary-danger-sm',
    children: 'Delete',
  },
};

export const PrimaryDangerWithIcon: Story = {
  args: {
    variant: 'primary-danger-sm',
    children: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon icon={<DeleteIcon />} size="lg" color="white" />
        Delete
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary danger button with Delete icon using the Icon component.',
      },
    },
  },
};


export const SuccessLight: Story = {
  args: {
    variant: 'success-light-sm',
    children: 'Active',
  },
};

export const DangerLight: Story = {
  args: {
    variant: 'danger-light-sm',
    children: 'Verfiy ID',
  },
};

export const BlueText: Story = {
  args: {
    variant: 'blue-text',
    children: 'Create An Account',
  },
};

export const BlackText: Story = {
  args: {
    variant: 'black-text',
    children: 'Skip to Dashboard',
  },
};

export const Outline1: Story = {
  args: {
    variant: 'outline-sm',
    children: 'Cancel',
  },
};
