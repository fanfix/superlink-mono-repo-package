'use client';

import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { ROUTES } from '../config/routes';

export default function NotFound() {
  const pageContainerStyles = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-white-sidebar)',
    padding: 'var(--padding-lg)',
    textAlign: 'center',
  };

  const contentStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--padding-xl)',
    maxWidth: '600px',
  };

  const headingStyles = {
    fontSize: { xs: '48px', sm: '72px' },
    fontWeight: 'bold',
    color: 'var(--color-black-secondary)',
    marginBottom: 'var(--padding-md)',
  };

  const titleStyles = {
    fontSize: { xs: '24px', sm: '32px' },
    fontWeight: 'semibold',
    color: 'var(--color-black-secondary)',
    marginBottom: 'var(--padding-sm)',
  };

  const descriptionStyles = {
    fontSize: 'var(--font-size-md)',
    color: 'var(--color-grey-main)',
    marginBottom: 'var(--padding-lg)',
    lineHeight: 'var(--line-height-md)',
  };

  const buttonContainerStyles = {
    display: 'flex',
    gap: 'var(--padding-md)',
    flexDirection: { xs: 'column', sm: 'row' },
    width: '100%',
    justifyContent: 'center',
  };

  const buttonStyles = {
    padding: 'var(--padding-md) var(--padding-xl)',
    borderRadius: 'var(--border-radius-md)',
    textDecoration: 'none',
    display: 'inline-block',
    minWidth: '200px',
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={contentStyles}>
        <Typography variant="h1" sx={headingStyles}>
          404
        </Typography>
        
        <Typography variant="h2" sx={titleStyles}>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" sx={descriptionStyles}>
          Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or the URL might be incorrect.
        </Typography>
        
        <Box sx={buttonContainerStyles}>
          <Link href={ROUTES.HOME}>
            <Button
              variant="contained"
              sx={{
                ...buttonStyles,
                backgroundColor: 'var(--color-blue-main)',
                color: 'var(--color-white)',
                '&:hover': {
                  backgroundColor: 'var(--color-blue-main)',
                  opacity: 0.9,
                },
              }}
            >
              Go to Home
            </Button>
          </Link>
          
          <Link href={ROUTES.LOGIN}>
            <Button
              variant="outlined"
              sx={{
                ...buttonStyles,
                borderColor: 'var(--color-blue-main)',
                color: 'var(--color-blue-main)',
                '&:hover': {
                  borderColor: 'var(--color-blue-main)',
                  backgroundColor: 'var(--color-white-dull)',
                },
              }}
            >
              Go to Login
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

