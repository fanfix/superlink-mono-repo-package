import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CardSkeleton } from '../ui/CardSkeleton';
import { Box, Stack, Grid } from '@mui/material';

const meta: Meta<typeof CardSkeleton> = {
  title: 'Components/Data Display/CardSkeleton',
  component: CardSkeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A professional and customizable skeleton component for loading states, perfect for card-based layouts like YouTube video cards, profile cards, and article cards.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['video', 'profile', 'article', 'custom'],
      description: 'Variant of the skeleton card',
    },
    showThumbnail: {
      control: { type: 'boolean' },
      description: 'Show thumbnail skeleton',
    },
    thumbnailAspectRatio: {
      control: { type: 'number', min: 0.5, max: 3, step: 0.1 },
      description: 'Thumbnail aspect ratio (width/height)',
    },
    showTitle: {
      control: { type: 'boolean' },
      description: 'Show title skeleton',
    },
    titleLines: {
      control: { type: 'number', min: 1, max: 5 },
      description: 'Number of title lines',
    },
    showSubtitle: {
      control: { type: 'boolean' },
      description: 'Show subtitle/metadata skeleton',
    },
    showAvatar: {
      control: { type: 'boolean' },
      description: 'Show avatar skeleton',
    },
    showDescription: {
      control: { type: 'boolean' },
      description: 'Show description skeleton',
    },
    descriptionLines: {
      control: { type: 'number', min: 1, max: 5 },
      description: 'Number of description lines',
    },
    showActions: {
      control: { type: 'boolean' },
      description: 'Show action buttons skeleton',
    },
    animation: {
      control: { type: 'select' },
      options: ['pulse', 'wave', false],
      description: 'Animation type',
    },
  },
  args: {
    variant: 'video',
    showThumbnail: true,
    thumbnailAspectRatio: 16 / 9,
    showTitle: true,
    titleLines: 2,
    showSubtitle: true,
    showAvatar: false,
    showDescription: false,
    descriptionLines: 3,
    showActions: false,
    animation: 'pulse',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof CardSkeleton>;

// Video Card Skeleton (YouTube style)
export const VideoCard: Story = {
  args: {
    variant: 'video',
    showThumbnail: true,
    showTitle: true,
    titleLines: 2,
    showSubtitle: true,
    showAvatar: false,
    animation: 'pulse',
  },
  parameters: {
    docs: {
      description: {
        story: 'Video card skeleton similar to YouTube video cards with thumbnail, title, and metadata.',
      },
    },
  },
};

// Video Card with Avatar
export const VideoCardWithAvatar: Story = {
  args: {
    variant: 'video',
    showThumbnail: true,
    showTitle: true,
    titleLines: 2,
    showSubtitle: true,
    showAvatar: true,
    animation: 'pulse',
  },
  parameters: {
    docs: {
      description: {
        story: 'Video card skeleton with channel avatar and name.',
      },
    },
  },
};

// Profile Card Skeleton
export const ProfileCard: Story = {
  args: {
    variant: 'profile',
    showThumbnail: true,
    showTitle: true,
    titleLines: 1,
    showSubtitle: true,
    animation: 'pulse',
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile card skeleton with circular avatar, name, and subtitle.',
      },
    },
  },
};

// Article Card Skeleton
export const ArticleCard: Story = {
  args: {
    variant: 'article',
    showThumbnail: true,
    showTitle: true,
    titleLines: 2,
    showSubtitle: true,
    showDescription: true,
    descriptionLines: 3,
    animation: 'pulse',
  },
  parameters: {
    docs: {
      description: {
        story: 'Article card skeleton with thumbnail, title, subtitle, and description.',
      },
    },
  },
};

// Article Card with Actions
export const ArticleCardWithActions: Story = {
  args: {
    variant: 'article',
    showThumbnail: true,
    showTitle: true,
    titleLines: 2,
    showSubtitle: true,
    showDescription: true,
    descriptionLines: 3,
    showActions: true,
    animation: 'pulse',
  },
  parameters: {
    docs: {
      description: {
        story: 'Article card skeleton with action buttons.',
      },
    },
  },
};

// Wave Animation
export const WaveAnimation: Story = {
  args: {
    variant: 'video',
    showThumbnail: true,
    showTitle: true,
    titleLines: 2,
    showSubtitle: true,
    animation: 'wave',
  },
  parameters: {
    docs: {
      description: {
        story: 'Video card skeleton with wave animation instead of pulse.',
      },
    },
  },
};

// No Animation
export const NoAnimation: Story = {
  args: {
    variant: 'video',
    showThumbnail: true,
    showTitle: true,
    titleLines: 2,
    showSubtitle: true,
    animation: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Video card skeleton without animation.',
      },
    },
  },
};

