"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { Typography, Button, Image, DropdownMenu } from '@superline/design-system';
import { Delete, Login, PersonAdd, AccountBalance, ContentCopy, Edit } from '@mui/icons-material';
import { Creator } from '../../mockData';
import { styled } from '@mui/material/styles';

const ProfileHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 'var(--padding-md)',
  padding: 'var(--padding-md)',
  backgroundColor: 'var(--color-white)',
  borderRadius: 'var(--border-radius-md)',
  boxShadow: 'var(--shadow-sm)',
  marginBottom: 'var(--padding-md)',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 'var(--padding-lg)',
    marginBottom: 'var(--padding-lg)',
    gap: 'var(--padding-lg)',
  },
  [theme.breakpoints.up('md')]: {
    padding: 'var(--padding-xl)',
    marginBottom: 'var(--padding-xl)',
    gap: 'var(--padding-xl)',
  },
}));

const ProfileInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 'var(--padding-md)',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    gap: 'var(--padding-lg)',
    width: 'auto',
  },
  [theme.breakpoints.up('md')]: {
    gap: '24px',
  },
}));

const ProfileDetails = styled(Box)({
  display: 'flex',
  flexDirection: 'column'
});

const NameRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 'var(--padding-xs)',
  marginBottom: '8px',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 'var(--padding-md)',
    width: 'auto',
  },
  [theme.breakpoints.up('md')]: {
    gap: '20px',
  },
}));

const ProfileName = styled(Typography)(({ theme }) => ({
  color: '#212121',
  fontSize: '18px',
  fontWeight: 600,
  lineHeight: 1.2,
  [theme.breakpoints.up('sm')]: {
    fontSize: '20px',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '24px',
  },
}));

const ProfileEmail = styled(Typography)({
  color: '#616161',
  fontSize: '14px',
  lineHeight: 1.4
});

const TagBadge = styled(Box)({
  display: 'inline-block',
  backgroundColor: '#EEEEEE',
  color: '#212121',
  padding: '6px 12px',
  borderRadius: '16px',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1
});

const DropdownContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const DropdownWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>(({ isOpen }) => ({
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: '8px',
  zIndex: 1000,
  display: isOpen ? 'block' : 'none'
}));

const CustomDropdownMenu = styled(Box)({
  backgroundColor: 'var(--color-white)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-sm)',
  boxShadow: 'var(--shadow-lg)',
  minWidth: '200px',
  padding: '8px 0'
});

const CustomMenuItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDanger',
})<{ isDanger?: boolean }>(({ isDanger }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: isDanger ? 500 : 400,
  color: isDanger ? 'var(--color-error)' : 'var(--color-black)',
  '&:hover': {
    backgroundColor: 'var(--color-grey-light)'
  }
}));

const MenuIconWrapper = styled(Box)<{ color?: string }>(({ color }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '16px',
  height: '16px',
  color: color || 'inherit'
}));

const ProfileImage = styled(Image)(({ theme }) => ({
  borderRadius: '50%',
  objectFit: 'cover',
  backgroundColor: '#000000',
  width: '48px !important',
  height: '48px !important',
  minWidth: '48px',
  minHeight: '48px',
  [theme.breakpoints.up('sm')]: {
    width: '56px !important',
    height: '56px !important',
    minWidth: '56px',
    minHeight: '56px',
  },
  [theme.breakpoints.up('md')]: {
    width: '64px !important',
    height: '64px !important',
    minWidth: '64px',
    minHeight: '64px',
  },
}));

const MoreButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '36px',
  backgroundColor: '#FFFFFF',
  color: '#212121',
  border: '1px solid #D0D0D0',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 500,
  padding: '8px 16px',
  '&:hover': {
    backgroundColor: '#F5F5F5',
    border: '1px solid #B0B0B0'
  },
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
    minWidth: '80px',
  },
}));

interface CreatorProfileHeaderProps {
  creator: Creator;
  onEdit?: () => void;
  onDelete?: () => void;
  onLogin?: () => void;
  onAccountClaim?: () => void;
  onStripeConnect?: () => void;
  onDuplicate?: () => void;
}

export default function CreatorProfileHeader({
  creator,
  onEdit,
  onDelete,
  onLogin,
  onAccountClaim,
  onStripeConnect,
  onDuplicate
}: CreatorProfileHeaderProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const DEFAULT_AVATAR_SRC = '/assets/default-avatar.svg';
  const avatarSrc =
    profileImageError
      ? DEFAULT_AVATAR_SRC
      : (creator.profileImage || creator.assignedAvatar || DEFAULT_AVATAR_SRC);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  const moreMenuItems = [
    {
      id: 'delete',
      label: 'Delete',
      icon: 'delete',
      isDanger: true,
      onClick: onDelete
    },
    {
      id: 'login',
      label: 'Log In',
      icon: 'login',
      onClick: onLogin
    },
    {
      id: 'account-claim',
      label: 'Account Claim Link',
      icon: 'account-claim',
      onClick: onAccountClaim
    },
    {
      id: 'stripe',
      label: 'Connect Stripe Link',
      icon: 'stripe',
      onClick: onStripeConnect
    },
    {
      id: 'duplicate',
      label: 'Duplicate Profile',
      icon: 'duplicate',
      onClick: onDuplicate
    },
    {
      id: 'edit',
      label: 'Edit Profile',
      icon: 'edit',
      onClick: onEdit
    }
  ];

  return (
    <ProfileHeaderContainer>
      {/* Left side - Avatar, Name, Email, Tag */}
      <ProfileInfo>
        <ProfileImage
          src={avatarSrc}
          alt={creator.name}
          onError={() => setProfileImageError(true)}
        />
        <ProfileDetails>
          <NameRow>
            <ProfileName>{creator.name}</ProfileName>
            <TagBadge>tag here</TagBadge>
          </NameRow>
          <ProfileEmail>{creator.email}</ProfileEmail>
        </ProfileDetails>
      </ProfileInfo>

      {/* Right side - More button with dropdown */}
      <DropdownContainer ref={dropdownRef}>
        <MoreButton
          variant="outline-sm"
          onClick={() => setShowMoreMenu(!showMoreMenu)}
        >
          More
        </MoreButton>
        
        <DropdownWrapper isOpen={showMoreMenu}>
          <CustomDropdownMenu>
            {moreMenuItems.map((item) => (
              <CustomMenuItem
                key={item.id}
                isDanger={item.isDanger}
                onClick={() => {
                  item.onClick?.();
                  setShowMoreMenu(false);
                }}
              >
                <MenuIconWrapper color={item.isDanger ? 'var(--color-error)' : undefined}>
                  {item.icon === 'delete' && <Delete sx={{ fontSize: 16 }} />}
                  {item.icon === 'login' && <Login sx={{ fontSize: 16 }} />}
                  {item.icon === 'account-claim' && <PersonAdd sx={{ fontSize: 16 }} />}
                  {item.icon === 'stripe' && <AccountBalance sx={{ fontSize: 16 }} />}
                  {item.icon === 'duplicate' && <ContentCopy sx={{ fontSize: 16 }} />}
                  {item.icon === 'edit' && <Edit sx={{ fontSize: 16 }} />}
                </MenuIconWrapper>
                {item.label}
              </CustomMenuItem>
            ))}
          </CustomDropdownMenu>
        </DropdownWrapper>
      </DropdownContainer>
    </ProfileHeaderContainer>
  );
}
