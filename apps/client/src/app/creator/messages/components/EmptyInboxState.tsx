'use client';

import { Box, Typography } from '@mui/material';

// Style variables
const containerStyles = {
  flexGrow: 1,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  paddingTop: { xs: 'var(--padding-4xl)', md: 'var(--padding-settings-7xl)' },
};

const textStyles = {
  color: 'var(--color-gray-text-light-messages)',
  fontSize: { xs: 'var(--font-size-settings-xl)', md: 'var(--font-size-lg)' },
  fontWeight: 500,
  letterSpacing: '0.2px',
};

const EmptyInboxState = () => (
  <Box sx={containerStyles}>
    <Typography variant="body1" sx={textStyles}>
      No messages to display
    </Typography>
  </Box>
);

export default EmptyInboxState;

