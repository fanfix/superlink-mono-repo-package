import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Box, Stack, Typography } from '@mui/material';

const meta: Meta<typeof Modal> = {
  title: 'Components/Feedback/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible Modal component built on Material-UI Dialog with support for title, subtitle, actions, and customizable styling.',
      },
    },
  },
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: 'Controls whether the modal is displayed',
    },
    onClose: {
      action: 'closed',
      description: 'Callback fired when the modal requests to be closed',
    },
    title: {
      control: { type: 'text' },
      description: 'Title text displayed at the top of the modal',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Optional supporting text displayed below the title',
    },
    maxWidth: {
      control: { type: 'number' },
      description: 'Maximum width of the modal surface in pixels',
    },
    showCloseButton: {
      control: { type: 'boolean' },
      description: 'Shows or hides the close button in the header',
    },
  },
  args: {
    open: true,
    onClose: () => {},
    title: 'Modal Title',
    subtitle: 'Modal subtitle or description text',
    showCloseButton: true,
    maxWidth: 520,
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Modal>;

// Basic Modal
export const Basic: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(args.open);
    
    React.useEffect(() => {
      setOpen(args.open);
    }, [args.open]);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Typography>
            This is a basic modal with title and content. You can add any content here.
          </Typography>
        </Modal>
      </>
    );
  },
  args: {
    open: false,
    title: 'Basic Modal',
    subtitle: 'This is a basic modal example',
  },
};

// Modal with Actions
export const WithActions: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal with Actions</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm Action"
          subtitle="Are you sure you want to proceed with this action?"
          actions={
            <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
              <Button
                variant="outline-sm"
                onClick={() => setOpen(false)}
                sx={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="primary-dark"
                onClick={() => {
                  alert('Action confirmed!');
                  setOpen(false);
                }}
                sx={{ flex: 1 }}
              >
                Confirm
              </Button>
            </Stack>
          }
        >
          <Typography>
            This modal includes action buttons in the footer. You can customize the actions as needed.
          </Typography>
        </Modal>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with action buttons in the footer section.',
      },
    },
  },
};

// Modal without Close Button
export const WithoutCloseButton: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal (No Close Button)</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          title="Modal Without Close Button"
          subtitle="This modal does not have a close button in the header"
          showCloseButton={false}
          actions={
            <Button
              variant="primary-dark"
              onClick={() => setOpen(false)}
              fullWidth
            >
              Close
            </Button>
          }
        >
          <Typography>
            Users must use the action button or click outside to close this modal.
          </Typography>
        </Modal>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal without the close button in the header.',
      },
    },
  },
};

// Modal with Custom Width
export const CustomWidth: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Wide Modal</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          title="Wide Modal"
          subtitle="This modal has a custom max width of 800px"
          maxWidth={800}
        >
          <Typography>
            This modal is wider than the default. You can set any maxWidth value to customize the modal size.
          </Typography>
        </Modal>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with custom maximum width.',
      },
    },
  },
};

// Modal with Custom Styling
export const CustomStyling: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Styled Modal</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          title="Custom Styled Modal"
          subtitle="This modal uses custom styling through sx props"
          sx={{
            backgroundColor: 'var(--color-white-dull)',
            borderRadius: 'var(--border-radius-lg)',
          }}
          headerSx={{
            borderBottom: '1px solid var(--color-grey-light)',
            paddingBottom: 'var(--padding-md)',
          }}
          contentSx={{
            paddingTop: 'var(--padding-lg)',
          }}
          actionsSx={{
            borderTop: '1px solid var(--color-grey-light)',
            paddingTop: 'var(--padding-md)',
          }}
          actions={
            <Button
              variant="primary-dark"
              onClick={() => setOpen(false)}
              fullWidth
            >
              Close
            </Button>
          }
        >
          <Typography>
            You can customize the styling of the modal, header, content, and actions sections using the sx props.
          </Typography>
        </Modal>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with custom styling applied to different sections.',
      },
    },
  },
};

// Modal with Form Content
export const WithForm: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({ name: '', email: '' });

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Form Modal</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          title="Create New User"
          subtitle="Fill in the details to create a new user account"
          maxWidth={600}
          actions={
            <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
              <Button
                variant="outline-sm"
                onClick={() => setOpen(false)}
                sx={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="primary-dark"
                onClick={() => {
                  alert(`User created: ${formData.name} (${formData.email})`);
                  setOpen(false);
                  setFormData({ name: '', email: '' });
                }}
                sx={{ flex: 1 }}
              >
                Create User
              </Button>
            </Stack>
          }
        >
          <Stack spacing={3}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Name
              </Typography>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
                style={{
                  width: '100%',
                  padding: 'var(--padding-md)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--color-grey-light)',
                  fontSize: 'var(--font-size-sm)',
                }}
              />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Email
              </Typography>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
                style={{
                  width: '100%',
                  padding: 'var(--padding-md)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--color-grey-light)',
                  fontSize: 'var(--font-size-sm)',
                }}
              />
            </Box>
          </Stack>
        </Modal>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal containing a form with input fields.',
      },
    },
  },
};

// Modal with Long Content
export const LongContent: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal with Long Content</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          title="Terms and Conditions"
          subtitle="Please read through the terms and conditions"
          maxWidth={600}
          actions={
            <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
              <Button
                variant="outline-sm"
                onClick={() => setOpen(false)}
                sx={{ flex: 1 }}
              >
                Decline
              </Button>
              <Button
                variant="primary-dark"
                onClick={() => {
                  alert('Terms accepted!');
                  setOpen(false);
                }}
                sx={{ flex: 1 }}
              >
                Accept
              </Button>
            </Stack>
          }
        >
          <Box sx={{ maxHeight: '400px', overflowY: 'auto', pr: 1 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
            </Typography>
          </Box>
        </Modal>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with scrollable long content.',
      },
    },
  },
};

// Modal Title Only
export const TitleOnly: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal (Title Only)</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          title="Simple Modal"
        >
          <Typography>
            This modal only has a title, no subtitle. The content area starts closer to the header.
          </Typography>
        </Modal>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with only a title, no subtitle.',
      },
    },
  },
};
