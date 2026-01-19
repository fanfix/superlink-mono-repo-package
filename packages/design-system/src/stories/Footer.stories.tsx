import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Footer } from '../ui/Footer';
import { Box } from '@mui/material';

const meta: Meta<typeof Footer> = {
  title: 'Components/Layout/Footer',
  component: Footer,
  parameters: {
    docs: {
      description: {
        component:
          'A professional footer component with dark and light variants featuring company branding and social media links.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['dark', 'light'],
      description: 'The variant of the footer',
    },
    companyName: {
      control: { type: 'text' },
      description: 'Company name',
    },
    copyrightText: {
      control: { type: 'text' },
      description: 'Copyright text',
    },
    socialLinks: {
      control: false,
      description: 'Social media links',
    },
    onSocialClick: {
      action: 'socialClicked',
      description: 'Social media click handler',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Footer>;

export const Dark: Story = {
  args: {
    variant: 'dark',
    companyName: 'SuperLink',
    copyrightText: '© 2022 Superlink - All Rights Reserved',
    socialLinks: {
      instagram: 'https://instagram.com/superlink',
      linkedin: 'https://linkedin.com/company/superlink',
      email: 'mailto:contact@superlink.com',
    },
  },
  render: (args) => (
    <Box sx={{ padding: 'var(--padding-lg)' }}>
      <Footer {...args} />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The dark variant footer with dark background (#14171F) and white text/icons.',
      },
    },
  },
};

export const Light: Story = {
  args: {
    variant: 'light',
    companyName: 'SuperLink',
    copyrightText: '© 2022 Superlink - All Rights Reserved',
    socialLinks: {
      instagram: 'https://instagram.com/superlink',
      linkedin: 'https://linkedin.com/company/superlink',
      email: 'mailto:contact@superlink.com',
    },
  },
  render: (args) => (
    <Box sx={{ backgroundColor: 'var(--color-grey-footer)',}}>
      <Footer {...args} />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The light variant footer with light background (#EAEABE) and dark text/icons.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    variant: 'dark',
    companyName: 'SuperLink',
    copyrightText: '© 2022 Superlink - All Rights Reserved',
  },
  render: (args) => {
    const [clickedPlatform, setClickedPlatform] = React.useState<string | null>(null);
    
    const handleSocialClick = (platform: 'instagram' | 'linkedin' | 'email') => {
      setClickedPlatform(platform);
    };

    return (
      <Box sx={{ backgroundColor: '#f5f5f5', padding: 'var(--padding-lg)' }}>
        <Footer 
          {...args} 
          onSocialClick={handleSocialClick}
        />
        <Box sx={{ padding: 'var(--padding-lg)', backgroundColor: 'var(--color-white)', marginTop: 'var(--padding-lg)' }}>
          <h3>Interactive Footer</h3>
          <p>Click on social media icons to see the interactions.</p>
          {clickedPlatform && (
            <p>Last clicked: <strong>{clickedPlatform}</strong></p>
          )}
        </Box>
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive footer demonstrating click handlers for social media icons.',
      },
    },
  },
};

export const CustomContent: Story = {
  args: {
    variant: 'dark',
    companyName: 'MyCompany',
    copyrightText: '© 2024 MyCompany - All Rights Reserved',
    socialLinks: {
      instagram: 'https://instagram.com/mycompany',
      linkedin: 'https://linkedin.com/company/mycompany',
      email: 'mailto:hello@mycompany.com',
    },
  },
  render: (args) => (
    <Box sx={{ backgroundColor: '#f5f5f5', padding: 'var(--padding-lg)' }}>
      <Footer {...args} />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Footer with custom company name and copyright text.',
      },
    },
  },
};

export const WithoutSocialLinks: Story = {
  args: {
    variant: 'dark',
    companyName: 'SuperLink',
    copyrightText: '© 2022 Superlink - All Rights Reserved',
  },
  render: (args) => (
    <Box sx={{ backgroundColor: '#f5f5f5', padding: 'var(--padding-lg)' }}>
      <Footer {...args} />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Footer without social media links.',
      },
    },
  },
};

export const VariantComparison: Story = {
  args: {
    companyName: 'SuperLink',
    copyrightText: '© 2022 Superlink - All Rights Reserved',
    socialLinks: {
      instagram: 'https://instagram.com/superlink',
      linkedin: 'https://linkedin.com/company/superlink',
      email: 'mailto:contact@superlink.com',
    },
  },
  render: (args) => (
    <Box sx={{ backgroundColor: '#f5f5f5', padding: 'var(--padding-lg)' }}>
      <Box sx={{ marginBottom: 'var(--padding-lg)' }}>
        <h3>Dark Variant</h3>
        <Footer {...args} variant="dark" />
      </Box>
      <Box>
        <h3>Light Variant</h3>
        <Footer {...args} variant="light" />
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Side-by-side comparison of dark and light footer variants.',
      },
    },
  },
};
