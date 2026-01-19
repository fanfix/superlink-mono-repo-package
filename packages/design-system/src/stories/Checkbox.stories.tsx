import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Checkbox } from '../ui/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Checkbox size preset',
    },
    label: {
      control: 'text',
      description: 'Checkbox label text',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is indeterminate',
    },
    onChange: {
      action: 'changed',
      description: 'Change handler function',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler function',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
    size: 'md',
  },
};

// Checked state
export const Checked: Story = {
  args: {
    checked: true,
    disabled: false,
    size: 'md',
  },
};

// With label
export const WithLabel: Story = {
  args: {
    checked: false,
    disabled: false,
    size: 'md',
    label: 'Accept terms and conditions',
  },
};

// Checked with label
export const CheckedWithLabel: Story = {
  args: {
    checked: true,
    disabled: false,
    size: 'md',
    label: 'I agree to the privacy policy',
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    size: 'md',
    label: 'This checkbox is disabled',
  },
};

// Disabled checked state
export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    size: 'md',
    label: 'This checkbox is disabled and checked',
  },
};

// Small size
export const Small: Story = {
  args: {
    checked: true,
    disabled: false,
    size: 'sm',
    label: 'Small checkbox',
  },
};

// Medium size (default)
export const Medium: Story = {
  args: {
    checked: true,
    disabled: false,
    size: 'md',
    label: 'Medium checkbox (default)',
  },
};

// Large size
export const Large: Story = {
  args: {
    checked: true,
    disabled: false,
    size: 'lg',
    label: 'Large checkbox',
  },
};

// Indeterminate state
export const Indeterminate: Story = {
  args: {
    checked: false,
    disabled: false,
    size: 'md',
    label: 'Indeterminate checkbox',
    indeterminate: true,
  },
};

// All states showcase
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <Checkbox checked={false} label="Unchecked" />
      <Checkbox checked={true} label="Checked" />
      <Checkbox checked={false} disabled label="Disabled unchecked" />
      <Checkbox checked={true} disabled label="Disabled checked" />
      <Checkbox checked={false} indeterminate label="Indeterminate" />
      <Checkbox checked={true} size="sm" label="Small checked" />
      <Checkbox checked={true} size="lg" label="Large checked" />
    </div>
  ),
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Checkbox 
          checked={checked} 
          onChange={setChecked}
          label="Click to toggle me!"
        />
        <p style={{ fontSize: '14px', color: '#666' }}>
          Current state: {checked ? 'Checked' : 'Unchecked'}
        </p>
      </div>
    );
  },
};
