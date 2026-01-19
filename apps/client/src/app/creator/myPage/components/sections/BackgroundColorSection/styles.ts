import { SxProps, Theme } from '@mui/material';
import React from 'react';

export const styles = {
  colorsContainer: {
    display: 'flex',
    gap: 'var(--padding-sm)',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
  } as SxProps<Theme>,

  colorSwatch: (color: string, isSelected: boolean) => ({
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: color,
    border: isSelected ? '2px solid var(--color-white)' : '1.5px solid var(--color-gray-200)',
    boxShadow: isSelected ? '0 0 0 2px var(--color-black)' : 'none',
    cursor: 'pointer',
    transition: 'all var(--transition-normal)',
    '&:hover': {
      transform: 'scale(1.1)',
      borderColor: 'var(--color-black)',
    },
  }) as SxProps<Theme>,

  colorPickerButton: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '1.5px solid var(--color-gray-200)',
    backgroundColor: 'var(--color-white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all var(--transition-normal)',
    padding: 0,
    minWidth: '28px',
    '&:hover': {
      transform: 'scale(1.1)',
      borderColor: 'var(--color-black)',
      backgroundColor: 'var(--color-gray-50)',
    },
  } as SxProps<Theme>,

  colorPickerInput: {
    position: 'absolute',
    opacity: 0,
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    zIndex: 1,
  } as React.CSSProperties,
};

