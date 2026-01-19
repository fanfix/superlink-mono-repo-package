import type { Meta, StoryObj } from '@storybook/react';
import { DotGraph, DotGraphPoint } from '../ui/DotGraph';

const baseData: DotGraphPoint[] = [
  { label: '1d', value: 0.2 },
  { label: '2d', value: 0.1 },
  { label: '3d', value: -0.1 },
  { label: '4d', value: 0.35 },
  { label: '5d', value: 0.05 },
  { label: '6d', value: -0.2 },
  { label: '7d', value: 0.12 },
];

const meta: Meta<typeof DotGraph> = {
  title: 'Components/Charts/DotGraph',
  component: DotGraph,
  parameters: {
    layout: 'centered',
  },
  args: {
    data: baseData,
    minValue: -1,
    maxValue: 1,
    height: 220,
  },
};

export default meta;

type Story = StoryObj<typeof DotGraph>;

export const Default: Story = {};

export const SinglePoint: Story = {
  args: {
    data: [{ label: 'Today', value: 0.6, color: '#ff4d4f' }],
    minValue: -1,
    maxValue: 1,
  },
};

export const TightRange: Story = {
  args: {
    data: [
      { label: 'Jan', value: 12 },
      { label: 'Feb', value: 18 },
      { label: 'Mar', value: 11 },
      { label: 'Apr', value: 15 },
      { label: 'May', value: 22 },
      { label: 'Jun', value: 19 },
    ],
    minValue: 0,
    maxValue: 25,
    yTickCount: 4,
  },
};

export const CustomStyling: Story = {
  args: {
    data: baseData,
    minValue: -1,
    maxValue: 1,
    height: 260,
    borderRadius: 48,
    borderColor: '#111111',
    borderWidth: 2,
    backgroundColor: '#f6f6f9',
    width: 600,
    sx: { mx: 'auto' },
    graphAreaSx: { boxShadow: '0 35px 60px rgba(0,0,0,0.08)' },
  },
};

