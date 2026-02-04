'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';

interface LoaderProps {
  fullScreen?: boolean;
}

export default function Loader({ fullScreen = true }: LoaderProps) {
  // Prevent background scroll while full screen loader is shown
  const prevOverflowRef = useRef<{ html: string; body: string } | null>(null);
  useEffect(() => {
    if (!fullScreen) return;
    if (typeof document === 'undefined') return;

    const html = document.documentElement;
    const body = document.body;
    prevOverflowRef.current = {
      html: html.style.overflow,
      body: body.style.overflow,
    };
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      const prev = prevOverflowRef.current;
      if (!prev) return;
      html.style.overflow = prev.html;
      body.style.overflow = prev.body;
    };
  }, [fullScreen]);

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
        // Always white like the product splash screen (even in dark mode)
        backgroundColor: '#FFFFFF',
        zIndex: 9999,
      }
    : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--padding-2xl)',
      };

  return (
    <Box sx={containerStyles} aria-busy="true" aria-live="polite" role="status">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          transform: 'translateY(-6px)', // small visual centering like screenshot
        }}
      >
        <Box sx={{ width: 56, height: 56, position: 'relative' }}>
          <Image
            src="/assets/brand/superlink-mark.svg"
            alt="SuperLink"
            fill
            priority
            style={{ objectFit: 'contain' }}
          />
        </Box>

        <Typography
          sx={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            color: '#35383A',
            fontSize: { xs: 34, sm: 40 },
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          SuperLink
        </Typography>

        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'conic-gradient(#2563EB 0 50deg, #111827 50deg 360deg)',
            WebkitMask:
              'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
            animation: 'superlinkSpin 0.9s linear infinite',
            '@keyframes superlinkSpin': {
              from: { transform: 'rotate(0deg)' },
              to: { transform: 'rotate(360deg)' },
            },
            '@supports not (mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px)))': {
              background: 'transparent',
              border: '3px solid #111827',
              borderTopColor: '#2563EB',
            },
          }}
        />
      </Box>
    </Box>
  );
}

