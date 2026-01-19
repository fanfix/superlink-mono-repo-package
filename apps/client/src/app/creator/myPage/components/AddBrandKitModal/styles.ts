import { SxProps, Theme } from '@mui/material';
import { sharedModalStyles } from '../shared/modalStyles';

export const AddBrandKitModalStyles = {
  ...sharedModalStyles,
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

  descriptionInput: {
    width: '100%',
    height: '120px',
    maxHeight: '120px',
    padding: 'var(--padding-md)',
    fontSize: 'var(--font-size-md-1)',
    color: 'var(--color-gray-800)',
    border: '1px solid var(--color-gray-200)',
    borderRadius: 'var(--border-radius-md)',
    fontFamily: 'inherit',
    resize: 'none' as const,
    overflow: 'auto',
    '&:focus': {
      outline: 'none',
      borderColor: 'var(--color-gray-400)',
    },
    '&::placeholder': {
      color: 'var(--color-gray-400)',
    },
  } as SxProps<Theme>,

  addButton: {
    width: '100%',
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
    borderRadius: 'var(--border-radius-2xl)',
    padding: 'var(--padding-md) var(--padding-xl)',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'none' as const,
    '&:hover': {
      backgroundColor: 'var(--color-gray-800)',
    },
  } as SxProps<Theme>,

  modalContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-xl)',
    overflow: 'visible',
  } as SxProps<Theme>,

  thumbnailWrapper: {
    padding: '12px',
    overflow: 'visible',
    display: 'flex',
    justifyContent: 'center',
  } as SxProps<Theme>,
};

