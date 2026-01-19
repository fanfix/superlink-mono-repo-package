import { SxProps, Theme } from '@mui/material';

export const styles = {
  addButton: {
    width: '100%',
    backgroundColor: '#D6E0F5;',
    color: 'var(--color-black)',
    borderRadius: 'var(--border-radius-2xl)',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'none' as const,
    '&:hover': {
      backgroundColor: '#C5D4F0',
    },
  } as SxProps<Theme>,

  engagementsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--padding-sm)',
    marginBottom: 'var(--padding-md)',
  } as SxProps<Theme>,

  engagementItemCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--padding-md)',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-gray-200)',
    borderRadius: 'var(--border-radius-md)',
    gap: 'var(--padding-sm)',
  } as SxProps<Theme>,

  engagementItemContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-sm)',
    flex: 1,
  } as SxProps<Theme>,

  engagementDragHandle: {
    cursor: 'grab',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    '&:active': {
      cursor: 'grabbing',
    },
  } as SxProps<Theme>,

  engagementTitle: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-black)',
    flex: 1,
  } as SxProps<Theme>,

  engagementCount: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-black)',
  } as SxProps<Theme>,
};
