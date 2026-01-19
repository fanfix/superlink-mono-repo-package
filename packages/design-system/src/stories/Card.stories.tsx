import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../ui/Card';
import { Image } from '../ui/Image';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Warning as WarningIcon } from '@mui/icons-material'; 
import { Error} from '@mui/icons-material'; 
import DeleteIcon from '@mui/icons-material/Delete';
const meta: Meta<typeof Card> = {
  title: 'Components/Data Display/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible Card component with customizable variants and styling options. Perfect for displaying content in contained sections.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['profile', 'modal', 'default', 'elevated', 'outlined'],
      description: 'Card variant',
    },
    clickable: {
      control: 'boolean',
      description: 'Whether the card is clickable',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler',
    },
    children: {
      control: 'text',
      description: 'Card content',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ProfileCard: Story = {
    args: {
      variant: 'profile',
      children: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '100%', width: '100%' }}>
          {/* Profile Image with verification badge */}
          <div style={{ position: 'relative' }}>
            <Image 
              src="./public/profile.png" 
              alt="Sienna Bloom" 
              variant="rounded-full" 
              width={90}
              height={90} 
            />
            {/* Verification checkmark */}
            <div style={{
              position: 'absolute',
              bottom: '15px',
              right: '5px',
              backgroundColor: 'var(--color-success-main)',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white'
            }}>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                <Image src="./public/green_tick.png" alt="Check" width={24} height={24} />
              </span>
            </div>
          </div>
          
          {/* Text Content */}
          <div style={{ flex: 1 }}>
            <Typography variant="heading-md" sx={{ marginBottom: '4px'}}>
              Sienna Bloom
            </Typography>
            <Typography variant="text-md">
              Verified User
            </Typography>
          </div>
          
          {/* Active Button */}
          <Button variant="success-light-sm">
            Active
          </Button>
        </div>
      ),
    },
    parameters: {
      docs: {
        description: {
          story: 'Profile card matching the Figma design with profile image, verification badge, typography, and active status button.',
        },
      },
    },
  };

export const ModalCard: Story = {
  args: {
    variant: 'modal',
    children: (
    <>
        {/* Error Icon */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom:"16px"
          }}>
              <Icon 
                icon={<Error />} 
                size="3xl" 
                color="error" 
              />
          </div>
         
        <Typography variant="heading-sm" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom:"8px"
          }}>
            Delete Confirmation
          </Typography>
        
        {/* Content */}
        <div style={{ textAlign: 'center', marginBottom: '24px' , color:"var(--color-grey-light)" }}>
          <Typography variant="text-sm">
            Are you sure you want to delete this creator? <b> This process cannot be undone.</b>
          </Typography>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          justifyContent: 'space-between',
        }}>
          <Button 
            variant="outline-sm"
          >
            Cancel
          </Button>
          <Button 
            variant="primary-danger-sm"
          >
            <Icon 
              icon={<DeleteIcon/>} 
              size="sm" 
              color="white" 
              sx={{marginRight:"8px"}}
            />
            Delete
          </Button>
        </div>
        </>   
    ),
  },
  
  parameters: {
    docs: {
      description: {
        story: 'Modal card variant matching the Figma design with warning icon, confirmation message, and action buttons.',
      },
    },
  },
};

export const MuiVariants: Story = {
    render: () => (
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Card variant="default" sx={{ padding: '16px', minWidth: '200px' }}>
          <Typography variant="heading-md" sx={{ marginBottom: '8px' }}>
            Default Card
          </Typography>
          <Typography variant="text-md">Standard MUI card with default styling.</Typography>
        </Card>
  
        <Card variant="elevated" sx={{ padding: '16px', minWidth: '200px' }}>
          <Typography variant="heading-md" sx={{ marginBottom: '8px' }}>
            Elevated Card
          </Typography>
          <Typography variant="text-md">Card with elevated shadow.</Typography>
        </Card>
  
        <Card variant="outlined" sx={{ padding: '16px', minWidth: '200px' }}>
          <Typography variant="heading-md" sx={{ marginBottom: '8px' }}>
            Outlined Card
          </Typography>
          <Typography variant="text-md">Card with border outline.</Typography>
        </Card>
      </div>
    ),
    parameters: {
      docs: {
        description: {
          story: 'Standard MUI card variants (default, elevated, outlined) for comparison.',
        },
      },
    },
  };
  