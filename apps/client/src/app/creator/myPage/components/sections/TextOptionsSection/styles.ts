import { SxProps, Theme } from '@mui/material';
import { CSSProperties } from 'react';

export const styles = {
  subtitle: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-black)',
    marginBottom: 'var(--padding-md)',
  } as SxProps<Theme>,

  optionsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-md)',
    width: '100%',
  } as SxProps<Theme>,

  formControl: {
    flex: 1,
    minWidth: '200px',
    '& .MuiInputBase-root': {
      width: '100%',
    },
  } as SxProps<Theme>,

  select: {
    flex: 1,
    minWidth: '200px',
    '& .MuiOutlinedInput-root': {
      borderRadius: 'var(--border-radius-md)',
      backgroundColor: 'var(--color-white)',
      height: '40px',
      '& fieldset': {
        borderColor: 'var(--color-gray-200)',
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: 'var(--color-gray-300)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--color-gray-400)',
        borderWidth: '1px',
      },
    },
    '& .MuiSelect-select': {
      padding: 'var(--padding-sm) var(--padding-md)',
      paddingRight: 'var(--padding-3xl)',
      display: 'flex',
      alignItems: 'center',
      fontSize: 'var(--font-size-md-1)',
      lineHeight: '1.5',
      color: 'var(--color-black)',
    },
    '& .MuiSelect-icon': {
      right: 'var(--padding-md)',
      color: 'var(--color-gray-600)',
    },
  } as SxProps<Theme>,

  menuPaper: {
    borderRadius: 'var(--border-radius-md)',
    marginTop: 'var(--padding-xs)',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  } as SxProps<Theme>,

  colorButtonsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-sm)',
  } as SxProps<Theme>,

  colorPickerButton: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-gray-100)',
    border: '1px solid var(--color-gray-200)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    '&:hover': {
      backgroundColor: 'var(--color-gray-200)',
    },
  } as SxProps<Theme>,

  colorPickerIcon: {
    fontSize: '18px',
    color: 'var(--color-gray-600)',
    pointerEvents: 'none',
  } as SxProps<Theme>,

  colorSwatch: (color: string) => ({
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: color,
    border: '1px solid var(--color-gray-200)',
    cursor: 'pointer',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    overflow: 'hidden',
  }) as SxProps<Theme>,

  hiddenColorInput: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
    pointerEvents: 'none',
    top: 0,
    left: 0,
  } as CSSProperties,
};

