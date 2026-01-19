'use client';

import React, { useState } from 'react';
import { Box, Collapse } from '@mui/material';
import { Typography } from '@superline/design-system';
import { KeyboardArrowUp } from '@mui/icons-material';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export default function CollapsibleSection({
  title,
  children,
  defaultExpanded = true,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const sectionStyles = {
    marginBottom: 'var(--padding-lg)',
    border: '1px solid var(--color-gray-200)',
    borderRadius: 'var(--border-radius-md)',
    overflow: 'hidden' as const,
    backgroundColor: 'var(--color-white)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  };

  const headerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--padding-lg) var(--padding-xl)',
    cursor: 'pointer',
    backgroundColor: 'var(--color-white)',
    borderBottom: 'none',
    transition: 'all var(--transition-normal)',
    '&:hover': {
      backgroundColor: 'var(--color-gray-50)',
    },
  };

  const titleStyles = {
    fontSize: 'var(--font-size-lg)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-black)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  };

  const iconStyles = {
    color: 'var(--color-gray-600)',
    transition: 'transform var(--transition-normal)',
    transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
  };

  const contentStyles = {
    padding: 'var(--padding-xl)',
  };

  return (
    <Box sx={sectionStyles}>
      <Box sx={headerStyles} onClick={() => setIsExpanded(!isExpanded)}>
        <Typography sx={titleStyles}>{title}</Typography>
        <KeyboardArrowUp sx={iconStyles} />
      </Box>
      <Collapse in={isExpanded} timeout={300}>
        <Box sx={contentStyles}>{children}</Box>
      </Collapse>
    </Box>
  );
}

