import { SxProps, Theme } from '@mui/material';

export const styles = {
  container: {
    position: 'relative' as const,
  } as SxProps<Theme>,

  imageUploadContainer: {
    width: '70px',
    height: '70px',
    border: '2px dashed var(--color-gray-300)',
    borderRadius: 'var(--border-radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-gray-50)',
    cursor: 'pointer',
    transition: 'all var(--transition-normal)',
    '&:hover': {
      borderColor: 'var(--color-blue)',
      backgroundColor: 'var(--color-gray-100)',
    },
  } as SxProps<Theme>,

  imageContainer: {
    position: 'relative' as const,
    width: '70px',
    height: '70px',
    borderRadius: 'var(--border-radius-md)',
    overflow: 'hidden' as const,
    border: '1px solid var(--color-gray-200)',
  } as SxProps<Theme>,

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  } as SxProps<Theme>,

  removeButton: {
    position: 'absolute' as const,
    top: '4px',
    right: '4px',
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
    width: '20px',
    height: '20px',
    padding: 0,
    '&:hover': {
      backgroundColor: 'var(--color-gray-800)',
    },
  } as SxProps<Theme>,
};

