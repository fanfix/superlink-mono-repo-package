import { SxProps, Theme } from '@mui/material';

export const styles = {
  exclusiveContentSection: {
    padding: 'var(--padding-lg)',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row' as const,
    gap: 'var(--padding-md)',
    overflowX: 'auto' as const,
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    cursor: 'grab' as const,
    userSelect: 'none' as const,
    scrollBehavior: 'smooth' as const,
    scrollSnapType: 'x mandatory' as const,
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '&:active': {
      cursor: 'grabbing' as const,
    },
  } as SxProps<Theme>,

  unlockCard: {
    backgroundColor: 'var(--color-black-overlay-60)',
    borderRadius: 'var(--border-radius-md)',
    overflow: 'hidden' as const,
    marginBottom: 'var(--padding-md)',
    minWidth: 'var(--width-card-min)',
    flexShrink: 0,
    backdropFilter: 'blur(10px)',
    scrollSnapAlign: 'start' as const,
  } as SxProps<Theme>,

  unlockHeader: {
    padding: 'var(--padding-lg-1)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 'var(--spacing-gap-lg)',
  } as SxProps<Theme>,

  unlockLeft: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--spacing-gap-sm)',
    flex: 1,
  } as SxProps<Theme>,

  unlockTitle: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-white)',
    marginBottom: 0,
  } as SxProps<Theme>,

  unlockDateContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-gap-xs)',
  } as SxProps<Theme>,

  greenDot: {
    width: 'var(--size-icon-xs)',
    height: 'var(--size-icon-xs)',
    borderRadius: '50%',
    backgroundColor: 'var(--color-success-green)',
  } as SxProps<Theme>,

  unlockDate: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-gray-400)',
    fontWeight: 'var(--font-weight-normal)',
  } as SxProps<Theme>,

  linkButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-gap-xs)',
    padding: 'var(--padding-md) var(--padding-lg-1)',
    backgroundColor: 'var(--color-success-green)',
    borderRadius: 'var(--border-radius-lg)',
    cursor: 'pointer',
    border: 'none',
    color: 'var(--color-black)',
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-semibold)',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  } as SxProps<Theme>,

  blurredContentContainer: {
    width: '100%',
    minHeight: 'var(--height-content-min)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    backgroundColor: 'var(--color-pink-accent)',
  } as SxProps<Theme>,

  blurredCoverImage: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    filter: 'blur(12px)',
    WebkitFilter: 'blur(12px)',
    transform: 'scale(1.1)',
  } as SxProps<Theme>,

  blurredOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--color-pink-accent)',
    zIndex: 1,
    opacity: 0.7,
  } as SxProps<Theme>,

  blurredPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--color-pink-accent)',
  } as SxProps<Theme>,

  blurredContentText: {
    position: 'absolute' as const,
    inset: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    padding: 'var(--padding-lg)',
  } as SxProps<Theme>,

  blurredTitle: {
    fontSize: 'var(--font-size-lg)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-white)',
    textAlign: 'center' as const,
    textShadow: 'var(--text-shadow-lg)',
    marginBottom: 'var(--spacing-gap-sm)',
  } as SxProps<Theme>,

  blurredSubtitle: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-white)',
    textAlign: 'center' as const,
    textShadow: 'var(--text-shadow-lg)',
  } as SxProps<Theme>,

  customSection: {
    padding: 'var(--padding-lg)',
    marginBottom: 'var(--padding-md)',
  } as SxProps<Theme>,

  customSectionName: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'inherit',
    marginBottom: 'var(--padding-md)',
    textTransform: 'uppercase' as const,
  } as SxProps<Theme>,

  customSectionList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--padding-md)',
    width: '100%',
    boxSizing: 'border-box' as const,
  } as SxProps<Theme>,

  customSectionListItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'stretch',
    borderRadius: 'var(--border-radius-md)',
    overflow: 'hidden' as const,
    padding: 0,
    cursor: 'pointer',
  } as SxProps<Theme>,
  customSectionListItemThemed: (isDarkBg: boolean, isBlackBg?: boolean) => {
    const useGray = isDarkBg && isBlackBg;
    return {
      ...styles.customSectionListItem,
      backgroundColor: useGray ? 'var(--color-gray-100)' : isDarkBg ? 'rgba(255,255,255,0.08)' : 'var(--color-black-overlay-5, rgba(0,0,0,0.05))',
      borderBottom: useGray ? '1px solid var(--color-gray-200)' : isDarkBg ? '1px solid rgba(255,255,255,0.12)' : '1px solid var(--color-gray-200, rgba(0,0,0,0.08))',
      color: useGray ? 'var(--color-black)' : isDarkBg ? 'var(--color-white)' : 'inherit',
    } as SxProps<Theme>;
  },

  customSectionListImageWrap: {
    position: 'relative' as const,
    flexShrink: 0,
    width: 112,
    height: 112,
    minWidth: 112,
    minHeight: 112,
    padding: 0,
    overflow: 'hidden' as const,
  } as SxProps<Theme>,

  customSectionListContent: {
    flex: 1,
    minWidth: 0,
    padding: 'var(--padding-md) var(--padding-lg-1)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  } as SxProps<Theme>,

  customSectionListImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    display: 'block' as const,
    padding: 0,
    margin: 0,
  } as SxProps<Theme>,

  customSectionListTitleOverlay: {
    position: 'absolute' as const,
    bottom: 'var(--spacing-gap-sm)',
    left: 'var(--spacing-gap-sm)',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-white)',
    textShadow: 'var(--text-shadow-sm)',
    zIndex: 2,
    maxWidth: 'calc(100% - 60px)',
  } as SxProps<Theme>,

  customSectionListLinkIcon: {
    position: 'absolute' as const,
    top: 8,
    right: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    backgroundColor: 'var(--color-white)',
    borderRadius: '50%',
    color: 'var(--color-black)',
    boxShadow: 'var(--shadow-sm-15)',
    zIndex: 30,
    '&:hover': {
      backgroundColor: 'var(--color-white)',
      boxShadow: 'var(--shadow-md-15)',
    },
  } as SxProps<Theme>,

  customSectionListItemFallback: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-md)',
    padding: 'var(--padding-md)',
    border: '1px solid transparent',
    borderRadius: 'var(--border-radius-md)',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  } as SxProps<Theme>,
  customSectionListItemFallbackThemed: (isDarkBg: boolean, isBlackBg?: boolean) => {
    const useGray = isDarkBg && isBlackBg;
    return {
      ...styles.customSectionListItemFallback,
      backgroundColor: useGray ? 'var(--color-gray-100)' : isDarkBg ? 'rgba(255,255,255,0.08)' : 'var(--color-white)',
      border: useGray ? '1px solid var(--color-gray-200)' : isDarkBg ? '1px solid rgba(255,255,255,0.12)' : '1px solid var(--color-gray-200)',
      color: useGray ? 'var(--color-black)' : isDarkBg ? 'var(--color-white)' : 'var(--color-black)',
      '&:hover': {
        backgroundColor: useGray ? 'var(--color-gray-200)' : isDarkBg ? 'rgba(255,255,255,0.12)' : 'var(--color-gray-50)',
      },
    } as SxProps<Theme>;
  },

  customSectionListIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: 'var(--size-icon-xl)',
    height: 'var(--size-icon-xl)',
  } as SxProps<Theme>,

  customSectionItemImage: {
    width: 'var(--width-mypage-profile-small)',
    height: 'var(--height-mypage-profile-small)',
    borderRadius: 'var(--border-radius-sm)',
    objectFit: 'cover' as const,
    flexShrink: 0,
  } as SxProps<Theme>,

  customSectionItemImagePlaceholder: {
    width: 'var(--width-mypage-profile-small)',
    height: 'var(--height-mypage-profile-small)',
    borderRadius: 'var(--border-radius-sm)',
    backgroundColor: 'var(--color-gray-200)',
    flexShrink: 0,
  } as SxProps<Theme>,

  customSectionItemContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    gap: 'var(--spacing-mypage-gap-xs)',
  } as SxProps<Theme>,

  customSectionItemTitle: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-black)',
    whiteSpace: 'normal' as const,
    wordBreak: 'break-word' as const,
    display: '-webkit-box' as const,
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  } as SxProps<Theme>,

  customSectionItemPrice: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-gray-600)',
  } as SxProps<Theme>,

  customSectionLinkIcon: {
    position: 'absolute' as const,
    top: 'var(--padding-md)',
    right: 'var(--padding-md)',
    padding: 'var(--spacing-gap-sm)',
    backgroundColor: 'var(--color-white)',
    borderRadius: '50%',
    border: 'var(--border-solid-black-light)',
    boxShadow: 'var(--shadow-xs)',
    flexShrink: 0,
    '&:hover': {
      backgroundColor: 'var(--color-white)',
      boxShadow: 'var(--shadow-sm-15)',
    },
  } as SxProps<Theme>,

  customSectionRowLinkIcon: {
    position: 'absolute' as const,
    top: 8,
    right: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    backgroundColor: 'var(--color-white)',
    borderRadius: '50%',
    color: 'var(--color-black)',
    boxShadow: 'var(--shadow-sm-15)',
    zIndex: 30,
    '&:hover': {
      backgroundColor: 'var(--color-white)',
      boxShadow: 'var(--shadow-md-15)',
    },
  } as SxProps<Theme>,

  customSectionParallelLinkIcon: {
    position: 'absolute' as const,
    top: 'var(--spacing-gap-sm)',
    right: 'var(--spacing-gap-sm)',
    backgroundColor: 'var(--color-white-overlay-95)',
    padding: 'var(--spacing-gap-xs)',
    borderRadius: '50%',
    boxShadow: 'var(--shadow-sm-15)',
    '&:hover': {
      backgroundColor: 'var(--color-white)',
      boxShadow: 'var(--shadow-md-15)',
    },
    zIndex: 2,
  } as SxProps<Theme>,

  customSectionRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 6,
    width: '100%',
    padding: 0,
    margin: 0,
    boxSizing: 'border-box' as const,
  } as SxProps<Theme>,

  customSectionRowItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
    padding: 0,
    margin: 0,
    borderRadius: 'var(--border-radius-sm)',
    overflow: 'hidden' as const,
    position: 'relative' as const,
    aspectRatio: '3/4',
  } as SxProps<Theme>,

  customSectionRowImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'block' as const,
    padding: 0,
    margin: 0,
    boxSizing: 'border-box' as const,
  } as SxProps<Theme>,

  customSectionRowTitle: {
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-black)',
    textAlign: 'center' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  } as SxProps<Theme>,

  customSectionRowTitleOverlay: {
    position: 'absolute' as const,
    bottom: 'var(--spacing-gap-sm)',
    left: 'var(--spacing-gap-sm)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-white)',
    textShadow: 'var(--text-shadow-sm)',
    zIndex: 2,
    maxWidth: 'calc(100% - var(--padding-lg-1))',
  } as SxProps<Theme>,

  customSectionParallel: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--padding-sm)',
    width: '100%',
    boxSizing: 'border-box' as const,
  } as SxProps<Theme>,

  customSectionParallelItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-sm)',
    padding: 'var(--padding-md)',
    borderRadius: 'var(--border-radius-md)',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    flex: 1,
    minWidth: 0,
    overflow: 'hidden' as const,
  } as SxProps<Theme>,
  customSectionParallelItemThemed: (isDarkBg: boolean, isBlackBg?: boolean) => {
    const useGray = isDarkBg && isBlackBg;
    return {
      ...styles.customSectionParallelItem,
      backgroundColor: useGray ? 'var(--color-gray-100)' : isDarkBg ? 'rgba(255,255,255,0.08)' : 'var(--color-gray-100)',
      color: useGray ? 'var(--color-black)' : isDarkBg ? 'var(--color-white)' : 'var(--color-black)',
      '&:hover': {
        backgroundColor: useGray ? 'var(--color-gray-200)' : isDarkBg ? 'rgba(255,255,255,0.12)' : 'var(--color-gray-200)',
      },
    } as SxProps<Theme>;
  },

  customSectionParallelImage: {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    borderRadius: 'var(--border-radius-sm)',
    objectFit: 'cover' as const,
    flexShrink: 0,
    display: 'block' as const,
    padding: 0,
    margin: 0,
  } as SxProps<Theme>,

  customSectionParallelImagePlaceholder: {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    borderRadius: 'var(--border-radius-sm)',
    backgroundColor: 'var(--color-gray-200)',
    flexShrink: 0,
  } as SxProps<Theme>,

  customSectionParallelIcon: {
    position: 'absolute' as const,
    top: 'var(--spacing-mypage-gap-xs)',
    right: 'var(--spacing-mypage-gap-xs)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-white-overlay-95)',
    padding: 'var(--padding-mypage-xs)',
    borderRadius: '50%',
    boxShadow: 'var(--shadow-sm-15)',
    zIndex: 2,
    width: 'var(--size-icon-lg)',
    height: 'var(--size-icon-lg)',
    '&:hover': {
      backgroundColor: 'var(--color-white)',
      boxShadow: 'var(--shadow-md-15)',
    },
  } as SxProps<Theme>,

  customSectionParallelContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    gap: 'var(--spacing-mypage-gap-xs)',
    minWidth: 0,
  } as SxProps<Theme>,

  customSectionParallelTitle: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-black)',
    whiteSpace: 'normal' as const,
    wordBreak: 'break-word' as const,
    display: '-webkit-box' as const,
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  } as SxProps<Theme>,

  customSectionParallelUrl: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-gray-600)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal' as const,
    wordBreak: 'break-word' as const,
    display: '-webkit-box' as const,
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
  } as SxProps<Theme>,

  customSectionParallelTitleOverlay: {
    position: 'absolute' as const,
    bottom: 'var(--spacing-mypage-gap-md)',
    left: 'var(--spacing-mypage-gap-md)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-mypage-background-white)',
    textShadow: 'var(--shadow-mypage-text)',
    zIndex: 2,
    maxWidth: 'calc(100% - 16px)',
  } as SxProps<Theme>,

  /** Compact layout for public username page only (3 cols, smaller gap/size). Mypage keeps default. */
  customSectionRowCompact: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 4,
    width: '100%',
    padding: 0,
    margin: 0,
    boxSizing: 'border-box' as const,
  } as SxProps<Theme>,
  customSectionRowItemCompact: {
    aspectRatio: '1/1',
  } as SxProps<Theme>,
  customSectionParallelCompact: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 4,
    width: '100%',
    boxSizing: 'border-box' as const,
  } as SxProps<Theme>,
  customSectionParallelItemCompact: {
    gap: 'var(--spacing-mypage-gap-xs)',
    padding: 'var(--padding-sm)',
  } as SxProps<Theme>,
  customSectionParallelImageCompact: {
    width: 36,
    height: 36,
    minWidth: 36,
    minHeight: 36,
  } as SxProps<Theme>,
  customSectionParallelImagePlaceholderCompact: {
    width: 36,
    height: 36,
    minWidth: 36,
    minHeight: 36,
  } as SxProps<Theme>,

  textSection: {
    padding: 'var(--padding-lg)',
    marginBottom: 'var(--padding-md)',
    borderRadius: 'var(--border-radius-md)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    textAlign: 'center' as const,
    gap: 'var(--spacing-mypage-gap-xs)',
  } as SxProps<Theme>,
  textSectionThemed: (isDarkBg: boolean, isBlackBg?: boolean) => {
    const useGray = isDarkBg && isBlackBg;
    return {
      ...styles.textSection,
      backgroundColor: useGray ? 'var(--color-gray-100)' : isDarkBg ? 'rgba(255,255,255,0.08)' : 'var(--color-gray-100)',
      color: useGray ? 'var(--color-black)' : isDarkBg ? 'var(--color-white)' : 'var(--color-black)',
    } as SxProps<Theme>;
  },

  textSectionTitle: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-black)',
    margin: 0,
  } as SxProps<Theme>,

  textSectionContent: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-normal)',
    color: 'var(--color-black)',
    margin: 0,
  } as SxProps<Theme>,

  emailSection: {
    padding: 'var(--padding-lg)',
    marginBottom: 'var(--padding-md)',
  } as SxProps<Theme>,
  emailSectionThemed: (isDarkBg: boolean, isBlackBg?: boolean) => {
    const useGray = isDarkBg && isBlackBg;
    return {
      ...styles.emailSection,
      color: useGray ? 'var(--color-black)' : isDarkBg ? 'var(--color-white)' : 'var(--color-black)',
    } as SxProps<Theme>;
  },

  emailSectionTitle: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-normal)',
    padding: 'var(--padding-md)',
    borderRadius: 'var(--border-radius-md)',
    marginBottom: 'var(--padding-sm)',
    width: '100%',
  } as SxProps<Theme>,
  emailSectionTitleThemed: (isDarkBg: boolean, isBlackBg?: boolean) => {
    const useGray = isDarkBg && isBlackBg;
    return {
      ...styles.emailSectionTitle,
      backgroundColor: useGray ? 'var(--color-gray-100)' : isDarkBg ? 'rgba(255,255,255,0.08)' : 'var(--color-gray-100)',
      color: useGray ? 'var(--color-black)' : isDarkBg ? 'var(--color-white)' : 'var(--color-black)',
    } as SxProps<Theme>;
  },

  emailInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-xs)',
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--border-radius-md)',
    border: '1px solid var(--color-gray-300)',
    padding: '4px 4px 4px var(--padding-sm)',
    position: 'relative' as const,
    marginTop: 'var(--padding-xs)',
  } as SxProps<Theme>,

  emailInputIcon: {
    fontSize: 'var(--font-size-mypage-xl)',
    color: 'var(--color-gray-500)',
    flexShrink: 0,
  } as SxProps<Theme>,

  emailInput: {
    flex: 1,
    '& .MuiOutlinedInput-input': {
      padding: 'var(--padding-sm) 0',
      fontSize: 'var(--font-size-sm)',
      color: 'var(--color-black)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  } as SxProps<Theme>,

  emailSubmitButton: {
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
    width: 'var(--width-mypage-icon-xxxs)',
    height: 'var(--height-mypage-icon-xxxs)',
    minWidth: 'var(--width-mypage-icon-xxxs)',
    padding: 0,
    flexShrink: 0,
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: 'var(--color-gray-800)',
    },
    '&.Mui-disabled': {
      backgroundColor: 'var(--color-gray-300)',
      color: 'var(--color-gray-500)',
    },
  } as SxProps<Theme>,

  brandKitSection: {
    padding: 'var(--padding-lg)',
    marginBottom: 'var(--padding-md)',
  } as SxProps<Theme>,
  brandKitSectionThemed: (isDarkBg: boolean, isBlackBg?: boolean) => {
    const useGray = isDarkBg && isBlackBg;
    return {
      ...styles.brandKitSection,
      color: useGray ? 'var(--color-black)' : isDarkBg ? 'var(--color-white)' : 'var(--color-black)',
    } as SxProps<Theme>;
  },

  brandKitItemContainer: {
    padding: 'var(--padding-lg)',
    borderRadius: 'var(--border-radius-md)',
    marginBottom: 'var(--padding-md)',
  } as SxProps<Theme>,
  brandKitItemContainerThemed: (isDarkBg: boolean, isBlackBg?: boolean) => {
    const useGray = isDarkBg && isBlackBg;
    return {
      ...styles.brandKitItemContainer,
      backgroundColor: useGray ? 'var(--color-gray-100)' : isDarkBg ? 'rgba(255,255,255,0.08)' : 'var(--color-gray-100)',
      color: useGray ? 'var(--color-black)' : isDarkBg ? 'var(--color-white)' : 'var(--color-black)',
    } as SxProps<Theme>;
  },

  brandKitHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-md)',
    marginBottom: 'var(--padding-md)',
  } as SxProps<Theme>,

  brandKitLogo: {
    width: 'var(--width-mypage-profile-small)',
    height: 'var(--height-mypage-profile-small)',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    flexShrink: 0,
  } as SxProps<Theme>,

  brandKitTitle: {
    fontSize: 'var(--font-size-lg)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-black)',
  } as SxProps<Theme>,

  brandKitDescription: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-normal)',
    color: 'var(--color-black)',
    marginBottom: 'var(--padding-md)',
  } as SxProps<Theme>,

  engagementsContainer: {
    display: 'flex',
    flexDirection: 'row' as const,
    gap: 'var(--padding-md)',
    flexWrap: 'wrap' as const,
  } as SxProps<Theme>,

  engagementItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 'var(--padding-xs)',
  } as SxProps<Theme>,

  engagementCountBadge: {
    width: 'var(--width-mypage-profile-xs)',
    height: 'var(--height-mypage-profile-xs)',
    borderRadius: 'var(--border-radius-mypage-full)',
    border: 'var(--border-mypage-width-xs) solid var(--color-mypage-text-gray-border-alt)',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 'var(--padding-xs)',
  } as SxProps<Theme>,

  engagementCountText: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-black)',
  } as SxProps<Theme>,

  engagementTitleText: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-normal)',
    color: 'var(--color-black)',
  } as SxProps<Theme>,

  pricingDivider: {
    width: '100%',
    height: 'var(--border-mypage-width-xs)',
    backgroundColor: 'var(--color-gray-300)',
    marginTop: 'var(--padding-lg)',
    marginBottom: 'var(--padding-md)',
  } as SxProps<Theme>,

  pricingHeading: {
    fontSize: 'var(--font-size-lg)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-black)',
    marginBottom: 'var(--padding-md)',
  } as SxProps<Theme>,

  pricingList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--padding-sm)',
  } as SxProps<Theme>,

  pricingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-sm)',
    paddingTop: 'var(--padding-sm)',
    borderTop: '1px solid var(--color-gray-300)',
    '&:first-of-type': {
      borderTop: 'none',
      paddingTop: 0,
    },
  } as SxProps<Theme>,

  pricingBullet: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-black)',
    width: 'var(--spacing-mypage-gap-md)',
  } as SxProps<Theme>,

  pricingTitle: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-normal)',
    color: 'var(--color-black)',
    flex: 1,
  } as SxProps<Theme>,

  pricingPrice: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-normal)',
    color: 'var(--color-black)',
  } as SxProps<Theme>,

  countdownTimerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-mypage-gap-sm)',
    marginTop: 'var(--padding-md)',
  } as SxProps<Theme>,

  countdownDigitButton: {
    backgroundColor: 'var(--color-mypage-background-gray-overlay)',
    borderRadius: 'var(--border-radius-mypage-lg)',
    minWidth: 'var(--width-mypage-profile-xxs)',
    height: 'var(--height-mypage-button)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 8px',
  } as SxProps<Theme>,

  countdownDigitText: {
    fontSize: 'var(--font-size-mypage-2xl)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-white)',
    lineHeight: 1,
    margin: 0,
  } as SxProps<Theme>,

  tooltipTitle: {
    fontWeight: 'bold',
    marginBottom: 'var(--spacing-mypage-gap-xs)',
  } as SxProps<Theme>,

  parallelImageContainer: {
    position: 'relative',
    flexShrink: 0,
  } as SxProps<Theme>,

  emailIcon: {
    fontSize: 'var(--font-size-mypage-lg)',
    color: 'var(--color-black)',
  } as SxProps<Theme>,

  linkIcon: {
    fontSize: 'var(--font-size-mypage-lg)',
    color: 'var(--color-black)',
  } as SxProps<Theme>,

  emailIconGray: {
    fontSize: 'var(--font-size-mypage-xl)',
    color: 'var(--color-gray-500)',
  } as SxProps<Theme>,

  linkIconGray: {
    fontSize: 'var(--font-size-mypage-xl)',
    color: 'var(--color-gray-500)',
  } as SxProps<Theme>,

  emailIconSmall: {
    fontSize: 'var(--font-size-mypage-md)',
    color: 'var(--color-gray-500)',
  } as SxProps<Theme>,

  linkIconSmall: {
    fontSize: 'var(--font-size-mypage-md)',
    color: 'var(--color-gray-500)',
  } as SxProps<Theme>,
};

