import { createTheme, ThemeOptions } from '@mui/material/styles';

// Import CSS variables - ensure theme.css is imported in your app
import '../tokens/theme.css';

// Helper function to get CSS variable value
const getCSSVar = (variable: string): string => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  }
  // Fallback values for SSR
  const fallbacks: Record<string, string> = {
    '--color-primary-main': '#181818',
    '--color-primary-light': '#595959',
    '--color-white': '#ffffff',
    '--color-black': '#000000',
    '--color-grey-main': '#637381',
    '--color-blue-main': '#5572aa',
    '--font-size-sm': '12px',
    '--font-size-md': '14px',
    '--font-size-lg': '20px',
    '--border-radius-md': '8px',
  };
  return fallbacks[variable] || '';
};

// Base theme configuration using CSS variables
const baseThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: getCSSVar('--color-primary-main') || '#181818',
      light: getCSSVar('--color-primary-light') || '#595959',
      dark: getCSSVar('--color-primary-dark') || '#181818',
      contrastText: getCSSVar('--color-white') || '#ffffff',
    },
    secondary: {
      main: getCSSVar('--color-grey-main') || '#637381',
      light: getCSSVar('--color-white-secondary') || '#d3d3d3',
      dark: getCSSVar('--color-primary-main') || '#181818',
      contrastText: getCSSVar('--color-white') || '#ffffff',
    },
    error: {
      main: getCSSVar('--color-error-main') || '#dc2626',
      light: getCSSVar('--color-error-light') || '#f87171',
      dark: getCSSVar('--color-error-dark') || '#b91c1c',
      contrastText: getCSSVar('--color-white') || '#ffffff',
    },
    warning: {
      main: getCSSVar('--color-warning-main') || '#d97706',
      light: getCSSVar('--color-warning-light') || '#fbbf24',
      dark: getCSSVar('--color-warning-dark') || '#b45309',
      contrastText: getCSSVar('--color-white') || '#ffffff',
    },
    success: {
      main: getCSSVar('--color-success-main') || '#059669',
      light: getCSSVar('--color-success-light') || '#34d399',
      dark: getCSSVar('--color-success-dark') || '#047857',
      contrastText: getCSSVar('--color-white') || '#ffffff',
    },
    info: {
      main: getCSSVar('--color-blue-main') || '#5572aa',
      light: getCSSVar('--color-info-light') || '#38bdf8',
      dark: getCSSVar('--color-info-dark') || '#0284c7',
      contrastText: getCSSVar('--color-white') || '#ffffff',
    },
    background: {
      default: getCSSVar('--color-background-primary') || '#ffffff',
      paper: getCSSVar('--color-background-paper') || '#f8fafc',
    },
    text: {
      primary: getCSSVar('--color-text-primary') || '#000000',
      secondary: getCSSVar('--color-text-secondary') || '#637381',
      disabled: getCSSVar('--color-text-disabled') || '#ffffff',
    },
    divider: getCSSVar('--color-white-secondary') || '#d3d3d3',
    action: {
      active: getCSSVar('--color-primary-main') || '#181818',
      hover: getCSSVar('--color-background-secondary') || '#d3d3d3',
      selected: getCSSVar('--color-primary-light') || '#595959',
      disabled: getCSSVar('--color-background-disabled') || '#637381',
      disabledBackground: getCSSVar('--color-background-disabled') || '#637381',
    },
  },
  typography: {
    fontFamily: getCSSVar('--font-family-primary') || 'Inter, Roboto, Helvetica, Arial, sans-serif',
    fontSize: 14, // Base font size from --font-size-md
    h1: {
      fontSize: getCSSVar('--font-size-2xl') || '32px',
      fontWeight: getCSSVar('--font-weight-bold') || '700',
      lineHeight: getCSSVar('--line-height-2xl') || '36px',
      color: getCSSVar('--color-text-primary') || '#000000',
    },
    h2: {
      fontSize: getCSSVar('--font-size-xl') || '24px',
      fontWeight: getCSSVar('--font-weight-semibold') || '600',
      lineHeight: getCSSVar('--line-height-xl') || '28px',
      color: getCSSVar('--color-text-primary') || '#000000',
    },
    h3: {
      fontSize: getCSSVar('--font-size-lg') || '20px',
      fontWeight: getCSSVar('--font-weight-semibold') || '600',
      lineHeight: getCSSVar('--line-height-lg') || '24px',
      color: getCSSVar('--color-text-primary') || '#000000',
    },
    h4: {
      fontSize: getCSSVar('--font-size-md') || '14px',
      fontWeight: getCSSVar('--font-weight-semibold') || '600',
      lineHeight: getCSSVar('--line-height-md') || '20px',
      color: getCSSVar('--color-text-primary') || '#000000',
    },
    h5: {
      fontSize: getCSSVar('--font-size-md') || '14px',
      fontWeight: getCSSVar('--font-weight-medium') || '500',
      lineHeight: getCSSVar('--line-height-md') || '20px',
      color: getCSSVar('--color-text-primary') || '#000000',
    },
    h6: {
      fontSize: getCSSVar('--font-size-sm') || '12px',
      fontWeight: getCSSVar('--font-weight-semibold') || '600',
      lineHeight: getCSSVar('--line-height-sm') || '16px',
      color: getCSSVar('--color-text-primary') || '#000000',
    },
    body1: {
      fontSize: getCSSVar('--font-size-md') || '14px',
      fontWeight: getCSSVar('--font-weight-normal') || '400',
      lineHeight: getCSSVar('--line-height-md') || '20px',
      color: getCSSVar('--color-text-primary') || '#000000',
    },
    body2: {
      fontSize: getCSSVar('--font-size-sm') || '12px',
      fontWeight: getCSSVar('--font-weight-normal') || '400',
      lineHeight: getCSSVar('--line-height-sm') || '16px',
      color: getCSSVar('--color-text-secondary') || '#637381',
    },
    button: {
      fontSize: getCSSVar('--font-size-md') || '14px',
      fontWeight: getCSSVar('--font-weight-semibold') || '600',
      lineHeight: getCSSVar('--line-height-md') || '20px',
      textTransform: 'none',
    },
    caption: {
      fontSize: getCSSVar('--font-size-sm') || '12px',
      fontWeight: getCSSVar('--font-weight-normal') || '400',
      lineHeight: getCSSVar('--line-height-sm') || '16px',
      color: getCSSVar('--color-text-secondary') || '#637381',
    },
  },
  shape: {
    borderRadius: parseInt(getCSSVar('--border-radius-md') || '8'),
  },
  spacing: 8, // Base spacing unit
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    // Button component overrides
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: getCSSVar('--font-weight-semibold') || '600',
          borderRadius: getCSSVar('--border-radius-md') || '8px',
          minHeight: getCSSVar('--min-height-button') || '40px',
          padding: `${getCSSVar('--padding-vertical-md') || '6px'} ${getCSSVar('--padding-horizontal-md') || '16px'}`,
          fontSize: getCSSVar('--font-size-md') || '14px',
          lineHeight: getCSSVar('--line-height-md') || '20px',
          transition: getCSSVar('--transition-normal') || '200ms ease-in-out',
          '&:hover': {
            boxShadow: getCSSVar('--shadow-sm') || '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          },
          '&:disabled': {
            backgroundColor: getCSSVar('--button-disabled-bg') || '#637381',
            color: getCSSVar('--button-disabled-text') || '#ffffff',
          },
        },
        sizeSmall: {
          padding: `${getCSSVar('--padding-vertical-sm') || '4px'} ${getCSSVar('--padding-horizontal-sm') || '8px'}`,
          fontSize: getCSSVar('--font-size-sm') || '12px',
          minHeight: getCSSVar('--height-sm') || '32px',
        },
        sizeLarge: {
          padding: `${getCSSVar('--padding-vertical-lg') || '8px'} ${getCSSVar('--padding-horizontal-lg') || '24px'}`,
          fontSize: getCSSVar('--font-size-md') || '14px',
          minHeight: getCSSVar('--height-lg') || '48px',
        },
        contained: {
          boxShadow: getCSSVar('--shadow-sm') || '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: getCSSVar('--shadow-md') || '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
          },
        },
      },
    },
    // TextField component overrides
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: getCSSVar('--border-radius-md') || '8px',
            fontSize: getCSSVar('--font-size-md') || '14px',
            minHeight: getCSSVar('--min-height-input') || '44px',
            '& fieldset': {
              borderColor: getCSSVar('--color-white-secondary') || '#d3d3d3',
            },
            '&:hover fieldset': {
              borderColor: getCSSVar('--color-grey-main') || '#637381',
            },
            '&.Mui-focused fieldset': {
              borderColor: getCSSVar('--color-primary-main') || '#181818',
            },
          },
        },
      },
    },
    // Card component overrides
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: getCSSVar('--border-radius-lg') || '12px',
          boxShadow: getCSSVar('--shadow-md') || '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          backgroundColor: getCSSVar('--color-background-paper') || '#f8fafc',
          minHeight: getCSSVar('--min-height-card') || '200px',
        },
      },
    },
    // Paper component overrides
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: getCSSVar('--border-radius-md') || '8px',
          backgroundColor: getCSSVar('--color-background-paper') || '#f8fafc',
        },
        elevation1: {
          boxShadow: getCSSVar('--shadow-sm') || '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: getCSSVar('--shadow-md') || '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: getCSSVar('--shadow-lg') || '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    // Dialog component overrides
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: getCSSVar('--border-radius-lg') || '12px',
          maxWidth: getCSSVar('--max-width-lg') || '512px',
        },
      },
    },
    // Chip component overrides
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: getCSSVar('--border-radius-full') || '9999px',
          fontSize: getCSSVar('--font-size-sm') || '12px',
          fontWeight: getCSSVar('--font-weight-medium') || '500',
        },
      },
    },
  },
};

