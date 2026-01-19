'use client';

import React, { FC, useEffect, useState } from 'react';
import { Box, useMediaQuery, useTheme, IconButton } from '@mui/material';
import { Icon, Image } from '@superline/design-system';
import { Menu as MenuIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { UserProfileModal } from './UserProfileModal';

export interface HeaderProps {
  /**
   * Callback when hamburger menu is clicked
   */
  onMenuToggle?: () => void;
  /**
   * Whether sidebar is currently open
   */
  sidebarOpen?: boolean;
}

export const Header: FC<HeaderProps> = ({
  onMenuToggle,
  sidebarOpen = false,
}) => {
  const theme = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setIsClient(true);
  }, []);

  console.log('Header rendering...');
  console.log('isMobile:', isMobile);
  console.log('isClient:', isClient);

  const handleMenuClick = () => {
    if (onMenuToggle) {
      onMenuToggle();
    }
  };

  const handleRetryClick = () => {
    // Add retry/refresh functionality here
    console.log('Retry clicked');
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleProfileModalClose = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        height: '40px',
        width: '100%',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
      }}
    >
      {/* Left Section - Hamburger Menu */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {isClient && isMobile && (
          <IconButton
            onClick={handleMenuClick}
            sx={{
              padding: '8px',
              borderRadius: '4px',
              color: '#333333',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <Icon
              icon={<MenuIcon />}
              size="md"
              color="black"
            />
          </IconButton>
        )}
      </Box>

      {/* Right Section - Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <IconButton
          onClick={handleRetryClick}
          sx={{
            padding: '8px',
            borderRadius: '4px',
            color: '#333333',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <Icon
            icon={<RefreshIcon />}
            size="md"
            color="black"
          />
        </IconButton>
        
        {/* Profile Button */}
        <Box
          onClick={handleProfileClick}
          sx={{
            position: 'relative',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <Image
            src="/navbar_icon.png"
            alt="User Profile"
            variant="rounded-full"
            width="32px"
            height="32px"
          />
          {/* Status Indicator */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '10px',
              height: '10px',
              backgroundColor: '#4caf50',
              borderRadius: '50%',
              border: '2px solid white',
              zIndex: 1,
            }}
          />
        </Box>
      </Box>
      
      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleProfileModalClose}
      />
    </Box>
  );
};
