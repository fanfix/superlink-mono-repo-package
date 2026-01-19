'use client';

import React, { useState, useEffect } from 'react';
import { Box, Avatar, Drawer, IconButton } from '@mui/material';
import { Button, Typography } from '@superline/design-system';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowForward, Person, Menu, Close } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useMonetization } from '../contexts/MonetizationContext';
import { useMyAccount } from '../contexts/MyAccountContext';

interface LandingNavbarProps {
  onAvatarClick?: () => void;
}

export default function LandingNavbar({ onAvatarClick }: LandingNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Use global auth context (prevents duplicate API calls)
  const { isAuthenticated, currentUser, userState } = useAuth();
  
  // Get Stripe connection status and connect function
  // Note: LandingNavbar is used in CreatorLayout which has MonetizationProvider
  // So these hooks should always be available
  const isCreatorPage = pathname?.includes('/creator');
  
  // Always call hooks unconditionally (React rules)
  // If hooks throw, that's a real error (provider missing)
  let monetization = null;
  let account = null;
  let paymentMethod = null;
  let connectingStripe = false;
  let connectStripeFn: (() => Promise<void>) | null = null;
  let user = null;
  
  try {
    monetization = useMonetization();
    account = useMyAccount();
    
    // Only use values on creator pages
    paymentMethod = isCreatorPage ? monetization.paymentMethod : null;
    connectingStripe = isCreatorPage ? monetization.connectingStripe : false;
    connectStripeFn = isCreatorPage ? monetization.connectStripe : null;
    user = isCreatorPage ? account.user : null;
  } catch (error) {
    // Not in creator context, that's okay
  }
  
  // Show Connect Stripe button only if:
  // 1. User is authenticated
  // 2. User is on creator pages
  // 3. Stripe is not connected (like superlink-main: !bio.verificationStatus)
  const shouldShowConnectStripe = isAuthenticated && 
                                   isCreatorPage && 
                                   user && 
                                   !user.bio?.verificationStatus &&
                                   !paymentMethod?.transferAllowed;
  
  const handleConnectStripe = async () => {
    if (connectStripeFn) {
      try {
        await connectStripeFn();
      } catch (error) {
        console.error('Failed to connect Stripe:', error);
      }
    }
  };

  // Get username from auth context
  const username = currentUser?.name || 
                   currentUser?.bio?.pageName || 
                   userState?.name || 
                   userState?.bio?.pageName || 
                   'User';

  // Set mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Styling variables
  const navbarStyles = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isAuthenticated ? 'space-between' : 'space-between',
    padding: isCreatorPage 
      ? { xs: '20px var(--padding-2xl)', md: 'var(--padding-md) var(--padding-2xl)' }
      : { xs: '20px var(--padding-2xl)', md: 'var(--padding-2xl) var(--padding-horizontal-xl)' },
    backgroundColor: isAuthenticated ? 'var(--color-black)' : 'var(--color-white)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
  };

  // Left Container - Logo + Navigation Links
  const leftContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: { xs: 'var(--padding-lg-1)', md: 'var(--padding-3xl)' },
    flex: 1,
  };

  const logoContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    filter: isAuthenticated ? 'brightness(0) invert(1)' : 'none', // Make logo white when authenticated
  };

  const navLinksContainerStyles = {
    display: { xs: 'none', md: 'flex' },
    alignItems: 'center',
    gap: { xs: 'var(--padding-lg-1)', md: 'var(--padding-2xl)' },
  };

  // Right Container - Connect Stripe + Profile
  const rightSectionStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: { xs: 'var(--padding-sm)', sm: 'var(--padding-md)', md: 'var(--padding-2xl)' },
  };

  // Hamburger Menu Button Styles
  const hamburgerButtonStyles = {
    display: { xs: 'flex', md: 'none' },
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    minWidth: 'auto',
    color: isAuthenticated ? 'var(--color-white)' : 'var(--color-black)',
    '&:hover': {
      backgroundColor: isAuthenticated ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    },
  };

  // Mobile Drawer Styles
  const drawerStyles = {
    '& .MuiDrawer-paper': {
      width: { xs: '280px', sm: '320px' },
      backgroundColor: isAuthenticated ? 'var(--color-black)' : 'var(--color-white)',
      padding: 'var(--padding-2xl)',
    },
  };

  // Mobile Menu Item Styles
  const mobileMenuItemStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-lg)',
    paddingTop: 'var(--padding-xl)',
  };

  const mobileLinkStyles = {
    color: isAuthenticated ? 'var(--color-white)' : 'var(--color-gray-800)',
    textDecoration: 'none',
    fontSize: 'var(--font-size-lg)',
    fontWeight: 'var(--font-weight-semibold)',
    padding: 'var(--padding-md) 0',
    borderBottom: `1px solid ${isAuthenticated ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-gray-200)'}`,
    transition: 'all var(--transition-normal)',
    '&:hover': {
      opacity: 0.7,
    },
  };

  const activeMobileLinkStyles = {
    ...mobileLinkStyles,
    color: isAuthenticated ? 'var(--color-white)' : 'var(--color-black)',
    fontWeight: 'var(--font-weight-bold)',
  };

  const signUpButtonStyles = {
    borderRadius: '20px',
    padding: 'var(--padding-sm) var(--padding-xl)',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-md)',
    textTransform: 'none',
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: '#1a1a1a',
    },
  };

  const arrowIconStyles = {
    fontSize: '18px',
    transform: 'rotate(-45deg)',
    marginLeft: 'var(--padding-xs)',
  };

  const navLinkStyles = {
    color: 'var(--color-gray-400)', // Grey color for inactive links
    textDecoration: 'none',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-bold)',
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'all var(--transition-normal)',
    padding: 'var(--padding-lg) 0 var(--padding-xs) 0',
    borderBottom: 'none',
    position: 'relative' as const,
    '&:hover': {
      color: 'var(--color-white)', // White on hover
    },
  };

  const activeNavLinkStyles = {
    ...navLinkStyles,
    color: 'var(--color-white)', // White color for active link
    fontWeight: 'var(--font-weight-bold)',
    borderBottom: '1px solid var(--color-gray-300)',
    padding: 'var(--padding-lg)  0px',
    '&:hover': {
      color: 'var(--color-white)', // Keep white on hover for active link
    },
  };

  const profileSectionStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-md)',
  };

  const usernameStyles = {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-white)',
    fontFamily: 'inherit',
  };

  const avatarStyles = {
    width: '32px',
    height: '32px',
    backgroundColor: 'var(--color-white)',
    cursor: 'pointer',
    color: 'var(--color-gray-400)',
  };

  const connectStripeButtonStyles = {
    backgroundColor: 'var(--color-white)',
    color: 'var(--color-black)',
    borderRadius: 'var(--border-radius-2xl)',
    padding: 'var(--padding-sm) var(--padding-xl)',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'none' as const,
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: 'var(--color-gray-100)',
    },
  };

  // Don't render navbar on auth pages (login, signup, onboarding)
  // They use AuthLayout which doesn't include navbar
  const isAuthPage = pathname?.includes('/login') || 
                     pathname?.includes('/signup') || 
                     pathname?.includes('/onboarding') ||
                     pathname?.includes('/otp-verify');
  
  if (isAuthPage) {
    return null;
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    // Return a placeholder with same structure to prevent layout shift
    return (
      <Box sx={{
        width: '100%',
        height: '64px',
        backgroundColor: 'var(--color-white)',
        position: 'sticky' as const,
        top: 0,
        zIndex: 1000,
      }} />
    );
  }

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileLinkClick = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
  };

  // Mobile Drawer Content
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Drawer Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--padding-2xl)' }}>
        <Box sx={logoContainerStyles}>
          <img
            src="/assets/landing/asset 0.svg"
            alt="SuperLink Logo"
            style={{
              height: '26px',
              width: 'auto',
            }}
          />
        </Box>
        <IconButton
          onClick={handleMobileMenuClose}
          sx={{
            color: isAuthenticated ? 'var(--color-white)' : 'var(--color-black)',
            padding: '8px',
          }}
        >
          <Close />
        </IconButton>
      </Box>

      {/* Mobile Navigation Links */}
      {isAuthenticated && (
        <Box sx={mobileMenuItemStyles}>
          <Link
            href="/creator/myPage"
            onClick={() => handleMobileLinkClick('/creator/myPage')}
            style={pathname?.includes('/creator/myPage') ? activeMobileLinkStyles : mobileLinkStyles}
          >
            My Page
          </Link>
          <Link
            href="/creator/insights"
            onClick={() => handleMobileLinkClick('/creator/insights')}
            style={pathname?.includes('/creator/insights') ? activeMobileLinkStyles : mobileLinkStyles}
          >
            Insights
          </Link>
          <Link
            href="/creator/messages"
            onClick={() => handleMobileLinkClick('/creator/messages')}
            style={pathname?.includes('/creator/messages') ? activeMobileLinkStyles : mobileLinkStyles}
          >
            Messages
          </Link>
          {shouldShowConnectStripe && (
            <Button
              variant="primary-light"
              onClick={async () => {
                await handleConnectStripe();
                setMobileMenuOpen(false);
              }}
              disabled={connectingStripe}
              loading={connectingStripe}
              sx={{
                ...connectStripeButtonStyles,
                marginTop: 'var(--padding-md)',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              Connect Stripe
            </Button>
          )}
        </Box>
      )}

      {/* Mobile Profile Section */}
      {isAuthenticated && (
        <Box
          sx={{
            marginTop: 'auto',
            paddingTop: 'var(--padding-2xl)',
            borderTop: `1px solid ${isAuthenticated ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-gray-200)'}`,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
            },
          }}
          onClick={() => {
            if (onAvatarClick) {
              onAvatarClick();
            }
            setMobileMenuOpen(false);
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--padding-md)' }}>
            <Avatar sx={avatarStyles}>
              <Person sx={{ fontSize: '20px', color: 'var(--color-gray-400)' }} />
            </Avatar>
            <Typography sx={{ ...usernameStyles, fontSize: 'var(--font-size-md-1)' }}>
              {username}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <Box sx={navbarStyles}>
        {/* Left Container - Logo + Navigation Links */}
        <Box sx={leftContainerStyles}>
          {/* Logo */}
          <Box sx={logoContainerStyles}>
            <img
              src="/assets/landing/asset 0.svg"
              alt="SuperLink Logo"
              style={{
                height: '26px',
                width: 'auto',
              }}
            />
          </Box>

          {/* Navigation Links (only when authenticated, hidden on mobile) */}
          {isAuthenticated && (
            <Box sx={navLinksContainerStyles}>
              <Link
                href="/creator/myPage"
                style={pathname?.includes('/creator/myPage') ? activeNavLinkStyles : navLinkStyles}
              >
                My Page
              </Link>
              <Link
                href="/creator/insights"
                style={pathname?.includes('/creator/insights') ? activeNavLinkStyles : navLinkStyles}
              >
                Insights
              </Link>
              <Link
                href="/creator/messages"
                style={pathname?.includes('/creator/messages') ? activeNavLinkStyles : navLinkStyles}
              >
                Messages
              </Link>
              {shouldShowConnectStripe && (
                <Button
                  variant="primary-light"
                  onClick={handleConnectStripe}
                  disabled={connectingStripe}
                  loading={connectingStripe}
                  sx={connectStripeButtonStyles}
                >
                  Connect Stripe
                </Button>
              )}
            </Box>
          )}
        </Box>

        {/* Right Container - Hamburger Menu (Mobile) + Auth Buttons */}
        <Box sx={rightSectionStyles}>
          {/* Hamburger Menu Button (Mobile Only) */}
          {isAuthenticated && (
            <IconButton
              onClick={() => setMobileMenuOpen(true)}
              sx={hamburgerButtonStyles}
              aria-label="menu"
            >
              <Menu />
            </IconButton>
          )}

          {isAuthenticated ? (
            <>
              {/* Profile Section (Desktop Only) */}
              <Box 
                sx={{
                  ...profileSectionStyles,
                  display: { xs: 'none', md: 'flex' },
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
                onClick={onAvatarClick}
              >
                <Typography sx={usernameStyles}>{username}</Typography>
                <Avatar sx={avatarStyles}>
                  <Person sx={{ fontSize: '20px', color: 'var(--color-gray-400)' }} />
                </Avatar>
              </Box>
            </>
          ) : (
            <>
              {/* Sign Up Button - Black button with arrow (diagonally up-right) */}
              <Button
                variant="primary-dark"
                onClick={() => router.push('/signup')}
                sx={{
                  ...signUpButtonStyles,
                  fontSize: { xs: 'var(--font-size-sm)', sm: 'var(--font-size-md-1)' },
                  padding: { xs: 'var(--padding-xs) var(--padding-md)', sm: 'var(--padding-sm) var(--padding-xl)' },
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Sign Up
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  Sign Up
                </Box>
                <ArrowForward sx={{ ...arrowIconStyles, fontSize: { xs: '16px', sm: '18px' } }} />
              </Button>

              {/* Log In Link - Plain text link (light gray) */}
              <Link
                href="/login"
                style={{
                  color: 'var(--color-gray-500)',
                  textDecoration: 'none',
                  fontSize: { xs: 'var(--font-size-sm)', sm: 'var(--font-size-md-1)' },
                  fontWeight: 'var(--font-weight-normal)',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  whiteSpace: 'nowrap',
                }}
              >
                Log in
              </Link>
            </>
          )}
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        sx={drawerStyles}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

