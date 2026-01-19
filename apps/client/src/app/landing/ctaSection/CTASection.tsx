'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Button, Typography } from '@superline/design-system';
import { useRouter } from 'next/navigation';
import { ArrowForward } from '@mui/icons-material';

export default function CTASection() {
  const router = useRouter();

  const handleSignUp = () => {
    router.push('/signup');
  };

  // Styling variables
  const sectionContainerStyles = {
    width: '100%',
    backgroundColor: 'var(--color-white)',
    padding: { xs: '60px var(--padding-2xl)', md: '100px var(--padding-horizontal-xl)' },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  };

  const subtitleStyles = {
    color: 'var(--color-gray-500)',
    fontSize: { xs: 'var(--font-size-md-1)', md: '18px' },
    fontWeight: 'var(--font-weight-normal)',
    marginBottom: { xs: 'var(--padding-lg-1)', md: 'var(--padding-xl)' },
    fontFamily: 'inherit',
  };

  const mainHeadingStyles = {
    color: 'var(--color-gray-800)',
    fontSize: { xs: '28px', sm: 'var(--padding-3xl)', md: '36px' },
    fontWeight: 'var(--font-weight-bold)',
    lineHeight: 'var(--line-height-snug)',
    maxWidth: '900px',
    marginBottom: { xs: 'var(--padding-3xl)', md: '40px' },
    fontFamily: 'inherit',
  };

  const signUpButtonStyles = {
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
    borderRadius: '40px',
    padding: { xs: '14px 28px', md: 'var(--padding-lg-1) var(--padding-3xl)' },
    fontSize: { xs: 'var(--font-size-md-1)', md: '18px' },
    fontWeight: 'var(--font-weight-semibold)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-md)',
    textTransform: 'none',
    fontFamily: 'inherit',
    '&:hover': {
      backgroundColor: '#1a1a1a',
    },
  };

  const arrowIconStyles = {
    fontSize: '18px',
    transform: 'rotate(-45deg)',
  };

  return (
    <Box sx={sectionContainerStyles}>
      {/* Subtitle */}
      <Typography sx={subtitleStyles}>
        Take your content to the next level
      </Typography>

      {/* Main Heading */}
      <Typography variant="h1" sx={mainHeadingStyles}>
        Your audience is waiting—turn your clicks into connections and your passion into profit.
      </Typography>

      {/* Sign Up Button */}
      <Button
        variant="primary-dark"
        onClick={handleSignUp}
        sx={signUpButtonStyles}
      >
        Sign Up Now
        <ArrowForward sx={arrowIconStyles} />
      </Button>
    </Box>
  );
}

