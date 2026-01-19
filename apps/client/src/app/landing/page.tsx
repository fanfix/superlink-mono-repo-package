'use client';

import React, { useLayoutEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import HeroSection from './heroSection/HeroSection';
import CreatorSection from './creatorSection/CreatorSection';
import AgencySection from './agencySection/AgencySection';
import CTASection from './ctaSection/CTASection';
import SafetySection from './safetySection/SafetySection';
import Footer from './footer/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { redirectIfAuthenticated } from '../../lib/authGuard';
import Loader from '../../components/Loader';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, userState, currentUser } = useAuth();
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

  // Show loader while checking
  if (isLoading || !shouldRender) {
    return <Loader fullScreen={true} />;
  }

  const pageContainerStyles = {
    minHeight: '100vh',
    backgroundColor: 'var(--color-white)',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <Box sx={pageContainerStyles}>
      <HeroSection />
      <CreatorSection />
      <AgencySection />
      <SafetySection />
      <CTASection />
      <Footer />
    </Box>
  );
}

