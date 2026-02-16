'use client';

import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Image } from '@superline/design-system';

import { UserProfileModal } from './UserProfileModal';
import { useProfileApi } from '../../hooks';

const RightSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--padding-lg)',
});

const UserAvatarContainer = styled(Box)({
  position: 'relative',
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.8,
  },
});

const StatusIndicator = styled(Box)({
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

interface HeaderProps {
  onMenuClick?: () => void;
}

const DEFAULT_NAVBAR_ICON = '/navbar_icon.png';

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatarImageError, setAvatarImageError] = useState(false);
  const { profile } = useProfileApi();
  const profileImage = profile?.imageURL;
  const avatarSrc =
    avatarImageError || !profileImage || (typeof profileImage === 'string' && profileImage.trim() === '')
      ? DEFAULT_NAVBAR_ICON
      : profileImage;

  const handleCreateColorClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <RightSection>
        <UserAvatarContainer onClick={handleCreateColorClick}>
          <Image
            src={avatarSrc}
            alt="User Profile"
            variant="rounded-full"
            width="40px"
            height="40px"
            onError={() => setAvatarImageError(true)}
          />
          <StatusIndicator />
        </UserAvatarContainer>
      </RightSection>

      <UserProfileModal isOpen={isModalOpen} onClose={handleModalClose} />
    </>
  );
};