// Light theme
export const lightTheme = createTheme(baseThemeOptions);

// Dark theme with overrides
export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    ...baseThemeOptions.palette,
    mode: 'dark',
    primary: {
      main: getCSSVar('--color-blue-main') || '#5572aa',
      light: '#7a8fc7',
      dark: '#4a6399',
      contrastText: getCSSVar('--color-white') || '#ffffff',
    },
    background: {
      default: '#0b0f19', // Dark background
      paper: '#1e293b', // Dark paper
    },
    text: {
      primary: '#e5e7eb', // Light text on dark background
      secondary: '#9ca3af', // Muted text on dark background
      disabled: getCSSVar('--color-text-disabled') || '#ffffff',
    },
    divider: '#374151',
    action: {
      active: getCSSVar('--color-blue-main') || '#5572aa',
      hover: '#374151',
      selected: '#4b5563',
      disabled: '#6b7280',
      disabledBackground: '#4b5563',
    },
  },
});

// Default export
export default lightTheme;

// Theme utilities
export const themeUtils = {
  getCSSVar,
  spacing: {
    xs: getCSSVar('--padding-xs') || '4px',
    sm: getCSSVar('--padding-sm') || '6px',
    md: getCSSVar('--padding-md') || '8px',
    lg: getCSSVar('--padding-lg') || '12px',
    xl: getCSSVar('--padding-xl') || '16px',
  },
  borderRadius: {
    sm: getCSSVar('--border-radius-sm') || '4px',
    md: getCSSVar('--border-radius-md') || '8px',
    lg: getCSSVar('--border-radius-lg') || '12px',
    xl: getCSSVar('--border-radius-xl') || '16px',
  },
  shadows: {
    sm: getCSSVar('--shadow-sm') || '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: getCSSVar('--shadow-md') || '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: getCSSVar('--shadow-lg') || '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: getCSSVar('--shadow-xl') || '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  transitions: {
    fast: getCSSVar('--transition-fast') || '150ms ease-in-out',
    normal: getCSSVar('--transition-normal') || '200ms ease-in-out',
    slow: getCSSVar('--transition-slow') || '300ms ease-in-out',
  },
};