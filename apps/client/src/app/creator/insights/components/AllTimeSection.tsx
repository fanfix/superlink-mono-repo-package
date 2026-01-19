'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Typography } from '@superline/design-system';
import MetricCard from './MetricCard';

interface AllTimeSectionProps {
  visits: number;
  clicks: number;
  ctr: string;
  loading?: boolean;
}

// Style variables
const outerContainerStyles = {
  width: '100%',
  backgroundColor: 'var(--color-gray-background-light)',
  display: 'flex',
  justifyContent: 'center',
};

const innerContainerStyles = {
  width: '100%',
  maxWidth: 'var(--width-insights-container)',
  padding: { xs: 'var(--padding-insights-2xl) var(--padding-insights-xl)', md: 'var(--padding-insights-3xl) var(--padding-3xl)' },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'start',
};

const titleStyles = {
  fontSize: { xs: 'var(--font-size-insights-sm)', md: 'var(--font-size-insights-lg)' },
  letterSpacing: '0.28em',
  fontWeight: 800,
  color: 'var(--color-dark-text)',
};

const metricsContainerStyles = {
  display: 'flex',
  gap: { xs: 'var(--spacing-insights-gap-xl)', md: 'var(--spacing-insights-gap-2xl)' },
  flexWrap: 'wrap',
  alignItems: 'flex-end',
};

export default function AllTimeSection({ visits, clicks, ctr, loading }: AllTimeSectionProps) {
  return (
    <Box sx={outerContainerStyles}>
      <Box sx={innerContainerStyles}>
        <Typography sx={titleStyles}>ALL TIME</Typography>

        <Box sx={metricsContainerStyles}>
          <MetricCard value={loading ? '...' : visits} label="Visits" />
          <MetricCard value={loading ? '...' : clicks} label="Clicks" />
          <MetricCard value={loading ? '...' : ctr} label="CTR" />
        </Box>
      </Box>
    </Box>
  );
}

