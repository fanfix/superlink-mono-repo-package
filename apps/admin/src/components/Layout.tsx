'use client';

import React, { FC, ReactNode, useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { AdminSidebar, defaultAdminSidebarItems, SidebarItem } from './Sidebar';
import { Header } from './Header';

export interface DashboardLayoutProps {
  /**
   * Content to be displayed in the main area
   */
  children: ReactNode;
  /**
   * Custom sidebar items (optional)
   */
  sidebarItems?: SidebarItem[];
  /**
   * Callback when sidebar item is clicked
   */
  onSidebarItemClick?: (item: SidebarItem) => void;
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({
  children,
  sidebarItems = defaultAdminSidebarItems,
  onSidebarItemClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  console.log('DashboardLayout rendering...');
  console.log('Sidebar items:', sidebarItems);
  console.log('isMobile:', isMobile);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarItemClick = (item: SidebarItem) => {
    if (item.id === 'close') {
      setSidebarOpen(false); // Close sidebar when close button is clicked
      return;
    }
    
    if (isMobile) {
      setSidebarOpen(false); // Close sidebar on mobile after selection
    }
    if (onSidebarItemClick) {
      onSidebarItemClick(item);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Header - Full width at top */}
      <Header
        onMenuToggle={handleMenuToggle}
        sidebarOpen={sidebarOpen}
      />

      {/* Content area below header */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 'calc(100vh - 40px)', // Full height minus header
        }}
      >
        {/* Sticky Sidebar */}
        <Box
          sx={{
            position: isMobile ? 'fixed' : 'sticky',
            top: '64px', // Start below header
            left: 0,
            zIndex: 1200,
            width: isMobile ? '280px' : '280px',
            height: isMobile ? 'calc(100vh - 64px)' : 'calc(100vh - 64px)', // Subtract header height
            backgroundColor: 'transparent', // No background
            transform: isMobile 
              ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)')
              : 'translateX(0)',
            transition: 'transform 0.3s ease-in-out',
            boxShadow: isMobile ? '2px 0 8px rgba(0,0,0,0.1)' : 'none',
            flexShrink: 0,
          }}
        >
          <AdminSidebar
            items={sidebarItems}
            onItemClick={handleSidebarItemClick}
          />
        </Box>

        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <Box
            sx={{
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1100,
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f5f5f5',
            minHeight: 'calc(100vh - 40px)',
            marginTop: '40px', // Push content below header
            overflow: 'auto',
            padding: isMobile ? '16px' : '24px', // Professional spacing like image
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
