import type { Meta, StoryObj } from '@storybook/react';
import { 
  Icon, 
  DownloadIcon,
  DashboardIcon,
  TeamsIcon,
  PersonIcon,
  LockIcon,
  SettingsIcon,
  LinkIcon,
  AddIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  CalendarTodayIcon,
  ExportIcon,
  ViewIcon,
  DeleteIcon,
  MaterialIcons
} from '../ui/Icon';

const meta: Meta<typeof Icon> = {
  title: 'Foundation/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible Icon component that wraps MUI Icons with customizable sizing, colors, and styling options.',
      },
    },
  },
  argTypes: {
    icon: {
      control: false,
      description: 'MUI Icon component to render',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
      description: 'Icon size preset',
    },
    width: {
      control: 'text',
      description: 'Custom width (overrides size preset)',
    },
    height: {
      control: 'text',
      description: 'Custom height (overrides size preset)',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'warning', 'info', 'white', 'black'],
      description: 'Icon color preset',
    },
    customColor: {
      control: 'color',
      description: 'Custom color (overrides color preset)',
    },
    clickable: {
      control: 'boolean',
      description: 'Whether the icon is clickable',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler',
    },
    rotation: {
      control: { type: 'range', min: 0, max: 360, step: 15 },
      description: 'Icon rotation in degrees',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Icon opacity',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <MaterialIcons.Error/>,
    size: '3xl',
    color: 'error',
  },
};

export const Delete: Story = {
  args: {
    icon: <DeleteIcon/>,
    size: '3xl',
    color: 'black',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Icon icon={<MaterialIcons.Home />} size="xs" />
      <Icon icon={<MaterialIcons.Home />} size="sm" />
      <Icon icon={<MaterialIcons.Home />} size="md" />
      <Icon icon={<MaterialIcons.Home />} size="lg" />
      <Icon icon={<MaterialIcons.Home />} size="xl" />
      <Icon icon={<MaterialIcons.Home />} size="2xl" />
      <Icon icon={<MaterialIcons.Home />} size="3xl" />
      <Icon icon={<MaterialIcons.Home />} size="4xl" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different preset sizes available for the Icon component.',
      },
    },
  },
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Icon icon={<MaterialIcons.Person />} color="primary" />
      <Icon icon={<MaterialIcons.Settings />} color="secondary" />
      <Icon icon={<MaterialIcons.CheckCircle />} color="success" />
      <Icon icon={<MaterialIcons.Error />} color="error" />
      <Icon icon={<MaterialIcons.Warning />} color="warning" />
      <Icon icon={<MaterialIcons.Info />} color="info" />
      <Icon icon={<MaterialIcons.Home />} color="black" />
      <div style={{ backgroundColor: '#333', padding: '8px', borderRadius: '4px' }}>
        <Icon icon={<MaterialIcons.Home />} color="white" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different color variants available for the Icon component.',
      },
    },
  },
};

export const Clickable: Story = {
  args: {
    icon: <MaterialIcons.Favorite />,
    size: 'lg',
    color: 'error',
    clickable: true,
    onClick: () => alert('Icon clicked!'),
  },
  parameters: {
    docs: {
      description: {
      story: 'Clickable icon with hover effects and click handler.',
      },
    },
  },
};

export const CustomDimensions: Story = {
  args: {
    icon: <MaterialIcons.Search />,
    width: 40,
    height: 40,
    color: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Using custom width and height instead of preset sizes.',
      },
    },
  },
};

export const WithRotation: Story = {
  args: {
    icon: <MaterialIcons.Settings />,
    size: 'lg',
    color: 'primary',
    rotation: 45,
  },
  parameters: {
    docs: {
      description: {
        story: 'Icon with custom rotation applied.',
      },
    },
  },
};

export const WithOpacity: Story = {
  args: {
    icon: <MaterialIcons.Share />,
    size: 'lg',
    color: 'secondary',
    opacity: 0.6,
  },
  parameters: {
    docs: {
      description: {
        story: 'Icon with custom opacity applied.',
      },
    },
  },
};

export const WithSxOverride: Story = {
  args: {
    icon: <MaterialIcons.Edit />,
    size: 'lg',
    color: 'primary',
    sx: {
      backgroundColor: 'var(--color-success-light)',
      borderRadius: '50%',
      padding: '8px',
      '&:hover': {
        backgroundColor: 'var(--color-success-main)',
        color: 'white',
        transform: 'scale(1.1)',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Using sx prop to override styles with custom background and hover effects.',
      },
    },
  },
};

