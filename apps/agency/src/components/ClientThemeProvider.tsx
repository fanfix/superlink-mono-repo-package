'use client';

import React from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';

interface ClientThemeProviderProps {
  children: React.ReactNode;
}

export function ClientThemeProvider({ children }: ClientThemeProviderProps) {
  // Create a minimal theme that works with MUI
  const theme = createTheme({
    palette: {
      mode: 'light',
    },
    typography: {
      fontFamily: 'var(--font-family-primary, Inter, Roboto, Helvetica, Arial, sans-serif)',
    },
  });

  React.useEffect(() => {
    // Apply theme class to document body for CSS variables
    document.body.className = 'theme-light';

    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
