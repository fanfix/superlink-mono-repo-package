'use client';

import React from 'react';
import { Box, Link } from '@mui/material';
import { Instagram, LinkedIn, Email } from '@mui/icons-material';

export default function Footer() {
  // Styling variables
  const footerContainerStyles = {
    width: '100%',
    backgroundColor: 'var(--color-black)',
    padding: { xs: '40px var(--padding-2xl)', md: '60px var(--padding-horizontal-xl)' },
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', md: 'flex-start' },
    gap: { xs: '40px', md: '0' },
  };

  const leftSectionStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-lg-1)',
  };

  const logoContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-md)',
  };

  const copyrightStyles = {
    color: 'var(--color-gray-400)',
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-normal)',
    fontFamily: 'inherit',
  };

  const rightSectionStyles = {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: { xs: 'var(--padding-3xl)', md: '60px' },
    alignItems: { xs: 'flex-start', md: 'flex-start' },
  };

  const sectionContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-lg-1)',
  };

  const sectionTitleStyles = {
    color: 'var(--color-white)',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-bold)',
    fontFamily: 'inherit',
  };

  const linksContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-lg)',
  };

  const linkStyles = {
    color: 'var(--color-white)',
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-normal)',
    textDecoration: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
      color: 'var(--color-gray-200)',
    },
  };

  const socialIconsContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-xl)',
  };

  const socialIconLinkStyles = {
    color: 'var(--color-white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '&:hover': {
      color: 'var(--color-gray-200)',
    },
  };

  const iconStyles = {
    fontSize: 'var(--padding-2xl)',
  };

  return (
    <Box sx={footerContainerStyles}>
      {/* Left Section - Logo and Copyright */}
      <Box sx={leftSectionStyles}>
        {/* Logo and Text */}
        <Box sx={logoContainerStyles}>
          <img
            src="/assets/landing/asset 0.svg"
            alt="SuperLink Logo"
            style={{
              height: '26px',
              width: 'auto',
              filter: 'brightness(0) invert(1)',
            }}
          />
        </Box>
        
        {/* Copyright */}
        <Box sx={copyrightStyles}>
          © 2022 Superlink - All Rights Reserved
        </Box>
      </Box>

      {/* Right Section - Legal and Social */}
      <Box sx={rightSectionStyles}>
        {/* Legal Section */}
        <Box sx={sectionContainerStyles}>
          <Box sx={sectionTitleStyles}>
            Legal
          </Box>
          <Box sx={linksContainerStyles}>
            <Link href="/privacy-policy" sx={linkStyles}>
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" sx={linkStyles}>
              Terms & Conditions
            </Link>
          </Box>
        </Box>

        {/* Social Section */}
        <Box sx={sectionContainerStyles}>
          <Box sx={sectionTitleStyles}>
            Social
          </Box>
          <Box sx={socialIconsContainerStyles}>
            {/* Instagram Icon */}
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={socialIconLinkStyles}
            >
              <Instagram sx={iconStyles} />
            </Link>

            {/* LinkedIn Icon */}
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={socialIconLinkStyles}
            >
              <LinkedIn sx={iconStyles} />
            </Link>

            {/* Email Icon */}
            <Link
              href="mailto:contact@superlink.io"
              sx={socialIconLinkStyles}
            >
              <Email sx={iconStyles} />
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