export const CommonIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
      <Icon icon={<MaterialIcons.Home />} size="lg" color="primary" />
      <Icon icon={<MaterialIcons.Person />} size="lg" color="primary" />
      <Icon icon={<MaterialIcons.Settings />} size="lg" color="secondary" />
      <Icon icon={<MaterialIcons.Search />} size="lg" color="secondary" />
      <Icon icon={<MaterialIcons.Favorite />} size="lg" color="error" />
      <Icon icon={<MaterialIcons.Share />} size="lg" color="info" />
      <Icon icon={<MaterialIcons.Edit />} size="lg" color="primary" />
      <Icon icon={<MaterialIcons.CheckCircle />} size="lg" color="success" />
      <Icon icon={<MaterialIcons.Error />} size="lg" color="error" />
      <Icon icon={<MaterialIcons.Warning />} size="lg" color="warning" />
      <Icon icon={<MaterialIcons.Info />} size="lg" color="info" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Commonly used icons with different colors and sizes.',
      },
    },
  },
};

export const SVGDownloadIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <h3>SVG Download Icon</h3>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <DownloadIcon size={24} color="currentColor" />
        <DownloadIcon size={32} color="#1976d2" />
        <DownloadIcon size={40} color="#f44336" />
        <DownloadIcon size={48} color="#4caf50" />
      </div>
      <p style={{ color: '#666', textAlign: 'center' }}>
        Custom SVG download icon with different sizes and colors
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Custom SVG download icon that can be used independently or with the Icon component.',
      },
    },
  },
};

export const AgencyPortalIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3>Agency Portal Icons</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <DashboardIcon size={32} color="#1976d2" />
          <span>Dashboard</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <TeamsIcon size={32} color="#1976d2" />
          <span>Teams</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <PersonIcon size={32} color="#1976d2" />
          <span>Person</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <LockIcon size={32} color="#1976d2" />
          <span>Lock</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <SettingsIcon size={32} color="#1976d2" />
          <span>Settings</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <LinkIcon size={32} color="#1976d2" />
          <span>Link</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <AddIcon size={32} color="#1976d2" />
          <span>Add</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <SearchIcon size={32} color="#1976d2" />
          <span>Search</span>
        </div>
      </div>
      <p style={{ color: '#666', textAlign: 'center' }}>
        SVG versions of Material UI icons used in the Agency Portal
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'SVG versions of Material UI icons that are actually used in the Agency Portal project.',
      },
    },
  },
};

export const NavigationIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3>Navigation Icons</h3>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <ChevronLeftIcon size={24} color="#666" />
        <span>Previous</span>
        <ChevronRightIcon size={24} color="#666" />
        <span>Next</span>
        <CloseIcon size={24} color="#dc004e" />
        <span>Close</span>
      </div>
      <p style={{ color: '#666', textAlign: 'center' }}>
        Navigation and control icons
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Navigation and control icons for user interface interactions.',
      },
    },
  },
};

export const ActionIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3>Action Icons</h3>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <ExportIcon size={24} color="#666" />
        <span>Export</span>
        <ViewIcon size={24} color="#666" />
        <span>View</span>
        <DeleteIcon size={24} color="#dc004e" />
        <span>Delete</span>
        <DownloadIcon size={24} color="#1976d2" />
        <span>Download</span>
      </div>
      <p style={{ color: '#666', textAlign: 'center' }}>
        Action icons for table operations and data management
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Action icons used in table operations and data management.',
      },
    },
  },
};

export const CalendarIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3>Calendar Icon</h3>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <CalendarTodayIcon size={24} color="#1976d2" />
        <CalendarTodayIcon size={32} color="#dc004e" />
        <CalendarTodayIcon size={40} color="#9c27b0" />
      </div>
      <p style={{ color: '#666', textAlign: 'center' }}>
        Calendar icon used in DateRangePicker component
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Calendar icon specifically used in the DateRangePicker component.',
      },
    },
  },
};

export const MaterialUIIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3>Material UI Icons from Assets</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
        <Icon icon={<MaterialIcons.Home />} size="lg" color="primary" />
        <Icon icon={<MaterialIcons.Person />} size="lg" color="primary" />
        <Icon icon={<MaterialIcons.Settings />} size="lg" color="secondary" />
        <Icon icon={<MaterialIcons.Search />} size="lg" color="secondary" />
        <Icon icon={<MaterialIcons.Favorite />} size="lg" color="error" />
        <Icon icon={<MaterialIcons.Share />} size="lg" color="info" />
        <Icon icon={<MaterialIcons.Edit />} size="lg" color="primary" />
        <Icon icon={<MaterialIcons.CheckCircle />} size="lg" color="success" />
        <Icon icon={<MaterialIcons.Error />} size="lg" color="error" />
        <Icon icon={<MaterialIcons.Warning />} size="lg" color="warning" />
        <Icon icon={<MaterialIcons.Info />} size="lg" color="info" />
        <Icon icon={<MaterialIcons.Star />} size="lg" color="warning" />
      </div>
      <p style={{ color: '#666', textAlign: 'center' }}>
        All Material UI icons are now available through MaterialIcons namespace from your design system
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Material UI icons imported from your design system assets - no need to import from @mui/icons-material directly.',
      },
    },
  },
};
