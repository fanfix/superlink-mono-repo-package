'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Typography } from '@superline/design-system';

interface MetricCardProps {
  value: string | number;
  label: string;
}

export default function MetricCard({ value, label }: MetricCardProps) {
  const cardStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    gap: 'var(--spacing-settings-gap-xs)',
  };

  const valueStyles = {
    fontSize: { xs: 'var(--font-size-insights-xs)', md: 'var(--font-size-insights-xl)' },
    fontWeight: 700,
    color: 'var(--color-black)',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  };

  const labelStyles = {
    fontSize: 'var(--font-size-insights-md)',
    letterSpacing: '0.24em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-black)',
    fontWeight: 600,
  };

  return (
    <Box sx={cardStyles}>
      <Typography sx={valueStyles}>{value}</Typography>
      <Typography sx={labelStyles}>{label}</Typography>
    </Box>
  );
}

