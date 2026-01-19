'use client';

import React, { useState, useLayoutEffect } from 'react';
import { Box, Link as MuiLink } from '@mui/material';
import { useRouter } from 'next/navigation';
import AuthLayout from '../../components/AuthLayout';
import { Typography } from '@superline/design-system';
import OnboardingStepper, { OnboardingStepKey, OnboardingStepConfig } from './components/OnboardingStepper';
import PersonalInfoStep from './components/PersonalInfoStep';
import CreateAccountStep from './components/CreateAccountStep';
import SocialLinksStep from './components/SocialLinksStep';
import UploadContentStep from './components/UploadContentStep';
import { useAuth } from '../../contexts/AuthContext';
import { redirectIfAuthenticated } from '../../lib/authGuard';
import Loader from '../../components/Loader';

const STEPS: OnboardingStepConfig[] = [
  { id: 'personal-info', label: 'Personal Info' },
  { id: 'create-account', label: 'Create Account' },
  { id: 'social-links', label: 'Social Links' },
  { id: 'upload-content', label: 'Upload Content' },
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
  const { isAuthenticated, isLoading, userState, currentUser } = useAuth();
  const [activeStepId, setActiveStepId] = useState<OnboardingStepKey>('personal-info');
  const [onboardingDataState, setOnboardingDataState] = useState({
    name: '',
    email: '',
    username: '',
  });
  const [shouldRender, setShouldRender] = useState(false);

  // useLayoutEffect runs synchronously before paint - prevents flash
  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      setShouldRender(true);
      return;
    }

    // Use auth context to prevent duplicate API calls
    const checkAndRedirect = async () => {
      if (isLoading) {
        return; // Still loading, wait
      }

      const result = await redirectIfAuthenticated(router, {
        userState,
        currentUser,
        isAuthenticated,
        isLoading,
      });

      if (result.shouldRedirect) {
        return; // Redirecting, don't render
      }

      // No redirect needed - show page
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
      sessionStorage.removeItem('auth-flow');
    }
    // Redirect to creator/myPage
    router.push('/creator/myPage');
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
            onContinue={(data) => {
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
        return <SocialLinksStep onContinue={goNext} />;
      case 'upload-content':
        return <UploadContentStep onContinue={goNext} />;
      default:
        return <PersonalInfoStep onContinue={goNext} />;
    }
  };

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


