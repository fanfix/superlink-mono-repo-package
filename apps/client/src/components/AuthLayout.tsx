'use client';

import React from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';
import authPreviewImage from '../assets/auth_preview.webp';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const rootContainerStyles = {
    minHeight: '100vh',
    display: 'flex',
    backgroundColor: 'var(--color-white)',
    overflow: 'hidden',
  };

  const leftSideStyles = {
    flex: { xs: '1 1 100%', md: '0 0 57%', lg: '0 0 47%' },
    display: 'flex',
    flexDirection: 'column',
    alignItems: { xs: 'center', md: 'flex-start' },
    justifyContent: 'center',
    padding: { xs: 'var(--padding-lg)', sm: '40px', md: '60px 80px' },
    minWidth: { xs: '100%', md: '57%', lg: '47%' },
    maxWidth: { xs: '100%', md: '47%', lg: '47%' },
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  const rightSideStyles = {
    flex: { md: '0 0 53%', lg: '0 0 53%' },
    display: { xs: 'none', md: 'flex' },
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-gray-50)',
    padding: { md: '40px', lg: '60px' },
    position: 'relative',
    overflow: 'hidden',
  };

  const imageContainerStyles = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    maxWidth: '600px',
    maxHeight: '800px',
  };

  return (
    <Box sx={rootContainerStyles}>
      <Box sx={leftSideStyles}>
        {children}
      </Box>

      <Box sx={rightSideStyles}>
        <Box sx={imageContainerStyles}>
          <Image
            src={authPreviewImage}
            alt="SuperLink Preview"
            fill
            style={{
              objectFit: 'contain',
              objectPosition: 'center',
            }}
            priority
            sizes="(max-width: 768px) 0vw, 60vw"
          />
        </Box>
      </Box>
    </Box>
  );
}

