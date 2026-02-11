import { SxProps, Theme } from '@mui/material';

export const styles = {
  addButton: {
    width: '100%',
    backgroundColor: 'var(--color-mypage-background-blue-lighter)',
    color: 'var(--color-black)',
    borderRadius: 'var(--border-radius-2xl)',
    padding: 'var(--padding-sm) var(--padding-xl)',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'none' as const,
    '&:hover': {
      backgroundColor: 'var(--color-mypage-background-blue-light)',
    },
  } as SxProps<Theme>,

  brandKitItemsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--padding-sm)',
    marginBottom: 'var(--padding-md)',
  } as SxProps<Theme>,

  childSectionsWrapper: {
    marginTop: 'var(--padding-md)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 0,
  } as SxProps<Theme>,

  brandKitItemCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--padding-md)',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-gray-200)',
    borderRadius: 'var(--border-radius-md)',
    gap: 'var(--padding-sm)',
  } as SxProps<Theme>,

  brandKitItemContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-sm)',
    flex: 1,
  } as SxProps<Theme>,

  brandKitDragHandle: {
    cursor: 'grab',
    padding: 'var(--padding-mypage-xs)',
    display: 'flex',
    alignItems: 'center',
    '&:active': {
      cursor: 'grabbing',
    },
  } as SxProps<Theme>,

  brandKitLogo: {
    width: 'var(--padding-mypage-9xl)',
    height: 'var(--padding-mypage-9xl)',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    flexShrink: 0,
  } as SxProps<Theme>,

  brandKitLogoPlaceholder: {
    width: 'var(--padding-mypage-9xl)',
    height: 'var(--padding-mypage-9xl)',
    borderRadius: '50%',
    backgroundColor: 'var(--color-gray-100)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as SxProps<Theme>,

  brandKitName: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-black)',
    flex: 1,
  } as SxProps<Theme>,

  dragHandleIcon: {
    fontSize: 'var(--font-size-mypage-xl)',
    color: 'var(--color-gray-500)',
  } as SxProps<Theme>,

  editButton: {
    color: 'var(--color-gray-500)',
    padding: 'var(--padding-mypage-xs)',
  } as SxProps<Theme>,

  editIcon: {
    fontSize: 'var(--font-size-mypage-lg)',
  } as SxProps<Theme>,

  placeholderIcon: {
    width: 'var(--width-mypage-icon-xs)',
    height: 'var(--height-mypage-icon-xs)',
    opacity: 0.5,
  } as SxProps<Theme>,
};

