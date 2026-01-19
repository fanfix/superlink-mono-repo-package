import type { Preview, Decorator } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '../src/theme';
import '../src/tokens/theme.css';

export const decorators: Decorator[] = [
  (Story, context) => {
    const isDark = context.globals.theme === 'dark';
    const theme = isDark ? darkTheme : lightTheme;
    
    // Apply theme class to document body for CSS variables
    React.useEffect(() => {
      const themeClass = isDark ? 'theme-dark' : 'theme-light';
      document.body.className = themeClass;
      
      return () => {
        document.body.className = '';
      };
    }, [isDark]);

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div 
          className={isDark ? 'theme-dark' : 'theme-light'}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px',
          }}
        >
          <Story />
        </div>
      </ThemeProvider>
    );
  },
  withThemeByClassName({
    themes: {
      light: 'theme-light',
      dark: 'theme-dark',
    },
    defaultTheme: 'light',
  }),
];

const preview: Preview = {
  parameters: {
    // Center components by default
    layout: 'centered',
    // Better control over the canvas background
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: 'var(--color-background-primary, #ffffff)',
        },
        {
          name: 'dark',
          value: 'var(--color-background-primary, #0b0f19)',
        },
      ],
    },
    // Ensure proper styling for controls
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', left: '☀️' },
          { value: 'dark', title: 'Dark', left: '🌙' },
        ],
        dynamicTitle: true,
      },
    },
  },
};
export default preview;
