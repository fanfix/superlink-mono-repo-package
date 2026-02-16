'use client';

import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Backdrop } from '@mui/material';
import { Image, Typography } from '@superline/design-system';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useProfileApi } from '../../hooks';

const ModalBackdrop = styled(Backdrop)({
  backgroundColor: 'transparent',
  zIndex: 1300,
});

const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '140px', // Position below header button
  right: 'var(--padding-3xl)',
  zIndex: 1301,
  backgroundColor: 'var(--color-white)',
  borderRadius: 'var(--border-radius-lg)',
  boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
  border: '1px solid var(--color-border-light)',
  padding: 'var(--padding-xl)',
  minWidth: '280px',
  maxWidth: '320px',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--padding-lg)',
  transform: 'translateY(-10px)',
  opacity: 0,
  transition: 'all 0.2s ease-in-out',
  '&.open': {
    transform: 'translateY(0)',
    opacity: 1,
  },
  '@media (max-width: 768px)': {
    right: 'var(--padding-lg)',
    left: 'var(--padding-lg)',
    minWidth: 'auto',
    maxWidth: 'none',
  },
}));

const UserInfoSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--padding-md)',
});

const AvatarContainer = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const AvatarWrapper = styled(Box)({
  position: 'relative',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: 'var(--color-success-main)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

const AvatarIcon = styled(Box)({
  width: '24px',
  height: '24px',
  backgroundColor: 'var(--color-success-light)',
  borderRadius: '50%',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '6px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '6px',
    height: '6px',
    backgroundColor: 'var(--color-success-main)',
    borderRadius: '50%',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '6px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '12px',
    height: '8px',
    backgroundColor: 'var(--color-success-main)',
    borderRadius: '6px 6px 0 0',
  },
});

const StatusDot = styled(Box)({
  position: 'absolute',
  bottom: '2px',
  right: '2px',
  width: '12px',
  height: '12px',
  backgroundColor: 'var(--color-success-main)',
  borderRadius: '50%',
  border: '2px solid var(--color-white)',
  zIndex: 1,
});

const UserDetails = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  cursor: 'pointer',
});

const UserName = styled(Typography)({
  fontSize: 'var(--font-size-md)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-black)',
  lineHeight: 1.2,
});

const UserEmail = styled(Typography)({
  fontSize: 'var(--font-size-sm)',
  //fontWeight: 'var(--font-weight-normal)',
  color: 'var(--color-grey-main)',
  lineHeight: 1.2,
});

const MenuSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--padding-sm)',
});

const MenuItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ isActive }) => ({
  padding: 'var(--padding-sm) var(--padding-md)',
  borderRadius: 'var(--border-radius-md)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-md)',
  fontWeight: isActive ? 'var(--font-weight-bold)' : 'var(--font-weight-normal)',
  color: isActive ? 'var(--color-black)' : 'var(--color-grey-main)',
  transition: 'all 0.15s ease',
  '&:hover': {
    color: 'var(--color-grey-800)',
  },
  '&:active': {
    color: 'var(--color-grey-800)',
    transform: 'scale(0.98)',
  },
}));

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { profile } = useProfileApi();
  const [isVisible, setIsVisible] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [avatarImageError, setAvatarImageError] = useState(false);
  const router = useRouter();

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
    
    if (itemId === 'logout') {
      logout();
      onClose();
      return;
    }

    if (itemId === 'edit') {
      router.push('/dashboard/settings');
    }
    
    // Add other menu item logic here
    setTimeout(() => {
      onClose();
      setActiveItem(null);
    }, 150);
  };

  if (!isOpen) return null;

  const DEFAULT_NAVBAR_ICON = '/navbar_icon.png';
  const profileImageUrl = profile?.imageURL || user?.avatar || user?.imageURL;
  const useNavbarIcon =
    avatarImageError ||
    !profileImageUrl ||
    (typeof profileImageUrl === 'string' && profileImageUrl.trim() === '');
  const modalAvatarSrc = useNavbarIcon ? DEFAULT_NAVBAR_ICON : profileImageUrl;

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
              src={modalAvatarSrc}
              alt="User Profile"
              variant="rounded-full"
              width="40px"
              height="40px"
              onError={() => setAvatarImageError(true)}
            />
            <StatusDot />
          </AvatarContainer>
          <UserDetails>
            <UserName>{profile?.name || user?.name || 'User'}</UserName>
            <UserEmail>{profile?.email || user?.email || 'user@example.com'}</UserEmail>
          </UserDetails>
        </UserInfoSection>

        <MenuSection>
          <MenuItem isActive={activeItem === 'edit'} onClick={() => handleMenuItemClick('edit')}>
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
