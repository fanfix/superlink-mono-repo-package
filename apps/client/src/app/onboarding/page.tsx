'use client';

import React, { useMemo, useState, useLayoutEffect } from 'react';
import { Box, Link as MuiLink } from '@mui/material';
import { useRouter } from 'next/navigation';
import AuthLayout from '../../components/AuthLayout';
import { Typography } from '@superline/design-system';
import OnboardingStepper, { OnboardingStepKey, OnboardingStepConfig } from './components/OnboardingStepper';
import PersonalInfoStep from './components/PersonalInfoStep';
import CreateAccountStep from './components/CreateAccountStep';
import SocialLinksStep from './components/SocialLinksStep';
import UploadContentStep from './components/UploadContentStep';
import StripeConnectStep from './components/StripeConnectStep';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../../components/Loader';
import { useCheckIfPhoneAndEmailExists, useOnboardUser } from '../../hooks/useOnboardingApi';

const STEPS: OnboardingStepConfig[] = [
  { id: 'personal-info', label: 'Personal Info' },
  { id: 'create-account', label: 'Create Account' },
  { id: 'social-links', label: 'Social Links' },
  { id: 'upload-content', label: 'Upload Content' },
  { id: 'stripe-connect', label: 'Stripe' },
];

// Style variables
const mainContainerStyles = {
  width: '100%',
  maxWidth: { xs: '100%', sm: 520, md: 600 },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: { xs: 2, sm: 2 },
  padding: { xs: 'var(--padding-lg)', sm: 'var(--padding-xl)', md: 'var(--padding-2xl)' },
  overflowY: 'auto',
  overflowX: 'hidden',
  scrollbarWidth: 'thin',
  scrollbarColor: 'var(--color-scrollbar-thumb) transparent',
  '&::-webkit-scrollbar': {
    width: 'var(--spacing-onboarding-gap-sm)',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'var(--color-scrollbar-thumb)',
    borderRadius: 'var(--border-radius-onboarding-scrollbar)',
    '&:hover': {
      backgroundColor: 'var(--color-scrollbar-thumb-hover)',
    },
  },
};

const backLinkStyles = {
  mb: { xs: 1.5, sm: 2 },
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  fontSize: { xs: 'var(--font-size-onboarding-sm)', sm: 'var(--font-size-onboarding-md)' },
  color: 'var(--color-onboarding-text-dark)',
  textDecoration: 'none',
  flexShrink: 0,
  '&:hover': { textDecoration: 'underline' },
};

const stepContentContainerStyles = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
};

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, userState, currentUser, refreshAuth } = useAuth();
  const [activeStepId, setActiveStepId] = useState<OnboardingStepKey>('personal-info');
  const [onboardingDataState, setOnboardingDataState] = useState({
    name: '',
    email: '',
    username: '',
  });
  const [shouldRender, setShouldRender] = useState(false);

  const { execute: checkPhoneEmail } = useCheckIfPhoneAndEmailExists();
  const { execute: onboardUser } = useOnboardUser();

  const phoneNumber = useMemo(() => {
    return (
      currentUser?.phoneNumber ||
      userState?.phoneNumber ||
      userState?.phone ||
      ''
    );
  }, [currentUser?.phoneNumber, userState?.phoneNumber, userState?.phone]);

  // useLayoutEffect runs synchronously before paint - prevents flash
  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      setShouldRender(true);
      return;
    }

    const checkAndRedirect = async () => {
      if (isLoading) {
        return; // Still loading, wait
      }

      // Must be authenticated (OTP/token) to access onboarding
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // If user already has a bio, only redirect away when NOT in an active onboarding flow
      const hasBio = !!(currentUser?.bio?.id || userState?.bio?.id);
      const onboardingInProgress = sessionStorage.getItem('onboarding-in-progress') === 'true';
      if (hasBio && !onboardingInProgress) {
        router.push('/creator/myPage');
        return;
      }

      setShouldRender(true);
    };

    checkAndRedirect();
  }, [router, isAuthenticated, isLoading, userState, currentUser]);

  const activeIndex = STEPS.findIndex((step) => step.id === activeStepId);

  const goNext = () => {
    if (activeIndex < STEPS.length - 1) {
      setActiveStepId(STEPS[activeIndex + 1].id);
    } else {
      // Last step completed - redirect to creator/myPage
      handleOnboardingComplete();
    }
  };

  const handleOnboardingComplete = () => {
    // Mark onboarding as complete
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding-complete', 'true');
      sessionStorage.removeItem('onboarding-in-progress');
      sessionStorage.removeItem('auth-flow');
    }
    // Redirect to creator/myPage
    router.replace('/creator/myPage');
  };

  const goBack = () => {
    if (activeIndex > 0) {
      setActiveStepId(STEPS[activeIndex - 1].id);
    }
  };

  const renderStep = () => {
    switch (activeStepId) {
      case 'personal-info':
        return (
          <PersonalInfoStep
            onContinue={async (data) => {
              if (!phoneNumber) {
                throw new Error('Phone number not found. Please verify OTP again.');
              }

              const result = await checkPhoneEmail({ email: data.email, phone: phoneNumber });
              if (!result?.message || result.message !== 'OK') {
                throw new Error(result?.message || 'Unable to verify email/phone. Please try again.');
              }

              setOnboardingDataState((prev) => ({ ...prev, ...data }));
              goNext();
            }}
          />
        );
      case 'create-account':
        return (
          <CreateAccountStep
            onContinue={(data) => {
              setOnboardingDataState((prev) => ({ ...prev, ...data }));
              goNext();
            }}
          />
        );
      case 'social-links':
        return (
          <SocialLinksStep
            onContinue={async (socialLinks) => {
              const { name, email, username } = onboardingDataState;
              if (!name || !email || !username) {
                throw new Error('Missing onboarding data. Please complete previous steps.');
              }

              await onboardUser({
                name,
                isFan: false,
                introMessage: '',
                socialLinks,
                email,
                pageName: username,
              });

              // Refresh auth so bio becomes available for next steps
              await refreshAuth(true);
              goNext();
            }}
          />
        );
      case 'upload-content':
        return (
          <UploadContentStep
            onContinue={async () => {
              // Ensure we have latest user data before leaving onboarding
              await refreshAuth(true);
              goNext();
            }}
          />
        );
      case 'stripe-connect':
        return <StripeConnectStep onLater={handleOnboardingComplete} />;
      default:
        return <PersonalInfoStep onContinue={async () => goNext()} />;
    }
  };

  // Show loader while checking auth/redirecting
  if (isLoading || !shouldRender) {
    return <Loader fullScreen={true} />;
  }

  return (
    <AuthLayout>
      <Box sx={mainContainerStyles}>
        <Box
          sx={{
            mb: { xs: 2, sm: 3, md: 4 },
            flexShrink: 0,
          }}
        >
          <img
            src="/assets/landing/asset 0.svg"
            alt="SuperLink Logo"
            style={{
              height: 'var(--height-onboarding-logo)',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </Box>

        <OnboardingStepper steps={STEPS} activeStepId={activeStepId} />

        <Box
          sx={{
          
            // overflowY: 'auto',
            // overflowX: 'hidden',
          }}
        >
          {activeIndex > 0 && (
            <MuiLink component="button" onClick={goBack} sx={backLinkStyles}>
              ← Back
            </MuiLink>
          )}

          <Box sx={stepContentContainerStyles}>
            {renderStep()}
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
}


