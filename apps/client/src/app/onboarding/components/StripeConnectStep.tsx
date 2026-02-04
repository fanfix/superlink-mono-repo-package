/* eslint-disable react/no-unescaped-entities */
'use client';

import { useCallback, useState } from 'react';
import { Box } from '@mui/material';
import { Button, Typography } from '@superline/design-system';
import { useRouter } from 'next/navigation';
import { useGetStripeConnect } from '../../../hooks/usePaymentApi';

interface StripeConnectStepProps {
  onLater: () => void | Promise<void>;
}

const containerStyles = {
  maxWidth: 'var(--width-onboarding-container)',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const titleStyles = {
  fontSize: { xs: 'var(--font-size-onboarding-3xl)', md: 'var(--font-size-onboarding-6xl)' },
  fontWeight: 700,
  color: 'var(--color-onboarding-text-dark)',
};

const descriptionStyles = {
  fontSize: 'var(--font-size-onboarding-lg)',
  color: 'var(--color-onboarding-text-medium)',
  maxWidth: 'var(--width-onboarding-container-sm)',
  lineHeight: 1.5,
};

const buttonContainerStyles = {
  mt: 2,
  maxWidth: 'var(--width-onboarding-container-sm)',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 1.25,
};

const buttonStyles = {
  height: 'var(--height-onboarding-button)',
  borderRadius: 'var(--border-radius-onboarding-button)',
  fontSize: 'var(--font-size-onboarding-lg)',
  fontWeight: 600,
  padding: '0px',
  textTransform: 'none',
};

const laterButtonStyles = {
  ...buttonStyles,
  textDecoration: 'underline',
};

export default function StripeConnectStep({ onLater }: StripeConnectStepProps) {
  const router = useRouter();
  const { execute: getStripeConnect, loading } = useGetStripeConnect();
  const [error, setError] = useState<string>('');

  const completeAndGoToCreator = useCallback(async () => {
    try {
      await onLater();
    } finally {
      // Ensure onboarding flags are cleared even if parent handler changes
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboarding-complete', 'true');
        sessionStorage.removeItem('onboarding-in-progress');
        sessionStorage.removeItem('auth-flow');
      }
      // Always go to creator/myPage on "Later"
      router.replace('/creator/myPage');
    }
  }, [onLater, router]);

  const handleConnect = async () => {
    setError('');
    try {
      const res = await getStripeConnect();
      const url = res?.url;
      const transferAllowed = !!res?.transferAllowed;

      if (!url) {
        throw new Error('Stripe connect URL not received');
      }

      // Mark onboarding as complete before redirecting away
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboarding-complete', 'true');
        sessionStorage.removeItem('onboarding-in-progress');
        sessionStorage.removeItem('auth-flow');
        sessionStorage.setItem('stripe_connect_redirect', '/creator/myPage');
      }

      if (transferAllowed) {
        window.open(url, '_blank');
        // If it opens in a new tab, user can continue later
        await completeAndGoToCreator();
        return;
      }

      // Redirect to Stripe connect
      window.location.href = url;
    } catch (err: any) {
      setError(err?.message || 'Failed to start Stripe connect. Please try again.');
    }
  };

  return (
    <Box sx={containerStyles}>
      <Typography sx={titleStyles}>Connect Stripe</Typography>
      <Typography sx={descriptionStyles}>
        Connect Stripe to enable payouts and monetization. You can also do this later from settings.
      </Typography>

      {error && (
        <Typography
          sx={{
            fontSize: 'var(--font-size-onboarding-sm)',
            color: '#dc2626',
            maxWidth: 'var(--width-onboarding-container-sm)',
          }}
        >
          {error}
        </Typography>
      )}

      <Box sx={buttonContainerStyles}>
        <Button
          variant="primary-dark"
          fullWidth
          sx={buttonStyles}
          onClick={handleConnect}
          loading={loading}
          disabled={loading}
        >
          Connect Stripe
        </Button>

        <Button
          variant="primary-light"
          fullWidth
          sx={laterButtonStyles}
          onClick={completeAndGoToCreator}
          disabled={loading}
        >
          Later
        </Button>
      </Box>
    </Box>
  );
}

