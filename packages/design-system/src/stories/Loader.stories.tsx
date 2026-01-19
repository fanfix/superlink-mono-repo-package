import type { Meta, StoryObj } from '@storybook/react';
import { Loader } from '../ui/Loader';
import { Box } from '@mui/material';

const meta: Meta<typeof Loader> = {
  title: 'Components/Feedback/Loader',
  component: Loader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'number', min: 20, max: 100, step: 5 },
      description: 'Size of the loader in pixels',
    },
    color: {
      control: 'select',
      options: ['black', 'white', 'primary', 'secondary', 'inherit'],
      description: 'Color of the loader',
    },
    visible: {
      control: 'boolean',
      description: 'Whether to show the loader',
    },
    thickness: {
      control: { type: 'number', min: 1, max: 10, step: 0.5 },
      description: 'Thickness of the loader circle',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Default: Story = {
  args: {
    size: 40,
    color: 'black',
    visible: true,
    thickness: 4,
  },
};

export const Small: Story = {
  args: {
    size: 24,
    color: 'black',
    visible: true,
    thickness: 3,
  },
};

export const Large: Story = {
  args: {
    size: 60,
    color: 'black',
    visible: true,
    thickness: 5,
  },
};

export const White: Story = {
  args: {
    size: 40,
    color: 'white',
    visible: true,
    thickness: 4,
  },
  decorators: [
    (Story) => (
      <Box sx={{ backgroundColor: '#000', padding: 4, borderRadius: 2 }}>
        <Story />
      </Box>
    ),
  ],
};

export const Primary: Story = {
  args: {
    size: 40,
    color: 'primary',
    visible: true,
    thickness: 4,
  },
};

export const Secondary: Story = {
  args: {
    size: 40,
    color: 'secondary',
    visible: true,
    thickness: 4,
  },
};

export const CustomThickness: Story = {
  args: {
    size: 40,
    color: 'black',
    visible: true,
    thickness: 6,
  },
};

export const Hidden: Story = {
  args: {
    size: 40,
    color: 'black',
    visible: false,
    thickness: 4,
  },
};

