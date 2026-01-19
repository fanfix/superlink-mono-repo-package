'use client';

import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Backdrop } from '@mui/material';
import { Image, Typography } from '@superline/design-system';

const ModalBackdrop = styled(Backdrop)({
  backgroundColor: 'transparent',
  zIndex: 1300,
});

const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '80px', // Position below header
  right: '16px',
  zIndex: 1301,
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
  border: '1px solid #e0e0e0',
  padding: '24px',
  minWidth: '280px',
  maxWidth: '320px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  transform: 'translateY(-10px)',
  opacity: 0,
  transition: 'all 0.2s ease-in-out',
  '&.open': {
    transform: 'translateY(0)',
    opacity: 1,
  },
  '@media (max-width: 768px)': {
    right: '16px',
    left: '16px',
    minWidth: 'auto',
    maxWidth: 'none',
  },
}));

const UserInfoSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const AvatarContainer = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StatusDot = styled(Box)({
  position: 'absolute',
  bottom: '2px',
  right: '2px',
  width: '12px',
  height: '12px',
  backgroundColor: '#4caf50',
  borderRadius: '50%',
  border: '2px solid white',
  zIndex: 1,
});

const UserDetails = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  cursor: 'pointer',
});

const UserName = styled(Typography)({
  fontSize: '16px',
  fontWeight: '600',
  color: '#333333',
  lineHeight: 1.2,
});

const UserEmail = styled(Typography)({
  fontSize: '14px',
  color: '#666666',
  lineHeight: 1.2,
});

const MenuSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const MenuItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ isActive }) => ({
  padding: '8px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: isActive ? '600' : '400',
  color: isActive ? '#333333' : '#666666',
  transition: 'all 0.15s ease',
  '&:hover': {
    backgroundColor: '#f5f5f5',
    color: '#333333',
  },
  '&:active': {
    backgroundColor: '#e0e0e0',
    transform: 'scale(0.98)',
  },
}));

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('[data-modal-container]')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleMenuItemClick = (itemId: string) => {
    setActiveItem(itemId);
    // Add your menu item logic here
    setTimeout(() => {
      onClose();
      setActiveItem(null);
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <ModalBackdrop open={isOpen} onClick={onClose}>
      <ModalContainer
        className={isVisible ? 'open' : ''}
        data-modal-container
        onClick={(e) => e.stopPropagation()}
      >
        <UserInfoSection>
          <AvatarContainer>
            <Image
              src="/navbar_icon.png"
              alt="User Profile"
              variant="rounded-full"
              width="40px"
              height="40px"
            />
            <StatusDot />
          </AvatarContainer>
          <UserDetails>
            <UserName>Admin User</UserName>
            <UserEmail>admin@superlink.com</UserEmail>
          </UserDetails>
        </UserInfoSection>

        <MenuSection>
          <MenuItem
            isActive={activeItem === 'edit'}
            onClick={() => handleMenuItemClick('edit')}
          >
            Edit Profile
          </MenuItem>
          <MenuItem
            isActive={activeItem === 'logout'}
            onClick={() => handleMenuItemClick('logout')}
          >
            Logout
          </MenuItem>
        </MenuSection>
      </ModalContainer>
    </ModalBackdrop>
  );
};
