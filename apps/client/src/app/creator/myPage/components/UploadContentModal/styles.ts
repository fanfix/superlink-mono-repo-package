import { SxProps, Theme } from '@mui/material';

export const styles = {
  label: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-gray-700)',
    marginBottom: 'var(--padding-sm)',
  } as SxProps<Theme>,

  input: {
    width: '100%',
    '& .MuiOutlinedInput-input': {
      paddingTop: 'var(--padding-md)',
      paddingBottom: 'var(--padding-md)',
      paddingLeft: 'var(--padding-mypage-2xl)',
      paddingRight: 'var(--padding-mypage-2xl)',
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

  countdownInput: {
    flex: 1,
    '& .MuiOutlinedInput-input': {
      paddingTop: 'var(--padding-md)',
      paddingBottom: 'var(--padding-md)',
      paddingLeft: 'var(--padding-mypage-2xl)',
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

  titleInput: (titleColor: string) => ({
    width: '100%',
    '& .MuiOutlinedInput-input': {
      paddingTop: 'var(--padding-md)',
      paddingBottom: 'var(--padding-md)',
      paddingLeft: 'var(--padding-mypage-2xl)',
      paddingRight: 'var(--padding-mypage-9xl)',
      fontSize: 'var(--font-size-md-1)',
      color: titleColor,
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

  emojiButton: (isActive: boolean) => ({
    padding: 'var(--padding-mypage-xs)',
    minWidth: 'auto',
    width: 'var(--width-mypage-icon-xs)',
    height: 'var(--height-mypage-icon-xs)',
    color: 'var(--color-gray-500)',
    backgroundColor: isActive ? 'var(--color-gray-100)' : 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  }) as SxProps<Theme>,

  discountLink: {
    fontSize: 'var(--font-size-md)',
    color: 'var(--color-gray-700)',
    cursor: 'pointer',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
      color: 'var(--color-gray-900)',
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
    '&:disabled': {
      backgroundColor: 'var(--color-gray-300)',
      color: 'var(--color-gray-500)',
    },
  } as SxProps<Theme>,

  dragDropArea: (hasImage: boolean) => ({
    width: '100%',
    borderRadius: 4,
    border: 'var(--border-mypage-dashed) var(--color-mypage-text-gray-border-lighter)',
    backgroundColor: 'var(--color-mypage-background-gray-lighter)',
    padding: hasImage ? 2.5 : 4,
    cursor: hasImage ? 'default' : 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    overflow: 'hidden',
    '&:hover': {
      backgroundColor: hasImage ? 'var(--color-mypage-background-gray-lighter)' : 'var(--color-mypage-background-gray-light)',
      borderColor: hasImage ? 'var(--color-mypage-text-gray-border-lighter)' : 'var(--color-mypage-text-gray-border-light)',
    },
  }) as SxProps<Theme>,

  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 'var(--width-mypage-icon-xxxs)',
    height: 'var(--height-mypage-icon-xxxs)',
    backgroundColor: 'var(--color-mypage-overlay-dark-70)',
    color: 'var(--color-mypage-background-white-alt)',
    zIndex: 10,
    '&:hover': {
      backgroundColor: 'var(--color-mypage-overlay-dark-90)',
    },
  } as SxProps<Theme>,

  previewContainer: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: 'center',
    gap: 2,
  } as SxProps<Theme>,

  previewImageBox: {
    flex: 1,
    width: '100%',
    borderRadius: 'var(--border-radius-mypage-xs)',
    overflow: 'hidden',
    height: 'var(--height-mypage-image)',
    boxShadow: 'var(--shadow-onboarding-image)',
  } as SxProps<Theme>,

  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  } as SxProps<Theme>,

  arrowIndicator: {
    width: 'var(--width-mypage-profile-xxs)',
    height: 'var(--height-mypage-profile-xxs)',
    borderRadius: 'var(--border-radius-mypage-full)',
    border: 'var(--border-mypage-width-xs) solid var(--color-mypage-text-gray-border-lightest)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    color: 'var(--color-mypage-icon-gray)',
  } as SxProps<Theme>,

  blurredPreviewBox: {
    flex: 1,
    width: '100%',
    borderRadius: 'var(--border-radius-mypage-xs)',
    overflow: 'hidden',
    height: 210,
    position: 'relative',
    boxShadow: '0px 6px 35px rgba(17,17,17,0.2)',
  } as SxProps<Theme>,

  blurredPreviewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    filter: 'blur(10px)',
    transform: 'scale(1.1)',
  } as SxProps<Theme>,

  titleOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: 3,
  } as SxProps<Theme>,

  titleText: (color: string) => ({
    fontSize: 'var(--font-size-mypage-xl)',
    fontWeight: 600,
    textAlign: 'center',
    color,
    textShadow: 'var(--shadow-onboarding-text)',
    letterSpacing: -0.3,
    wordBreak: 'break-word',
  }) as SxProps<Theme>,

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  } as SxProps<Theme>,

  cropContainer: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
    gap: 2,
  } as SxProps<Theme>,

  cropArea: {
    position: 'relative',
    width: '100%',
    height: 'var(--height-onboarding-crop)',
    borderRadius: 'var(--border-radius-mypage-xs)',
    overflow: 'hidden',
    backgroundColor: 'var(--color-mypage-text-dark)',
  } as SxProps<Theme>,

  previewArea: {
    width: '100%',
    height: 'var(--height-onboarding-crop)',
    borderRadius: 'var(--border-radius-mypage-xs)',
    border: 'var(--border-mypage-width-xs) solid var(--color-onboarding-background-gray-lighter)',
    backgroundColor: 'var(--color-mypage-background-gray-lighter)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  } as SxProps<Theme>,

  zoomSlider: {
    color: 'var(--color-mypage-text-dark)',
    '& .MuiSlider-thumb': {
      width: 'var(--height-onboarding-slider-thumb)',
      height: 'var(--height-onboarding-slider-thumb)',
    },
    '& .MuiSlider-root': {
      overflow: 'visible',
    },
  } as SxProps<Theme>,

  emojiIcon: {
    fontSize: 'var(--font-size-mypage-lg)',
  } as SxProps<Theme>,

  colorIcon: {
    fontSize: 'var(--font-size-mypage-lg)',
  } as SxProps<Theme>,

  emojiPickerWrapper: {
    position: 'relative',
  } as SxProps<Theme>,

  colorPickerWrapper: {
    position: 'relative',
  } as SxProps<Theme>,
};

