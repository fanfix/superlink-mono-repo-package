'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Typography } from '@superline/design-system';

interface AdditionalStatsSectionProps {
  socialMediaClicks: number;
  sectionClicks: number;
  popularLinks: number;
  loading?: boolean;
}

// Style variables
const containerStyles = {
  width: '100%',
  backgroundColor: 'var(--color-white)',
  padding: { xs: 'var(--padding-insights-2xl) var(--padding-insights-xl)', md: 'var(--padding-insights-3xl) var(--padding-insights-4xl)' },
  display: 'flex',
  flexDirection: 'column',
};

const getStatItemStyles = (isLast: boolean) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-insights-gap-sm)',
  paddingY: 'var(--padding-insights-lg)',
  borderBottom: isLast ? 'none' : '1px solid var(--color-gray-border-light-insights)',
});

const labelStyles = {
  fontSize: { xs: 'var(--font-size-insights-lg)', md: 'var(--font-size-insights-lg)' },
  fontWeight: 700,
  color: 'var(--color-black)',
  letterSpacing: '-0.01em',
};

const valueStyles = {
  fontSize: { xs: 'var(--font-size-insights-lg)', md: 'var(--font-size-insights-lg)' },
  fontWeight: 700,
  color: 'var(--color-black)',
  letterSpacing: '-0.01em',
};

export default function AdditionalStatsSection({
  socialMediaClicks,
  sectionClicks,
  popularLinks,
  loading,
}: AdditionalStatsSectionProps) {
  const displayValue = (value: number) => loading ? '...' : `${value} Clicks`;
  
  return (
    <Box sx={containerStyles}>
      {[
        { label: 'Social Media Clicks', value: displayValue(socialMediaClicks) },
        { label: 'Section Clicks', value: displayValue(sectionClicks) },
        { label: 'Popular Links', value: displayValue(popularLinks) },
      ].map((item, index, arr) => (
        <Box key={item.label} sx={getStatItemStyles(index === arr.length - 1)}>
          <Typography sx={labelStyles}>{item.label}</Typography>
          <Typography sx={valueStyles}>{item.value}</Typography>
        </Box>
      ))}
    </Box>
  );
}

