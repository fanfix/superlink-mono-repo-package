import { SxProps, Theme } from '@mui/material';
import { sharedModalStyles } from '../../shared/modalStyles';

export const verifiedCreatorModalStyles = {
  ...sharedModalStyles,
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 'var(--padding-md)',
  } as SxProps<Theme>,

  checkmarkCircle: {
    width: 'var(--padding-mypage-13xl)',
    height: 'var(--padding-mypage-13xl)',
    borderRadius: 'var(--border-radius-mypage-full)',
    backgroundColor: 'var(--color-mypage-background-green-lighter)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as SxProps<Theme>,

  title: {
    fontSize: 'var(--font-size-h3)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-gray-900)',
    textAlign: 'center' as const,
    marginBottom: 'var(--padding-sm)',
  } as SxProps<Theme>,

  description: {
    fontSize: 'var(--font-size-md-1)',
    color: 'var(--color-gray-600)',
    textAlign: 'center' as const,
    marginBottom: 'var(--padding-xl)',
    lineHeight: 'var(--line-height-relaxed)',
  } as SxProps<Theme>,

  stepsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--padding-lg)',
    marginBottom: 'var(--padding-xl)',
  } as SxProps<Theme>,

  stepItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--padding-md)',
  } as SxProps<Theme>,

  stepNumber: {
    width: 'var(--width-mypage-icon-xs)',
    height: 'var(--height-mypage-icon-xs)',
    borderRadius: '50%',
    backgroundColor: 'var(--color-gray-900)',
    color: 'var(--color-white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-semibold)',
    flexShrink: 0,
  } as SxProps<Theme>,

  stepText: {
    fontSize: 'var(--font-size-md-1)',
    color: 'var(--color-gray-700)',
    lineHeight: 'var(--line-height-relaxed)',
    flex: 1,
  } as SxProps<Theme>,

  modalContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-xl)',
  } as SxProps<Theme>,

  checkmarkIcon: {
    fontSize: 'var(--font-size-mypage-9xl)',
    color: 'var(--color-mypage-background-green-success)',
  } as SxProps<Theme>,
};

