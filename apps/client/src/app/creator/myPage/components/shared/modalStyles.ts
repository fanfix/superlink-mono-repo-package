import { SxProps, Theme } from '@mui/material';

/**
 * Shared modal styles used across all modals
 */
export const sharedModalStyles = {
  input: {
    width: '100%',
    '& .MuiOutlinedInput-input': {
      paddingTop: 'var(--padding-md)',
      paddingBottom: 'var(--padding-md)',
      paddingLeft: 'var(--padding-mypage-2xl)',
      paddingRight: 'var(--padding-mypage-2xl)',
      fontSize: 'var(--font-size-md-1)',
      color: 'var(--color-gray-800)',
      lineHeight: '1.5',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-gray-200)',
      borderWidth: 'var(--border-mypage-width-xs)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-gray-300)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-gray-400)',
    },
  } as SxProps<Theme>,

  textarea: {
    width: '100%',
    '& .MuiOutlinedInput-input': {
      paddingTop: 'var(--padding-md)',
      paddingBottom: 'var(--padding-md)',
      paddingLeft: 'var(--padding-mypage-2xl)',
      paddingRight: 'var(--padding-mypage-2xl)',
      fontSize: 'var(--font-size-md-1)',
      color: 'var(--color-gray-800)',
      lineHeight: '1.5',
      minHeight: 'var(--height-mypage-textarea-min)',
      resize: 'vertical' as const,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-gray-200)',
      borderWidth: 'var(--border-mypage-width-xs)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-gray-300)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-gray-400)',
    },
  } as SxProps<Theme>,

  label: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-gray-700)',
    marginBottom: 'var(--padding-sm)',
    lineHeight: '1.5',
  } as SxProps<Theme>,

  primaryButton: {
    width: '100%',
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
    borderRadius: 'var(--border-radius-2xl)',
    padding: 'var(--spacing-mypage-gap-lg) var(--padding-mypage-6xl)',
    fontSize: 'var(--font-size-mypage-sm)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'none' as const,
    minHeight: 'var(--height-mypage-button)',
    '&:hover': {
      backgroundColor: 'var(--color-mypage-background-gray-dark)',
    },
    '&:disabled': {
      backgroundColor: 'var(--color-mypage-background-gray-darker)',
      color: 'var(--color-mypage-text-gray-icon)',
      cursor: 'not-allowed',
    },
  } as SxProps<Theme>,

  darkButton: {
    width: '100%',
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
    borderRadius: 'var(--border-radius-2xl)',
    padding: 'var(--padding-md) var(--padding-xl)',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'none' as const,
    '&:not(:disabled)': {
      backgroundColor: 'var(--color-black)',
      color: 'var(--color-white)',
    },
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--color-mypage-text-dark-alt, #333)',
      color: 'var(--color-white)',
    },
    '&:disabled': {
      backgroundColor: 'var(--color-gray-300)',
      color: 'var(--color-gray-500)',
    },
  } as SxProps<Theme>,

  modalContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-xl)',
  } as SxProps<Theme>,

  modalContentContainerGap24: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-mypage-6xl)',
  } as SxProps<Theme>,

  actionsContainer: (isEditMode: boolean) => ({
    display: 'flex',
    gap: 'var(--padding-md)',
    flexDirection: isEditMode ? 'column' : 'row',
  }) as SxProps<Theme>,

  deleteButton: {
    width: '100%',
    backgroundColor: 'var(--color-mypage-background-red)',
    color: 'var(--color-white)',
    borderRadius: 'var(--border-radius-2xl)',
    padding: 'var(--spacing-mypage-gap-lg) var(--padding-mypage-6xl)',
    fontSize: 'var(--font-size-mypage-sm)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'none' as const,
    minHeight: 'var(--height-mypage-button)',
    '&:hover': {
      backgroundColor: 'var(--color-mypage-background-red-dark)',
    },
    '&:disabled': {
      backgroundColor: 'var(--color-mypage-background-gray-darker)',
      color: 'var(--color-mypage-text-gray-icon)',
      cursor: 'not-allowed',
    },
  } as SxProps<Theme>,

  deleteButtonOutline: {
    width: '100%',
    backgroundColor: 'transparent',
    color: 'var(--color-mypage-background-red)',
    border: 'var(--border-mypage-width-xs) solid var(--color-mypage-background-red)',
    borderRadius: 'var(--border-radius-2xl)',
    padding: 'var(--padding-md) var(--padding-xl)',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'none' as const,
    '&:hover': {
      backgroundColor: 'var(--color-mypage-background-red-light)',
    },
  } as SxProps<Theme>,

  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as SxProps<Theme>,

  toggleLabel: {
    fontSize: 'var(--font-size-md)',
    color: 'var(--color-gray-700)',
    fontWeight: 'var(--font-weight-normal)',
  } as SxProps<Theme>,

  helperText: {
    fontSize: 'var(--font-size-mypage-xs)',
    color: 'var(--color-gray-500)',
    marginTop: 'var(--spacing-mypage-gap-xs)',
  } as SxProps<Theme>,
};

