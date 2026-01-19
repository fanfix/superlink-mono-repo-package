import { SxProps, Theme } from '@mui/material';
import { sharedModalStyles } from '../shared/modalStyles';

export const embedModalStyles = {
  ...sharedModalStyles,
  layoutOptionsContainer: {
    display: 'flex',
    gap: 'var(--padding-md)',
    marginBottom: 'var(--padding-md)',
  } as SxProps<Theme>,

  layoutOptionCard: (isSelected: boolean) => ({
    flex: 1,
    padding: 'var(--padding-xl)',
    border: `2px solid ${isSelected ? 'var(--color-gray-900)' : 'var(--color-gray-200)'}`,
    borderRadius: 'var(--border-radius-md)',
    backgroundColor: 'var(--color-white)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--padding-md)',
    transition: 'all var(--transition-normal)',
    '&:hover': {
      borderColor: 'var(--color-gray-400)',
      backgroundColor: 'var(--color-gray-50)',
    },
  }) as SxProps<Theme>,

  layoutIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-gray-700)',
  } as SxProps<Theme>,

  layoutLabel: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-gray-900)',
  } as SxProps<Theme>,

  modalContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-xl)',
  } as SxProps<Theme>,
};

