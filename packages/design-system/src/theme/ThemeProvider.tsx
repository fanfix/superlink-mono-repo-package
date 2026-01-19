import React from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './index';

interface ThemeProviderProps {
  children: React.ReactNode;
  mode?: 'light' | 'dark';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  mode = 'light' 
}) => {
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  React.useEffect(() => {
    // Apply theme class to document body for CSS variables
    document.body.className = mode === 'dark' ? 'theme-dark' : 'theme-light';
    
    return () => {
      document.body.className = '';
    };
  }, [mode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
