import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Sidebar } from '../ui/Sidebar';
import { Box } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Groups as TeamsIcon,
  Person as CreatorIcon,
  Lock as SuperLockedIcon,
  Settings as SettingsIcon,
  Link as ReferredIcon,
} from '@mui/icons-material';

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Navigation/Sidebar',
  component: Sidebar,
  parameters: {
    docs: {
      description: {
        component:
          'A professional sidebar component with agency variant featuring navigation items, company logo, and active states.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'agency'],
      description: 'The variant of the sidebar',
    },
    items: {
      control: false,
      description: 'Array of sidebar navigation items',
    },
    companyLogo: {
      control: { type: 'text' },
      description: 'Company logo image source',
    },
    companyName: {
      control: { type: 'text' },
      description: 'Company name for the bottom logo area',
    },
    onItemClick: {
      action: 'itemClicked',
      description: 'Callback when an item is clicked',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

// Default sidebar items for stories
const defaultItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    active: true,
  },
  {
    id: 'teams',
    label: 'Teams',
    icon: <TeamsIcon />,
  },
  {
    id: 'creators',
    label: 'Creators',
    icon: <CreatorIcon />,
  },
  {
    id: 'superlocked',
    label: 'SuperLocked',
    icon: <SuperLockedIcon />,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
  },
  {
    id: 'referred',
    label: 'Referred',
    icon: <ReferredIcon />,
  },
];

export const Agency: Story = {
  args: {
    variant: 'agency',
    items: defaultItems,
    companyLogo: '/SuperLinkLogo.png',
    companyLogoAlt: 'SuperLink Logo',
    companyName: 'SuperLink',
    companyLogoIcon: '/SuperLinkLogo.png',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The agency variant sidebar with specific dimensions (218px width, 845px height) and professional styling.',
      },
    },
  },
};

export const Default: Story = {
  args: {
    variant: 'default',
    items: defaultItems,
    companyLogo: '/SuperLinkLogo.png',
    companyLogoAlt: 'SuperLink Logo',
    companyName: 'SuperLink',
    companyLogoIcon: '/SuperLinkLogo.png',
  },
  render: (args) => (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      <Sidebar {...args} />
      <Box sx={{ flex: 1, padding: 'var(--padding-lg)', backgroundColor: 'var(--color-background-paper)' }}>
        <h3>Default Sidebar Example</h3>
        <p>This sidebar has the default variant with responsive width and full height.</p>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The default variant sidebar with responsive dimensions and standard styling.',
      },
    },
  },
};

export const WithoutLogo: Story = {
  args: {
    variant: 'agency',
    items: defaultItems,
    companyName: 'SuperLink',
    companyLogoIcon: '/SuperLinkLogo.png',
  },
  render: (args) => (
    <Box sx={{ height: '845px', display: 'flex' }}>
      <Sidebar {...args} />
      <Box sx={{ flex: 1, padding: 'var(--padding-lg)', backgroundColor: 'var(--color-background-paper)' }}>
        <h3>Sidebar Without Top Logo</h3>
        <p>This sidebar doesn't have a top company logo, only the bottom company branding.</p>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Agency sidebar variant without the top company logo area.',
      },
    },
  },
};

export const MinimalItems: Story = {
  args: {
    variant: 'agency',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <DashboardIcon />,
        active: true,
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <SettingsIcon />,
      },
    ],
    companyName: 'SuperLink',
    companyLogoIcon: '/SuperLinkLogo.png',
  },
  render: (args) => (
    <Box sx={{ height: '845px', display: 'flex' }}>
      <Sidebar {...args} />
      <Box sx={{ flex: 1, padding: 'var(--padding-lg)', backgroundColor: 'var(--color-background-paper)' }}>
        <h3>Minimal Sidebar</h3>
        <p>This sidebar has only essential navigation items.</p>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Agency sidebar with minimal navigation items for simpler interfaces.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    variant: 'agency',
    items: defaultItems,
    companyLogo: '/SuperLinkLogo.png',
    companyLogoAlt: 'SuperLink Logo',
    companyName: 'SuperLink',
    companyLogoIcon: '/SuperLinkLogo.png',
  },
  render: (args) => {
    const [activeItem, setActiveItem] = React.useState('dashboard');
    
    const handleItemClick = (item: any) => {
      setActiveItem(item.id);
    };

    const itemsWithActiveState = args.items?.map(item => ({
      ...item,
      active: activeItem === item.id,
    }));

    return (
      <Box sx={{ height: '845px', display: 'flex' }}>
        <Sidebar 
          {...args} 
          items={itemsWithActiveState}
          onItemClick={handleItemClick}
        />
        <Box sx={{ flex: 1, padding: 'var(--padding-lg)', backgroundColor: 'var(--color-background-paper)' }}>
          <h3>Interactive Sidebar</h3>
          <p>Click on navigation items to see the active state change.</p>
          <p>Currently active: <strong>{activeItem}</strong></p>
        </Box>
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive sidebar demonstrating active state changes when clicking navigation items.',
      },
    },
  },
};
