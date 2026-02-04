'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LandingNavbar from '../../components/LandingNavbar';
import { SettingsModalProvider, useSettingsModal } from '../../contexts/SettingsModalContext';
import { MyAccountProvider } from '../../contexts/MyAccountContext';
import { MonetizationProvider } from '../../contexts/MonetizationContext';
import { BrandKitProvider } from '../../contexts/BrandKitContext';
import { SocialLinksProvider } from '../../contexts/SocialLinksContext';
import { CustomButtonsProvider } from '../../contexts/CustomButtonsContext';
import { CustomSectionsProvider } from '../../contexts/CustomSectionsContext';
import { ContentProvider } from '../../contexts/ContentContext';
import { TippingHistoryProvider } from '../../contexts/TippingHistoryContext';
import { ManageAccessProvider } from '../../contexts/ManageAccessContext';
import SettingsModal from './myPage/components/modals/SettingsModal';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../../components/Loader';

function CreatorLayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen, openModal, closeModal } = useSettingsModal();
  const router = useRouter();
  const { isAuthenticated, isLoading, userState, currentUser } = useAuth();
  const [initialAuthResolved, setInitialAuthResolved] = useState(false);

  // Only show the full-screen loader during the very first auth resolution.
  // After that, background refreshes (triggered by various API actions) should NOT block the whole creator UI.
  useEffect(() => {
    if (!isLoading) {
      setInitialAuthResolved(true);
    }
  }, [isLoading]);

  // Handle Stripe Connect callback redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if we have a stored redirect URL from Stripe Connect
      const stripeRedirect = sessionStorage.getItem('stripe_connect_redirect');
      if (stripeRedirect) {
        // Check if URL has stripe callback parameters (Stripe redirects back with these)
        const urlParams = new URLSearchParams(window.location.search);
        const hasStripeParams = urlParams.has('state') || urlParams.has('code') || 
                                window.location.pathname.includes('stripe') ||
                                window.location.search.includes('stripe');
        
        if (hasStripeParams) {
          // Clear the redirect flag
          sessionStorage.removeItem('stripe_connect_redirect');
          // Redirect to myPage after Stripe connection
          router.push('/creator/myPage');
          return;
        }
      }
    }
  }, [router]);

  // Redirect to login if not authenticated (use global auth context - no duplicate API calls)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // If authenticated but missing creator/bio state, send to onboarding
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    const hasBio = !!(currentUser?.bio?.id || userState?.bio?.id);
    if (!hasBio) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('onboarding-in-progress', 'true');
      }
      router.push('/onboarding');
    }
  }, [isLoading, isAuthenticated, currentUser?.bio?.id, userState?.bio?.id, router]);

  // Show splash loader ONLY on initial route entry/refresh while auth is resolving.
  if (!initialAuthResolved && (isLoading || !isAuthenticated)) {
    return <Loader fullScreen={true} />;
  }

  return (
    <>
      <LandingNavbar onAvatarClick={openModal} />
      <SettingsModal open={isOpen} onClose={closeModal}/>
      {children}
    </>
  );
}

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MyAccountProvider autoFetch={true}>
      <MonetizationProvider autoFetch={true}>
        <TippingHistoryProvider autoFetch={true}>
          <ManageAccessProvider autoFetch={true}>
            <SocialLinksProvider>
              <CustomButtonsProvider>
                <CustomSectionsProvider>
                  <ContentProvider>
                    <BrandKitProvider>
                      <SettingsModalProvider>
                        <CreatorLayoutContent>{children}</CreatorLayoutContent>
                      </SettingsModalProvider>
                    </BrandKitProvider>
                  </ContentProvider>
                </CustomSectionsProvider>
              </CustomButtonsProvider>
            </SocialLinksProvider>
          </ManageAccessProvider>
        </TippingHistoryProvider>
      </MonetizationProvider>
    </MyAccountProvider>
  );
}
