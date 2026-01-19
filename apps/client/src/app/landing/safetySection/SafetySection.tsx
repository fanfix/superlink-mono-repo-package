'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Lock, CheckCircle, CreditCard } from '@mui/icons-material';
import Image from 'next/image';

// Import images from landing folder
import Asset22Image from '../../../assets/landing/asset 22.png';
import Asset23Image from '../../../assets/landing/asset 23.png';
import Asset24Image from '../../../assets/landing/asset 24.png';

export default function SafetySection() {
  // Styling variables
  const sectionContainerStyles = {
    width: '100%',
    backgroundColor: 'var(--color-black-secondary)',
    padding: { xs: '60px var(--padding-2xl)', md: '100px 48px' },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const mainHeadingStyles = {
    fontSize: { xs: '32px', md: '48px' },
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-white)',
    textAlign: 'center',
    marginBottom: { xs: 'var(--padding-lg-1)', md: 'var(--padding-xl)' },
    lineHeight: 'var(--line-height-tight)',
  };

  const subtitleStyles = {
    fontSize: { xs: 'var(--font-size-md-1)', md: '18px' },
    fontWeight: 'var(--font-weight-normal)',
    color: 'var(--color-white)',
    textAlign: 'center',
    maxWidth: '800px',
    marginBottom: { xs: 'var(--margin-2xl)', md: '64px' },
    opacity: 0.9,
    lineHeight: 'var(--line-height-relaxed)',
  };

  const gridContainerStyles = {
    width: '100%',
    maxWidth: '1200px',
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
    gap: { xs: 'var(--padding-2xl)', md: 'var(--padding-3xl)' },
    alignItems: 'stretch',
  };

  const leftColumnStyles = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  };

  const cardStyles = {
    backgroundColor: '#1B1D26',
    borderRadius: 'var(--border-radius-lg)',
    padding: { xs: 'var(--padding-xl)', md: 'var(--padding-2xl)' },
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all var(--transition-normal)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
    },
  };

  const iconTitleContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-lg)',
    marginBottom: 'var(--padding-xl)',
  };

  const iconStyles = {
    color: 'var(--color-white)',
    fontSize: 'var(--padding-2xl)',
  };

  const cardTitleStyles = {
    fontSize: { xs: '18px', md: 'var(--padding-xl)' },
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-white)',
  };

  const imageContainerStyles = {
    position: 'relative',
    width: '100%',
    flex: 1,
    minHeight: { xs: '200px', md: '300px' },
    marginBottom: 'var(--padding-xl)',
    borderRadius: 'var(--border-radius-md)',
    overflow: 'hidden',
  };

  const imageContainerSmallStyles = {
    position: 'relative',
    width: '100%',
    height: { xs: '200px', md: '200px' },
    marginBottom: 'var(--padding-xl)',
    borderRadius: 'var(--border-radius-md)',
    overflow: 'hidden',
  };

  const cardSubtitleStyles = {
    fontSize: { xs: '15px', md: 'var(--font-size-md-1)' },
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-white)',
    marginBottom: 'var(--padding-md)',
  };

  const cardDescriptionStyles = {
    fontSize: { xs: '13px', md: 'var(--font-size-md)' },
    fontWeight: 'var(--font-weight-normal)',
    color: 'var(--color-gray-200)',
    lineHeight: 'var(--line-height-relaxed)',
  };

  const rightColumnStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: { xs: 'var(--padding-2xl)', md: 'var(--padding-3xl)' },
    height: '100%',
  };

  return (
    <Box sx={sectionContainerStyles}>
      {/* Main Heading */}
      <Typography variant="h2" sx={mainHeadingStyles}>
        Safety at every step.
      </Typography>

      {/* Subtitle */}
      <Typography sx={subtitleStyles}>
        Superlink prioritizes your security and privacy. We implement industry-leading measures to ensure your transactions and data remain safe.
      </Typography>

      {/* Security Features Grid */}
      <Box sx={gridContainerStyles}>
        {/* Left Column - Payment Security */}
        <Box sx={leftColumnStyles}>
          <Box sx={cardStyles}>
            <Box sx={iconTitleContainerStyles}>
              <CreditCard sx={iconStyles} />
              <Typography sx={cardTitleStyles}>
                Payment Security
              </Typography>
            </Box>
            <Box sx={imageContainerStyles}>
              <Image
                src={Asset22Image}
                alt="Apple Pay & Stripe"
                fill
                style={{
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Typography sx={cardSubtitleStyles}>
              Apple Pay & Stripe Protection
            </Typography>
            <Typography sx={cardDescriptionStyles}>
              Payments are processed through Apple Pay and Stripe, ensuring encrypted transactions with fraud detection and chargeback protection.
            </Typography>
          </Box>
        </Box>

        {/* Right Column - Fraud Prevention & 2FA */}
        <Box sx={rightColumnStyles}>
          {/* Fraud Prevention */}
          <Box sx={cardStyles}>
            <Box sx={iconTitleContainerStyles}>
              <Lock sx={iconStyles} />
              <Typography sx={cardTitleStyles}>
                Fraud Prevention
              </Typography>
            </Box>
            <Box sx={imageContainerSmallStyles}>
              <Image
                src={Asset23Image}
                alt="Secure Checkout"
                fill
                style={{
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Typography sx={cardSubtitleStyles}>
              Secure Checkout Process
            </Typography>
            <Typography sx={cardDescriptionStyles}>
              Ensures safe and seamless payment completion with robust encryption and fraud protection.
            </Typography>
          </Box>

          {/* User Account Security */}
          <Box sx={cardStyles}>
            <Box sx={iconTitleContainerStyles}>
              <CheckCircle sx={iconStyles} />
              <Typography sx={cardTitleStyles}>
                User Account Security
              </Typography>
            </Box>
            <Box sx={imageContainerSmallStyles}>
              <Image
                src={Asset24Image}
                alt="Two-Factor Authentication"
                fill
                style={{
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Typography sx={cardSubtitleStyles}>
              Two-Factor Authentication (2FA)
            </Typography>
            <Typography sx={cardDescriptionStyles}>
              Extra layer of protection for logging into your account.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
