import { SxProps, Theme } from '@mui/material';
import React from 'react';

export const styles = {
  thumbnailUploadContainer: {
    position: 'relative' as const,
    width: { xs: '100px', sm: '120px' },
    height: { xs: '100px', sm: '120px' },
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible' as const,
  } as SxProps<Theme>,

  thumbnailUploadArea: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E3F2FD',
    borderRadius: 'var(--border-radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    transition: 'border var(--transition-normal), box-shadow var(--transition-normal)',
    position: 'relative' as const,
  } as SxProps<Theme>,

  thumbnailLabel: {
    fontSize: '11px',
    fontWeight: 'var(--font-weight-medium)',
    color: 'rgba(0, 0, 0, 0.5)',
    textTransform: 'uppercase' as const,
    textAlign: 'center' as const,
    lineHeight: 1.4,
  } as SxProps<Theme>,

  plusButton: {
    position: 'absolute' as const,
    top: '-12px',
    right: '-12px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    zIndex: 2,
    cursor: 'pointer',
    border: 'none',
    padding: 0,
  } as SxProps<Theme>,

  fileInputOverlay: {
    position: 'absolute' as const,
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    opacity: 0,
    zIndex: 5,
    cursor: 'pointer',
    overflow: 'hidden' as const,
  } as SxProps<Theme>,

  removeButton: {
    position: 'absolute' as const,
    top: '8px',
    right: '8px',
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
    width: '24px',
    height: '24px',
    padding: 0,
    zIndex: 6,
    '&:hover': {
      backgroundColor: 'var(--color-gray-800)',
    },
  } as SxProps<Theme>,

  label: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-black)',
    marginBottom: 'var(--padding-sm)',
  } as SxProps<Theme>,

  input: {
    '& .MuiOutlinedInput-input': {
      fontSize: 'var(--font-size-md-1)',
      color: 'var(--color-gray-800)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-gray-200)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-gray-300)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-gray-400)',
    },
  } as SxProps<Theme>,

  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as SxProps<Theme>,

  toggleLabel: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-black)',
  } as SxProps<Theme>,

  addButton: {
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
    borderRadius: 'var(--border-radius-lg)',
    padding: 'var(--padding-md) var(--padding-xl)',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'none' as const,
    '&:not(:disabled)': {
      backgroundColor: 'var(--color-black)',
      color: 'var(--color-white)',
    },
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--color-gray-800, #333)',
      color: 'var(--color-white)',
    },
    '&.Mui-disabled': {
      backgroundColor: 'var(--color-gray-300)',
      color: 'var(--color-gray-500)',
    },
  } as SxProps<Theme>,

  hiddenFileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    opacity: 0,
    zIndex: 10,
  } as React.CSSProperties,
};
