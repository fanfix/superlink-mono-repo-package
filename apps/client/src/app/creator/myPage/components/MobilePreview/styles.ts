import { SxProps, Theme } from '@mui/material';

export const styles = {
  previewContainer: {
    position: { xs: 'relative' as const, md: 'sticky' as const },
    top: { xs: 0, md: 'var(--padding-3xl)' },
    width: '100%',
    maxWidth: { xs: '100%', md: 'var(--width-mypage-preview-max)' },
    height: { xs: '100%', md: 'calc(100vh - var(--height-mypage-viewport-offset))' },
    maxHeight: { xs: '100%', md: 'calc(100vh - var(--height-mypage-viewport-offset))' },
    marginTop: { xs: 0, md: 'var(--padding-3xl)' },
    marginBottom: { xs: 0, md: 'var(--padding-3xl)' },
    marginLeft: { xs: 0, md: 0 },
    marginRight: { xs: 0, md: 0 },
    padding: 0,
    boxSizing: 'border-box' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden' as const,
  } as SxProps<Theme>,

  mobileFrame: {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: 'var(--color-white)',
    borderRadius: { xs: 0, md: 'var(--border-radius-2xl)' },
    overflow: 'hidden' as const,
    boxShadow: 'none',
    height: { xs: '100%', md: '100%' },
    minHeight: { xs: 0, md: 'auto' },
    flex: { xs: 1, md: 'none' },
    display: 'flex',
    flexDirection: 'column' as const,
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    position: 'relative' as const,
    boxSizing: 'border-box' as const,
    margin: 0,
    padding: 0,
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  } as SxProps<Theme>,

  mobileContent: (
    backgroundColor: string,
    backgroundImage?: string,
    backgroundImageOpacity: number = 70,
    backgroundImageBlur: number = 0,
    backgroundImageAppearance: 'light' | 'dark' = 'light'
  ) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
    position: 'relative' as const,
    ...(backgroundImage && {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: backgroundImageOpacity / 100,
        filter: backgroundImageBlur > 0 ? `blur(${backgroundImageBlur}px)` : 'none',
        zIndex: 0,
        pointerEvents: 'none',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        backgroundColor: backgroundImageAppearance === 'light' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
        zIndex: 1,
        pointerEvents: 'none',
      },
    }),
  }) as SxProps<Theme>,

  /** Wraps all foreground content so it sits above blurred bg + overlay and stays sharp (no blur) */
  mobileContentForeground: {
    position: 'relative' as const,
    zIndex: 2,
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: 0,
  } as SxProps<Theme>,

  coverImageContainer: {
    position: 'relative' as const,
    width: '100%',
    height: 'var(--height-mypage-cover)',
    overflow: 'visible' as const,
    marginBottom: 'var(--height-mypage-cover-margin)',
    backgroundColor: 'transparent',
    zIndex: 1,
  } as SxProps<Theme>,

  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    position: 'relative' as const,
    zIndex: 1,
  } as SxProps<Theme>,

  shareButton: {
    position: 'absolute' as const,
    top: 'var(--spacing-gap-lg)',
    right: 'var(--spacing-gap-lg)',
    width: 'var(--size-icon-3xl)',
    height: 'var(--size-icon-3xl)',
    borderRadius: '50%',
    backgroundColor: 'var(--color-white-overlay-90)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 2,
  } as SxProps<Theme>,

  bottomBlurGradient: (backgroundColor: string, hasBackgroundImage?: boolean) => ({
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 'var(--height-blur-overlay)',
    background: hasBackgroundImage
      ? `linear-gradient(to bottom, transparent 0%, var(--color-white-overlay-30) 100%)`
      : `linear-gradient(to bottom, transparent 0%, ${backgroundColor} 100%)`,
    zIndex: 1,
    pointerEvents: 'none' as const,
  }) as SxProps<Theme>,

  profileImageContainer: {
    position: 'absolute' as const,
    width: 'var(--width-mypage-profile-large)',
    height: 'var(--height-mypage-profile-large)',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 2,
  } as SxProps<Theme>,

  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    border: '4px solid var(--color-white)',
    backgroundColor: 'var(--color-gray-200)',
    boxShadow: '0 2px 8px var(--color-black-overlay-20)',
  } as SxProps<Theme>,

  // Layout 1: Name below centered profile image (user's text color + font)
  pageNameLayout1: (selectedTextColor: string, fontFamily: string) => ({
    position: 'absolute' as const,
    top: 'calc(50% + 50px)',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: { xs: 'var(--font-size-mypage-2xl)', md: 'var(--font-size-mypage-xl)' },
    fontWeight: 'var(--font-weight-bold)',
    color: selectedTextColor,
    fontFamily: fontFamily,
    marginBottom: 0,
    textShadow: 'var(--text-shadow-sm)',
    zIndex: 2,
    whiteSpace: 'nowrap' as const,
    width: '100%',
    textAlign: 'center' as const,
  }) as SxProps<Theme>,

  // Layout 1: Intro message below name
  introMessageLayout1: (selectedTextColor: string, fontFamily: string) => ({
    position: 'absolute' as const,
    top: 'calc(50% + 80px)',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 'var(--font-size-mypage-sm)',
    fontWeight: 'var(--font-weight-normal)',
    color: selectedTextColor,
    textShadow: 'var(--text-shadow-sm)',
    zIndex: 2,
    width: '90%',
    maxWidth: 'var(--width-mypage-content-max)',
    textAlign: 'center' as const,
    fontFamily: fontFamily,
    '& p': {
      margin: '4px 0',
    },
    '& *': {
      color: 'inherit',
      fontFamily: 'inherit',
    },
  }) as SxProps<Theme>,
  layout2OverlayContainer: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--padding-md)',
    zIndex: 2,
    width: 'auto',
    maxWidth: '90%',
  } as SxProps<Theme>,

  // Layout 2: Profile image container (left side)
  profileImageContainerLayout2: {
    width: 'var(--width-mypage-profile-medium)',
    height: 'var(--height-mypage-profile-medium)',
    flexShrink: 0,
  } as SxProps<Theme>,
  // Layout 2: Right container for name and intro message
  layout2RightContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 0,
    flex: 1,
  } as SxProps<Theme>,

  // Layout 2: Name on right side
  pageNameLayout2: (selectedTextColor: string, fontFamily: string) => ({
    fontSize: { xs: 'var(--font-size-mypage-xl)', md: 'var(--font-size-mypage-lg)' },
    fontWeight: 'var(--font-weight-bold)',
    color: selectedTextColor,
    fontFamily: fontFamily,
    textShadow: 'var(--text-shadow-sm)',
    whiteSpace: 'nowrap' as const,
  }) as SxProps<Theme>,

  // Layout 2: Intro message below name
  introMessageLayout2: (selectedTextColor: string, fontFamily: string) => ({
    fontSize: 'var(--font-size-mypage-sm)',
    fontWeight: 'var(--font-weight-normal)',
    color: selectedTextColor,
    textShadow: 'var(--text-shadow-sm)',
    width: '100%',
    maxWidth: 'var(--width-mypage-content-max-alt)',
    textAlign: 'left' as const,
    fontFamily: fontFamily,
    marginTop: 0,
    '& p': {
      margin: 0,
    },
    '& *': {
      color: 'inherit',
      fontFamily: 'inherit',
    },
  }) as SxProps<Theme>,

  socialIconsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-mypage-gap-md)',
    marginTop: '-110px',
    marginBottom: 'var(--padding-lg)',
    zIndex: 2,
    position: 'relative' as const,
    flexWrap: 'wrap' as const,
    maxWidth: '90%',
    margin: '-110px auto var(--padding-lg) auto',
  } as SxProps<Theme>,

  // Theme-aware: light bg → black circle + white icon; dark bg → white circle + black icon (matches main site profile-theme-link)
  socialIconCircle: (isDarkBg: boolean) => ({
    width: 'var(--width-mypage-icon-medium)',
    height: 'var(--height-mypage-icon-medium)',
    borderRadius: '50%',
    backgroundColor: isDarkBg ? 'var(--color-white)' : '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    boxShadow: isDarkBg ? '0 2px 8px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.2)',
    textDecoration: 'none',
    color: isDarkBg ? 'var(--color-black)' : 'var(--color-white)',
    '& svg': {
      fontSize: 'var(--size-icon-md)',
      width: 'var(--size-icon-md)',
      height: 'var(--size-icon-md)',
      color: 'inherit',
      fill: 'currentColor',
    },
    '& .MuiSvgIcon-root': {
      color: 'inherit',
      fill: 'currentColor',
    },
  }) as SxProps<Theme>,

  customButtonsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 'var(--padding-md)',
    padding: '0 var(--padding-lg)',
    marginTop: 'var(--padding-md)',
    marginBottom: 'var(--padding-lg)',
  } as SxProps<Theme>,

  customButton: {
    width: '100%',
    maxWidth: 'var(--width-mypage-content-max)',
    backgroundColor: 'var(--color-white-overlay-85)',
    color: 'var(--color-black)',
    borderRadius: 'var(--border-radius-mypage-pill)', // Pill-shaped (fully rounded)
    padding: 'var(--padding-md) var(--padding-xl)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'var(--border-solid-black-light)',
    boxShadow: 'var(--shadow-xs)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: 'var(--color-white-overlay-95)',
      boxShadow: 'var(--shadow-md-15)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
  } as SxProps<Theme>,

  customButtonText: {
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-black)',
    textAlign: 'center' as const,
  } as SxProps<Theme>,

  contentArea: {
    padding: 'var(--padding-lg)',
    backgroundColor: 'transparent',
    flex: 1,
    paddingTop: 0,
    position: 'relative' as const,
    zIndex: 1,
  } as SxProps<Theme>,

  // Replicate profile CTA bar (light gray bar, left text, right button)
  replicateCtaContainer: (isDarkBg: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--padding-md)',
    padding: 'var(--padding-lg) var(--padding-xl)',
    margin: '0 var(--padding-lg) var(--padding-md)',
    backgroundColor: isDarkBg ? 'rgba(255,255,255,0.12)' : 'rgb(240, 240, 240)',
    borderRadius: 'var(--border-radius-lg)',
    position: 'relative' as const,
    zIndex: 2,
  } as SxProps<Theme>),
  replicateCtaLabels: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
  } as SxProps<Theme>,
  replicateCtaLine1: (isDarkBg: boolean) => ({
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    color: isDarkBg ? 'rgba(255,255,255,0.8)' : 'var(--color-gray-600)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.02em',
    lineHeight: 1.2,
  } as SxProps<Theme>),
  replicateCtaLine2: (isDarkBg: boolean) => ({
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-bold)',
    color: isDarkBg ? 'var(--color-white)' : 'var(--color-gray-800)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.02em',
    lineHeight: 1.2,
  } as SxProps<Theme>),
  replicateCtaButton: (isDarkBg: boolean) => ({
    flexShrink: 0,
    padding: 'var(--padding-sm) var(--padding-lg)',
    backgroundColor: isDarkBg ? 'var(--color-white)' : 'rgb(80, 80, 80)',
    color: isDarkBg ? 'var(--color-black)' : 'var(--color-white)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.02em',
    borderRadius: 'var(--border-radius-md)',
    border: isDarkBg ? '2px solid var(--color-white)' : '2px solid var(--color-black)',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    '&:hover': {
      backgroundColor: isDarkBg ? 'rgba(255,255,255,0.9)' : 'rgb(60, 60, 60)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
  } as SxProps<Theme>),

  createOwnPageLinkWrap: {
    display: 'flex',
    justifyContent: 'center',
    padding: '0 var(--padding-lg) var(--padding-2xl)',
  } as SxProps<Theme>,
  createOwnPageLink: (isDarkBg: boolean) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--padding-md) var(--padding-xl)',
    backgroundColor: isDarkBg ? 'rgba(255,255,255,0.15)' : 'var(--color-white)',
    color: isDarkBg ? 'var(--color-white)' : 'var(--color-black)',
    border: isDarkBg ? '2px solid var(--color-white)' : '2px solid var(--color-black)',
    borderRadius: 'var(--border-radius-lg)',
    cursor: 'pointer',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.02em',
    boxShadow: isDarkBg ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
    textDecoration: 'none',
    transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
    '&:hover': {
      backgroundColor: isDarkBg ? 'rgba(255,255,255,0.25)' : 'var(--color-gray-100)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
  } as SxProps<Theme>),

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--padding-xl) var(--padding-lg)',
    marginTop: 'auto',
    paddingBottom: 'var(--padding-2xl)',
    position: 'relative' as const,
    zIndex: 2,
  } as SxProps<Theme>,

  footerLogo: (isDarkBg: boolean) => ({
    height: 'var(--height-mypage-icon-xs)',
    width: 'auto',
    opacity: 0.9,
    filter: isDarkBg ? 'invert(1) brightness(2)' : 'none',
  } as SxProps<Theme>),

  // Layout 1: Profile image centered, name below (vertical layout)
  layout1Container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--padding-md)',
    padding: 'var(--padding-xl)',
    marginBottom: 'var(--padding-lg)',
    width: '100%',
  } as SxProps<Theme>,

  layout1Image: {
    width: 'var(--width-mypage-profile-large)',
    height: 'var(--height-mypage-profile-large)',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    border: '3px solid var(--color-white)',
    boxShadow: '0 2px 8px var(--color-black-overlay-10)',
    backgroundColor: 'var(--color-gray-200)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as SxProps<Theme>,

  layout1Name: (selectedTextColor: string, fontFamily: string) => ({
    fontSize: 'var(--font-size-mypage-xl)',
    fontWeight: 'var(--font-weight-bold)',
    color: selectedTextColor,
    fontFamily: fontFamily,
    textAlign: 'center' as const,
  }) as SxProps<Theme>,

  // Layout 2: Profile image left, name right (horizontal layout)
  layout2Container: {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 'var(--padding-md)',
    padding: 'var(--padding-xl)',
    marginBottom: 'var(--padding-lg)',
    width: '100%',
  } as SxProps<Theme>,

  layout2Image: {
    width: 'var(--width-mypage-profile-medium)',
    height: 'var(--height-mypage-profile-medium)',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    border: '3px solid var(--color-white)',
    boxShadow: '0 2px 8px var(--color-black-overlay-10)',
    flexShrink: 0,
    backgroundColor: 'var(--color-gray-200)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as SxProps<Theme>,

  layout2Name: (selectedTextColor: string, fontFamily: string) => ({
    flex: 1,
    fontSize: 'var(--font-size-mypage-lg)',
    fontWeight: 'var(--font-weight-bold)',
    color: selectedTextColor,
    fontFamily: fontFamily,
  }) as SxProps<Theme>,

  coverImageTransparent: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    position: 'relative' as const,
    zIndex: 1,
    backgroundColor: 'transparent',
  } as SxProps<Theme>,

  profileImageCentered: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    border: '4px solid var(--color-white)',
    backgroundColor: 'var(--color-gray-200)',
    boxShadow: '0 2px 8px var(--color-black-overlay-20)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as SxProps<Theme>,

  shareIcon: {
    fontSize: 'var(--font-size-mypage-lg)',
    color: 'var(--color-gray-700)',
  } as SxProps<Theme>,

  userIconImage: {
    width: 'var(--width-mypage-profile-xs)',
    height: 'var(--height-mypage-profile-xs)',
    objectFit: 'contain',
  } as React.CSSProperties,
};
