import { SxProps, Theme } from '@mui/material';

export const styles = {
  addButton: {
    width: '100%',
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
    borderRadius: 'var(--border-radius-2xl)',
    padding: 'var(--padding-md) var(--padding-xl)',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'none' as const,
    marginTop: 'var(--padding-lg)',
    '&:hover': {
      backgroundColor: '#1a1a1a',
    },
  } as SxProps<Theme>,

  buttonItem: (isDragging: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--padding-md) var(--padding-lg)',
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--border-radius-lg)',
    border: '1px solid var(--color-gray-200)',
    marginBottom: 'var(--padding-md)',
    cursor: isDragging ? 'grabbing' : 'default',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
  }) as SxProps<Theme>,

  buttonContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    flex: 1,
    gap: '4px',
  } as SxProps<Theme>,

  buttonTitle: {
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-black)',
    lineHeight: 1.4,
  } as SxProps<Theme>,

  buttonValue: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-normal)',
    color: 'var(--color-gray-600)',
    lineHeight: 1.4,
    wordBreak: 'break-all' as const,
  } as SxProps<Theme>,

  buttonActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-xs)',
  } as SxProps<Theme>,

  starButton: {
    padding: '4px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  } as SxProps<Theme>,

  dragHandle: {
    cursor: 'grab',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:active': {
      cursor: 'grabbing',
    },
  } as SxProps<Theme>,
};

