import { SxProps, Theme } from '@mui/material';
import { sharedModalStyles } from '../shared/modalStyles';

export const socialLinkModalStyles = {
  ...sharedModalStyles,
  select: {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: 'var(--border-radius-md)',
      backgroundColor: 'var(--color-white)',
      '& fieldset': {
        borderColor: 'var(--color-gray-200)',
      },
      '&:hover fieldset': {
        borderColor: 'var(--color-gray-300)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--color-gray-400)',
      },
    },
    '& .MuiSelect-select': {
      padding: 'var(--padding-md)',
      fontSize: 'var(--font-size-md-1)',
    },
  } as SxProps<Theme>,

  urlInputWrapper: {
    position: 'relative' as const,
    width: '100%',
  } as SxProps<Theme>,

  urlPrefix: {
    position: 'absolute' as const,
    left: 'var(--padding-mypage-2xl)',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-gray-500)',
    zIndex: 1,
    pointerEvents: 'none' as const,
    borderRight: '1px solid var(--color-gray-200)',
    paddingRight: 'var(--padding-md)',
    maxWidth: 'calc(100% - 100px)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  } as SxProps<Theme>,

  urlInput: (prefixLength: number) => ({
    width: '100%',
    '& .MuiOutlinedInput-input': {
      paddingLeft: prefixLength > 0 ? `${prefixLength * 8 + 20}px` : 'var(--padding-mypage-2xl)',
      paddingTop: 'var(--padding-md)',
      paddingBottom: 'var(--padding-md)',
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
  }) as SxProps<Theme>,

  modalContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-xl)',
  } as SxProps<Theme>,
};

