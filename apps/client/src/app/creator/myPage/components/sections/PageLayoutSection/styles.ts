import { SxProps, Theme } from '@mui/material';
import { CSSProperties } from 'react';

export const styles = {
  layoutsContainer: {
    display: 'flex',
    
    gap: 'var(--padding-lg)',
    justifyContent: {xs: 'center', md: 'flex-start'},
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  } as SxProps<Theme>,

  selectionBox: (isSelected: boolean) => ({
    position: 'relative' as const,
    width: '100%',
    maxWidth: '280px',
    height: '120px',
    backgroundColor: isSelected ? '#FFFFFF' : '#F5F5F5',
    borderRadius: 'var(--border-radius-lg)',
    padding: 'var(--padding-md)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease-in-out',
    border: isSelected ? '2px solid var(--color-black)' : '1px solid var(--color-gray-300)',
    boxShadow: isSelected 
      ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
      : '0 1px 3px rgba(0, 0, 0, 0.05)',
    '&:hover': {
      backgroundColor: isSelected ? '#FFFFFF' : '#EEEEEE',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      borderColor: isSelected ? 'var(--color-black)' : 'var(--color-gray-400)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:focus-visible': {
      outline: '2px solid var(--color-primary)',
      outlineOffset: '2px',
    },
  }) as SxProps<Theme>,

  layoutImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  } as CSSProperties,
};

