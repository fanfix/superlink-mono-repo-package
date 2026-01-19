import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Navbar } from '../ui/Navbar';
import { Box } from '@mui/material';

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navigation/Navbar',
  component: Navbar,
  parameters: {
    docs: {
      description: {
        component:
          'A professional navbar component with superlink variant featuring hamburger menu, company logo, and retry functionality.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'superlink'],
      description: 'The variant of the navbar',
    },
    companyLogoIcon: {
      control: { type: 'text' },
      description: 'Company logo icon source',
    },
    companyLogoAlt: {
      control: { type: 'text' },
      description: 'Company logo icon alt text',
    },
    onMenuClick: {
      action: 'menuClicked',
      description: 'Hamburger menu click handler',
    },
    onRetryClick: {
      action: 'retryClicked',
      description: 'Retry/refresh click handler',
    },
    isMobile: {
      control: { type: 'boolean' },
      description: 'Whether the navbar is in mobile view',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Navbar>;

export const SuperlinkDesktop: Story = {
  args: {
    variant: 'superlink',
    companyLogoIcon: '/public/navbar_icon.png',
    companyLogoAlt: 'SuperLink Logo',
    isMobile: false,
  },
  render: (args) => (
    <Box sx={{ backgroundColor: '#f5f5f5', padding: 'var(--padding-lg)' }}>
      <Navbar {...args} />
      <Box sx={{ padding: 'var(--padding-lg)', backgroundColor: 'var(--color-white)', marginTop: 'var(--padding-lg)' }}>
        <h3>Superlink Desktop Navbar</h3>
        <p>This navbar has the superlink variant with 1440px width and 67px height for desktop.</p>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The superlink variant navbar with specific dimensions (1440px width, 67px height) for desktop screens.',
      },
    },
  },
};

export const SuperlinkMobile: Story = {
  args: {
    variant: 'superlink',
    companyLogoIcon: '/public/navbar_icon.png',
    companyLogoAlt: 'SuperLink Logo',
    isMobile: true,
  },
  render: (args) => (
    <Box sx={{ backgroundColor: '#f5f5f5', padding: 'var(--padding-lg)' }}>
      <Navbar {...args} />
      {/* <Box sx={{ padding: 'var(--padding-lg)', backgroundColor: 'var(--color-white)', marginTop: 'var(--padding-lg)' }}>
        <h3>Superlink Mobile Navbar</h3>
        <p>This navbar has the superlink variant with 375px width and 67px height for mobile screens.</p>
      </Box> */}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The superlink variant navbar with responsive dimensions (375px width, 67px height) for mobile screens.',
      },
    },
  },
};

