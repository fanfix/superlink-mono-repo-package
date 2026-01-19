import { SxProps, Theme } from '@mui/material';

export const settingsModalStyles = {
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  } as SxProps<Theme>,

  modalContent: (theme: Theme) => ({
    position: 'relative' as const,
    backgroundColor: 'var(--color-white)',
    paddingTop: 'var(--padding-2xl)',
    borderRadius: 0,
    boxShadow: 'none',
    width: '100vw',
    height: '100vh',
    maxWidth: '100vw',
    maxHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row' as const,
    overflow: 'hidden',
    outline: 'none',
    margin: 0,
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column' as const,
      paddingTop: '33px',
    },
  }) as SxProps<Theme>,

  closeButton: (theme: Theme) => ({
    position: 'absolute' as const,
    top: '16px',
    right: '16px',
    zIndex: 10,
    width: '40px',
    height: '40px',
    backgroundColor: 'transparent',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    [theme.breakpoints.down('md')]: {
      top: '4px',
      right: '10px',
    },
  }) as SxProps<Theme>,

  sidebar: (theme: Theme) => ({
    width: '200px',
    minWidth: '200px',
    backgroundColor: 'var(--color-white)',
    padding: 'var(--padding-lg) var(--padding-md)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--padding-xs)',
    overflowY: 'auto' as const,
    height: '100vh',
    boxSizing: 'border-box' as const,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      minWidth: 'auto',
      height: 'auto',
      borderRight: 'none',
      borderBottom: '1px solid var(--color-gray-200)',
      flexDirection: 'row' as const,
      overflowY: 'visible' as const,
      overflowX: 'auto' as const,
      padding: 'var(--padding-md)',
      gap: 'var(--padding-xs)',
    },
  }) as SxProps<Theme>,

  tabButton: (isActive: boolean, theme: Theme) => ({
    padding: 'var(--padding-md) var(--padding-lg)',
    cursor: 'pointer',
    borderRadius: 'var(--border-radius-sm)',
    backgroundColor: isActive ? 'var(--color-gray-100)' : 'transparent',
    color: isActive ? 'var(--color-gray-900)' : 'var(--color-gray-600)',
    fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
    fontSize: 'var(--font-size-md)',
    transition: 'var(--transition-normal)',
    '&:hover': {
      backgroundColor: isActive ? 'var(--color-gray-100)' : 'var(--color-gray-50)',
    },
    [theme.breakpoints.down('md')]: {
      whiteSpace: 'nowrap' as const,
      padding: 'var(--padding-sm) var(--padding-md)',
    },
  }) as SxProps<Theme>,

  contentArea: (theme: Theme) => ({
    flex: 'unset', 
    padding: 'var(--padding-2xl) var(--padding-lg)',
    overflowY: 'auto' as const,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: '900px',
    minHeight: '100vh',
    height: '100vh',
    boxSizing: 'border-box' as const,
    '&::-webkit-scrollbar': {
      width: 0,
      height: 0,
    },
    [theme.breakpoints.down('md')]: {
      padding: 'var(--padding-lg)',
      minHeight: 'auto',
      height: 'auto',
      flex: 1,
    },
  }) as SxProps<Theme>,
};

