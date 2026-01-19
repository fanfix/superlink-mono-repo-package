import type { Meta, StoryObj } from '@storybook/react';
import { Image } from '../ui/Image';

const meta: Meta<typeof Image> = {
  title: 'Foundation/Image',
  component: Image,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible Image component with customizable sizing, border radius, and styling options. Perfect for profile pictures, avatars, and other image displays.',
      },
    },
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'Image source URL',
    },
    alt: {
      control: 'text',
      description: 'Alt text for accessibility',
    },
    variant: {
      control: 'select',
      options: ['rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-full'],
      description: 'Border radius variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
      description: 'Preset size',
    },
    width: {
      control: 'text',
      description: 'Custom width (overrides size preset)',
    },
    height: {
      control: 'text',
      description: 'Custom height (overrides size preset)',
    },
    objectFit: {
      control: 'select',
      options: ['cover', 'contain', 'fill'],
      description: 'Object fit behavior',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler',
    },
    loading: {
      control: 'select',
      options: ['lazy', 'eager'],
      description: 'Loading behavior',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample image URLs for stories
const sampleImages = {
  profile: './public/profile.png',
  landscape: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
  square:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
};

export const Default: Story = {
  args: {
    src: sampleImages.profile,
    alt: 'Profile picture',
    variant: "rounded-full",
    size: "sm",
    objectFit: 'cover',
    width: '80px\n',
    height: '80px\n',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Image src={sampleImages.profile} alt="XS" size="xs" />
      <Image src={sampleImages.profile} alt="SM" size="sm" />
      <Image src={sampleImages.profile} alt="MD" size="md" />
      <Image src={sampleImages.profile} alt="LG" size="lg" />
      <Image src={sampleImages.profile} alt="XL" size="xl" />
      <Image src={sampleImages.profile} alt="2XL" size="2xl" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different preset sizes available for the Image component.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Image src={sampleImages.profile} alt="Small radius" variant="rounded-sm" size="lg" />
      <Image src={sampleImages.profile} alt="Medium radius" variant="rounded-md" size="lg" />
      <Image src={sampleImages.profile} alt="Large radius" variant="rounded-lg" size="lg" />
      <Image src={sampleImages.profile} alt="Full radius" variant="rounded-full" size="lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different border radius variants for various design needs.',
      },
    },
  },
};

export const ObjectFit: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Image
          src={sampleImages.landscape}
          alt="Cover"
          variant="rounded-md"
          width={120}
          height={120}
          objectFit="cover"
        />
        <p style={{ fontSize: '12px', marginTop: '8px' }}>Cover</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Image
          src={sampleImages.landscape}
          alt="Contain"
          variant="rounded-md"
          width={120}
          height={120}
          objectFit="contain"
        />
        <p style={{ fontSize: '12px', marginTop: '8px' }}>Contain</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Image
          src={sampleImages.landscape}
          alt="Fill"
          variant="rounded-md"
          width={120}
          height={120}
          objectFit="fill"
        />
        <p style={{ fontSize: '12px', marginTop: '8px' }}>Fill</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different object-fit behaviors for handling aspect ratios.',
      },
    },
  },
};

export const CustomDimensions: Story = {
  args: {
    src: sampleImages.profile,
    alt: 'Custom size',
    variant: 'rounded-full',
    width: 150,
    height: 150,
    objectFit: 'cover',
  },
  parameters: {
    docs: {
      description: {
        story: 'Using custom width and height instead of preset sizes.',
      },
    },
  },
};

export const Clickable: Story = {
  args: {
    src: sampleImages.profile,
    alt: 'Clickable image',
    variant: 'rounded-full',
    size: 'lg',
    onClick: () => alert('Image clicked!'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Image with click handler - cursor changes to pointer on hover.',
      },
    },
  },
};

export const WithSxOverride: Story = {
  args: {
    src: sampleImages.profile,
    alt: 'Styled image',
    variant: 'rounded-full',
    size: 'lg',
    sx: {
      border: '3px solid #5572aa',
      boxShadow: '0 4px 12px rgba(85, 114, 170, 0.3)',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 6px 16px rgba(85, 114, 170, 0.4)',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Using sx prop to override styles with custom border and hover effects.',
      },
    },
  },
};

export const LoadingStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Image
        src={sampleImages.profile}
        alt="Lazy loading"
        variant="rounded-full"
        size="lg"
        loading="lazy"
      />
      <Image
        src={sampleImages.profile}
        alt="Eager loading"
        variant="rounded-full"
        size="lg"
        loading="eager"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different loading behaviors - lazy (default) and eager.',
      },
    },
  },
};
