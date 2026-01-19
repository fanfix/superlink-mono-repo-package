import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Badge, BadgeCheckIcon } from '../ui/Badge';
import { Box, Stack } from '@mui/material';

const meta: Meta<typeof Badge> = {
  title: 'Components/Buttons/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible Badge component with multiple variants for displaying labels, statuses, and counts.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'The visual style variant of the badge',
    },
    children: {
      control: { type: 'text' },
      description: 'The content of the badge',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
  args: {
    children: 'Badge',
    variant: 'default',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Badge>;

// Default Badge
export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
      <Badge>Badge</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available badge variants displayed together.',
      },
    },
  },
};

// Badge with Icon
export const WithIcon: Story = {
  render: () => (
        <Badge
          variant="secondary"
          sx={{
            backgroundColor: '#3b82f6',
            color: 'white',
          }}
        >
          <BadgeCheckIcon />
          Verified
        </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge with an icon using the BadgeCheckIcon component.',
      },
    },
  },
};

// Number Badges
export const NumberBadges: Story = {
  render: () => (
    <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
      <Badge
        sx={{
          height: 'var(--height-sm-1)',
          minWidth: 'var(--height-sm-1)',
          borderRadius: 'var(--border-radius-full)',
          paddingLeft: 'var(--padding-xs)',
          paddingRight: 'var(--padding-xs)',
          fontFamily: 'monospace',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        8
      </Badge>
      <Badge
        variant="destructive"
        sx={{
          height: 'var(--height-sm-1)',
          minWidth: 'var(--height-sm-1)',
          borderRadius: 'var(--border-radius-full)',
          paddingLeft: 'var(--padding-xs)',
          paddingRight: 'var(--padding-xs)',
          fontFamily: 'monospace',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        99
      </Badge>
      <Badge
        variant="outline"
        sx={{
          height: 'var(--height-sm-1)',
          minWidth: 'var(--height-sm-1)',
          borderRadius: 'var(--border-radius-full)',
          paddingLeft: 'var(--padding-xs)',
          paddingRight: 'var(--padding-xs)',
          fontFamily: 'monospace',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        20+
      </Badge>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges styled as number indicators with monospace font.',
      },
    },
  },
};

// Customizable with sx prop
export const Customizable: Story = {
  render: () => (
    <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
      <Badge
        sx={{
          backgroundColor: 'var(--color-blue-main)',
          color: 'var(--color-white)',
          paddingLeft: 'var(--padding-lg)',
          paddingRight: 'var(--padding-lg)',
          fontSize: 'var(--font-size-md)',
        }}
      >
        Custom Blue
      </Badge>
      <Badge
        variant="outline"
        sx={{
          borderColor: 'var(--color-success-main)',
          color: 'var(--color-success-main)',
          borderWidth: '2px',
          borderRadius: 'var(--border-radius-md)',
        }}
      >
        Custom Outline
      </Badge>
      <Badge
        sx={{
          background: 'linear-gradient(135deg, var(--color-primary-main) 0%, var(--color-blue-main) 100%)',
          color: 'var(--color-white)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        Gradient Badge
      </Badge>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge component is fully customizable through sx prop, allowing you to override any style.',
      },
    },
  },
};

// Badge Demo (matching the provided example)
export const BadgeDemo: Story = {
  render: () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Badge>Badge</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Badge
          variant="secondary"
          sx={{
            backgroundColor: '#3b82f6',
            color: 'white',
          }}
        >
          <BadgeCheckIcon />
          Verified
        </Badge>
        <Badge
          sx={{
            height: 'var(--height-sm-1)',
            minWidth: 'var(--height-sm-1)',
            borderRadius: 'var(--border-radius-full)',
            paddingLeft: 'var(--padding-xs)',
            paddingRight: 'var(--padding-xs)',
            fontFamily: 'monospace',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          8
        </Badge>
        <Badge
          variant="destructive"
          sx={{
            height: 'var(--height-sm-1)',
            minWidth: 'var(--height-sm-1)',
            borderRadius: 'var(--border-radius-full)',
            paddingLeft: 'var(--padding-xs)',
            paddingRight: 'var(--padding-xs)',
            fontFamily: 'monospace',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          99
        </Badge>
        <Badge
          variant="outline"
          sx={{
            height: 'var(--height-sm-1)',
            minWidth: 'var(--height-sm-1)',
            borderRadius: 'var(--border-radius-full)',
            paddingLeft: 'var(--padding-xs)',
            paddingRight: 'var(--padding-xs)',
            fontFamily: 'monospace',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          20+
        </Badge>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete badge demo showcasing all variants and use cases.',
      },
    },
  },
};