// Custom Content
export const CustomContent: Story = {
  args: {
    variant: 'custom',
    children: (
      <Box sx={{ padding: 'var(--padding-lg)' }}>
        <Box sx={{ display: 'flex', gap: 'var(--padding-md)', marginBottom: 'var(--padding-md)' }}>
          <Box
            sx={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--border-radius-full)',
              backgroundColor: 'var(--color-gray-200)',
            }}
          />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--padding-xs)' }}>
            <Box
              sx={{
                width: '60%',
                height: '20px',
                borderRadius: 'var(--border-radius-sm)',
                backgroundColor: 'var(--color-gray-200)',
              }}
            />
            <Box
              sx={{
                width: '40%',
                height: '16px',
                borderRadius: 'var(--border-radius-sm)',
                backgroundColor: 'var(--color-gray-200)',
              }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--padding-xs)' }}>
          <Box
            sx={{
              width: '100%',
              height: '16px',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: 'var(--color-gray-200)',
            }}
          />
          <Box
            sx={{
              width: '90%',
              height: '16px',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: 'var(--color-gray-200)',
            }}
          />
          <Box
            sx={{
              width: '75%',
              height: '16px',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: 'var(--color-gray-200)',
            }}
          />
        </Box>
      </Box>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom skeleton content using children prop for complete control.',
      },
    },
  },
};

// Grid Layout (Multiple Cards)
export const GridLayout: Story = {
  render: () => (
    <Box sx={{ width: '100%', maxWidth: '1200px' }}>
      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <CardSkeleton
              variant="video"
              showThumbnail={true}
              showTitle={true}
              titleLines={2}
              showSubtitle={true}
              animation="pulse"
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple skeleton cards in a responsive grid layout, perfect for loading states in card grids.',
      },
    },
  },
};

// Different Aspect Ratios
export const DifferentAspectRatios: Story = {
  render: () => (
    <Stack direction="row" spacing={3} sx={{ width: '100%', maxWidth: '800px' }}>
      <Box sx={{ flex: 1 }}>
        <CardSkeleton
          variant="video"
          thumbnailAspectRatio={16 / 9}
          showThumbnail={true}
          showTitle={true}
          titleLines={2}
          showSubtitle={true}
        />
        <Box sx={{ mt: 1, fontSize: 'var(--font-size-sm)', color: 'var(--color-grey-main)' }}>
          16:9 (Default)
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>
        <CardSkeleton
          variant="video"
          thumbnailAspectRatio={4 / 3}
          showThumbnail={true}
          showTitle={true}
          titleLines={2}
          showSubtitle={true}
        />
        <Box sx={{ mt: 1, fontSize: 'var(--font-size-sm)', color: 'var(--color-grey-main)' }}>
          4:3
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>
        <CardSkeleton
          variant="video"
          thumbnailAspectRatio={1 / 1}
          showThumbnail={true}
          showTitle={true}
          titleLines={2}
          showSubtitle={true}
        />
        <Box sx={{ mt: 1, fontSize: 'var(--font-size-sm)', color: 'var(--color-grey-main)' }}>
          1:1 (Square)
        </Box>
      </Box>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different thumbnail aspect ratios for various content types.',
      },
    },
  },
};

// Customizable Styling
export const CustomStyling: Story = {
  args: {
    variant: 'video',
    showThumbnail: true,
    showTitle: true,
    titleLines: 2,
    showSubtitle: true,
    sx: {
      border: '2px solid var(--color-blue-main)',
      borderRadius: 'var(--border-radius-lg)',
    },
    thumbnailSx: {
      border: '1px solid var(--color-grey-light)',
    },
    contentSx: {
      backgroundColor: 'var(--color-white-dull)',
      padding: 'var(--padding-lg)',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully customizable skeleton card using sx props for container, thumbnail, and content styling.',
      },
    },
  },
};

// Minimal Skeleton
export const Minimal: Story = {
  args: {
    variant: 'video',
    showThumbnail: true,
    showTitle: true,
    titleLines: 1,
    showSubtitle: false,
    showAvatar: false,
    showDescription: false,
    showActions: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal skeleton with only thumbnail and single title line.',
      },
    },
  },
};

// Full Featured
export const FullFeatured: Story = {
  args: {
    variant: 'article',
    showThumbnail: true,
    showTitle: true,
    titleLines: 2,
    showSubtitle: true,
    showDescription: true,
    descriptionLines: 4,
    showActions: true,
    animation: 'wave',
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully featured article card skeleton with all elements enabled.',
      },
    },
  },
};
