import { SxProps, Theme } from '@mui/material';
import { sharedModalStyles } from '../shared/modalStyles';

export const embedModalStyles = {
  ...sharedModalStyles,
  
  modalContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-lg)',
  } as SxProps<Theme>,

  input: {
    ...sharedModalStyles.input,
  } as SxProps<Theme>,

  previewContainer: {
    backgroundColor: '#F0F4F8',
    borderRadius: 'var(--border-radius-md)',
    padding: 'var(--padding-md)',
    minHeight: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  } as SxProps<Theme>,

  sizeOptionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-sm)',
  } as SxProps<Theme>,

  sizeOption: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-sm)',
    padding: 'var(--padding-xs)',
    cursor: 'pointer',
  } as SxProps<Theme>,

  actionsContainer: {
    display: 'flex',
    gap: 'var(--padding-md)',
    justifyContent: 'flex-end',
    marginTop: 'var(--padding-md)',
  } as SxProps<Theme>,

  darkButton: {
    ...sharedModalStyles.darkButton,
  } as SxProps<Theme>,
};
