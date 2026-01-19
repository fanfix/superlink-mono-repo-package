'use client';

import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoaderProps {
  fullScreen?: boolean;
}

export default function Loader({ fullScreen = true }: LoaderProps) {
  const containerStyles = fullScreen
    ? {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999,
      }
    : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--padding-2xl)',
      };

  return (
    <Box sx={containerStyles}>
      <CircularProgress size={40} />
    </Box>
  );
}

