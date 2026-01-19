'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface DateRangeSelectorProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

const dateRanges = ['1d', '7d', '30d', '60d', '90d', '180d'];

// Style variables
const containerStyles = {
  display: 'flex',
  justifyContent: { xs: 'flex-start', md: 'center' },
  gap: 'var(--spacing-insights-gap-md)',
  flexWrap: 'wrap',
};

const getButtonStyles = (isSelected: boolean) => ({
  padding: 'var(--padding-insights-xs) var(--padding-insights-xs)',
  fontSize: 'var(--font-size-insights-md)',
  letterSpacing: '0.1em',
  borderRadius: 'var(--border-radius-date-button)',
  backgroundColor: isSelected ? 'var(--color-gray-300)' : 'var(--color-white)',
  color: 'var(--color-black)',
  textTransform: 'uppercase',
  cursor: 'pointer',
  fontWeight: 800,
  transition: 'all 0.2s ease',
});

export default function DateRangeSelector({
  selectedRange,
  onRangeChange,
}: DateRangeSelectorProps) {
  return (
    <Box sx={containerStyles}>
      {dateRanges.map((range) => (
        <Box
          key={range}
          component="button"
          sx={getButtonStyles(selectedRange === range)}
          onClick={() => onRangeChange(range)}
        >
          {range}
        </Box>
      ))}
    </Box>
  );
}

