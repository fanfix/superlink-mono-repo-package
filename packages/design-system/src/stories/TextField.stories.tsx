import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { TextField } from '../ui/TextField';
import { Box, Stack } from '@mui/material';

const meta: Meta<typeof TextField> = {
  title: 'Components/Forms/TextField',
  component: TextField,
  parameters: {
    docs: {
      description: {
        component:
          'A reusable TextField component with bottom border design, placeholder support, and helper text functionality.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {
    placeholder: 'Name',
    variant: 'standard',
  },
};

export const Email: Story = {
  args: {
    placeholder: 'Email',
    type: 'email',
    variant: 'standard',
    helperText: 'Invalid Email Format',
    error: true,
  },
};

export const Password: Story = {
  args: {
    placeholder: 'Password',
    type: 'password',
    helperText: 'Must be at least 8 characters',
    variant: 'standard',
  },
};

export const PhoneNumber: Story = {
  args: {
    placeholder: '+1',
    type: 'tel',
    variant: 'standard',
  },
};

export const Error: Story = {
  args: {
    placeholder: 'Email',
    type: 'email',
    error: true,
    helperText: 'Please enter a valid email address',
    variant: 'standard',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Name',
    disabled: true,
    variant: 'standard',
  },
};

export const FormExample: Story = {
  render: () => (
    <Box sx={{ maxWidth: 400, p: 2 }}>
      <Stack spacing={3}>
        <TextField placeholder="Name" variant="standard" />
        <TextField placeholder="Email" type="email" variant="standard" />
        <TextField
          placeholder="Password"
          type="password"
          helperText="Must be at least 8 characters"
          variant="standard"
        />
        <TextField placeholder="+1" type="tel" variant="standard" />
      </Stack>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Example form showing all TextField variants as they would appear in a sign-up form.',
      },
    },
  },
};

export const OutlinedDefault: Story = {
  args: {
    placeholder: 'Name',
    variant: 'outlined',
  },
};

export const OutlinedWithHelper: Story = {
  args: {
    placeholder: 'Email',
    type: 'email',
    helperText: 'We will never share your email',
    variant: 'outlined',
  },
};

export const OutlinedError: Story = {
  args: {
    placeholder: 'Email',
    type: 'email',
    error: true,
    helperText: 'Please enter a valid email address',
    variant: 'outlined',
  },
};

export const OutlinedDisabled: Story = {
  args: {
    placeholder: 'Name',
    disabled: true,
    variant: 'outlined',
  },
};

export const OutlinedFormExample: Story = {
  render: () => (
    <Box sx={{ maxWidth: 400, p: 2 }}>
      <Stack spacing={3}>
        <TextField placeholder="Name" variant="outlined" />
        <TextField placeholder="Email" type="email" variant="outlined" />
        <TextField
          placeholder="Password"
          type="password"
          helperText="Must be at least 8 characters"
          variant="outlined"
        />
        <TextField placeholder="+1" type="tel" variant="outlined" />
      </Stack>
    </Box>
  ),
};
