'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Typography } from '@superline/design-system';

interface ClickableMetricCardProps {
  value: string | number;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

// Style variables
const getCardStyles = (isSelected: boolean) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-insights-gap-sm)',
  cursor: 'pointer',
  padding: 'var(--padding-insights-md) var(--padding-insights-2xl)',
  minWidth: 'var(--width-metric-card-min)',
  backgroundColor: isSelected ? 'var(--color-blue-light-bg-insights)' : 'var(--color-white)',
  transition: 'all 0.2s ease',
});

const valueStyles = {
  fontSize: 'var(--font-size-insights-2xl)',
  fontWeight: 700,
  color: 'var(--color-black)',
  lineHeight: 1.1,
};

const labelStyles = {
  fontSize: 'var(--font-size-insights-md)',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--color-gray-text-medium)',
  fontWeight: 600,
};

export default function ClickableMetricCard({
  value,
  label,
  isSelected,
  onClick,
}: ClickableMetricCardProps) {
  return (
    <Box sx={getCardStyles(isSelected)} onClick={onClick}>
      <Typography sx={valueStyles}>{value}</Typography>
      <Typography sx={labelStyles}>{label}</Typography>
    </Box>
  );
}

