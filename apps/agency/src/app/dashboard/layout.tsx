'use client';

import React, { useMemo, useState, useEffect, useTransition, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, Drawer, useMediaQuery, useTheme, IconButton, LinearProgress } from '@mui/material';
import { Sidebar } from '@superline/design-system';
import { Header } from '../../components/header';
import { useProfileApi } from '../../hooks';
import {
  Dashboard as DashboardIcon,
  Group as TeamsIcon,
  Person as CreatorsIcon,
  Lock as SuperLockedIcon,
  Settings as SettingsIcon,
  Link as ReferredIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { profile } = useProfileApi();
  
  // Get branding logo from profile
  const brandingLogo = profile?.brandImageURL || '/assets/black_footer_icon.png';

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Prefetch all dashboard routes on mount for faster navigation
  useEffect(() => {
    const routes = [
      '/dashboard',
      '/dashboard/teams',
      '/dashboard/creator',
      '/dashboard/superlocked',
      '/dashboard/settings',
      '/dashboard/referred',
    ];

    // Prefetch all routes in the background
    routes.forEach((route) => {
      router.prefetch(route);
    });
  }, [router]);

  // Style objects for complex styling
  const mainContainerStyles = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--color-background-main)',
  };

  const contentWrapperStyles = {
    display: 'flex',
    flexDirection: 'column',
    padding: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)', md: 'var(--padding-xl)', lg: 'var(--padding-2xl)' },
    backgroundColor: 'var(--color-white-sidebar)',
    position: 'relative',
    marginLeft: { xs: 0, md: 'var(--width-sidebar)' },
    marginTop: {
      xs: '88px',
      md: 'var(--height-header)',
    },
    minHeight: {
      xs: 'calc(100vh - 88px)',
      md: 'calc(100vh - var(--height-header))',
    },
    width: { xs: '100%', md: 'calc(100vw - var(--width-sidebar))' },
    overflow: 'hidden',
    transition: 'margin-left 0.3s ease',
  };

  const desktopHeaderContainerStyles = {
    position: 'fixed',
    top: 'var(--position-top-header)',
    right: 'var(--position-right-header)',
    zIndex: 'var(--z-index-header)',
    display: { xs: 'none', md: 'flex' },
    alignItems: 'center',
    gap: 'var(--padding-md)',
  };

  const sidebarStyles = {
    display: { xs: 'none', md: 'block' },
  };

  const mobileHeaderBarStyles = {
    display: { xs: 'flex', md: 'none' },
    position: 'fixed',
    top: '12px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 24px)',
    maxWidth: '640px',
    padding: '0 var(--padding-lg)',
    height: '56px',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
    zIndex: 'var(--z-index-header)',
  };

  const mobileIconButtonStyles = {
    color: 'var(--color-black-secondary)',
  };

  const legacyMobileButtonStyles = {
    display: { xs: 'block', md: 'none' },
    position: 'fixed',
    top: '10px',
    left: '10px',
    zIndex: 'var(--z-index-header)',
    backgroundColor: 'var(--color-white)',
    boxShadow: 'var(--shadow-sm)',
    '&:hover': {
      backgroundColor: 'var(--color-white-dull)',
    },
  };

  const navigationLoadingIndicatorStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    height: '3px',
    backgroundColor: 'transparent',
    '& .MuiLinearProgress-bar': {
      backgroundColor: 'var(--color-black-secondary)',
    },
  };

  // Optimized navigation handler with transition
  const handleNavigation = useCallback((href: string) => {
    // Prefetch the route before navigation
    router.prefetch(href);
    
    // Use startTransition for smooth navigation
    startTransition(() => {
      router.push(href);
    });
    
    // Close mobile sidebar if open
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [router, isMobile]);

  const items = useMemo(() => {
    const routes = [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
      { id: 'teams', label: 'Teams', icon: <TeamsIcon />, href: '/dashboard/teams' },
      { id: 'creators', label: 'Creators', icon: <CreatorsIcon />, href: '/dashboard/creator' },
      {
        id: 'superlocked',
        label: 'SuperLocked',
        icon: <SuperLockedIcon />,
        href: '/dashboard/superlocked',
      },
      { id: 'settings', label: 'Settings', icon: <SettingsIcon />, href: '/dashboard/settings' },
      { id: 'referred', label: 'Referred', icon: <ReferredIcon />, href: '/dashboard/referred' },
    ];

    // Calculate active state based on pathname
    // Special handling for dashboard - only active if exact match or no sub-routes
    const isDashboardActive = pathname === '/dashboard' || pathname === '/dashboard/';
    
    return routes.map((r) => {
      let isActive = false;
      
      if (r.id === 'dashboard') {
        // Dashboard is only active at exact path
        isActive = isDashboardActive;
      } else {
        // Other routes are active if pathname matches or starts with the href
        isActive = pathname === r.href || (pathname?.startsWith(r.href + '/') && pathname !== '/dashboard');
      }
      
      return {
        ...r,
        active: isActive,
        onClick: () => handleNavigation(r.href),
      };
    });
  }, [pathname, handleNavigation]);

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  return (
    <Box sx={mainContainerStyles}>
      {/* Desktop Sidebar */}
      <Box sx={sidebarStyles}>
        <Sidebar
          variant="agency"
          items={items}
          companyName="SuperLink"
          companyLogoIcon="/assets/black_footer_icon.png"
          companyLogo="/assets/black_footer_icon.png"
          topLogo={brandingLogo}
          width="218px"
          height="100vh"
          onItemClick={(item: any) => {
            handleNavigation(item?.href ?? '/dashboard');
          }}
        />
      </Box>

      {/* Mobile Drawer Sidebar */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={handleSidebarClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: '218px',
            boxSizing: 'border-box',
          },
        }}
      >
        <Sidebar
          variant="agency"
          items={items}
          companyName="SuperLink"
          companyLogoIcon="/assets/black_footer_icon.png"
          companyLogo="/assets/black_footer_icon.png"
          topLogo={brandingLogo}
          width="218px"
          height="100vh"
          onItemClick={(item: any) => {
            handleNavigation(item?.href ?? '/dashboard');
          }}
        />
      </Drawer>

      {/* Main content wrapper for nested pages */}
      <Box sx={contentWrapperStyles}>
        {/* Navigation Loading Indicator */}
        {isPending && (
          <LinearProgress sx={navigationLoadingIndicatorStyles} />
        )}

        {/* Mobile Header */}
        {isHydrated ? (
          <Box sx={mobileHeaderBarStyles}>
            <IconButton
              onClick={handleSidebarOpen}
              sx={mobileIconButtonStyles}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
            <Header />
          </Box>
        ) : (
          <IconButton
            onClick={handleSidebarOpen}
            sx={legacyMobileButtonStyles}
            aria-label="Open menu"
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Desktop Header positioned at top right corner */}
        <Box sx={desktopHeaderContainerStyles}>
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </Box>

        {children}
      </Box>
    </Box>
  );
}
