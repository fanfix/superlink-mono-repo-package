"use client";

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Typography, Checkbox } from '@superline/design-system';
import { Instagram, Facebook, Twitter, YouTube } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const SocialLinksContainer = styled(Box)(({ theme }) => ({
  marginBottom: 'var(--padding-md)',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginBottom: 'var(--padding-lg)',
  },
  [theme.breakpoints.up('md')]: {
    marginBottom: 'var(--padding-xl)',
  },
}));

const SocialLinksTitle = styled(Typography)(({ theme }) => ({
  color: '#212121',
  marginBottom: '12px',
  fontSize: '16px',
  fontWeight: 600,
  [theme.breakpoints.up('sm')]: {
    marginBottom: '14px',
    fontSize: '17px',
  },
  [theme.breakpoints.up('md')]: {
    marginBottom: '16px',
    fontSize: '18px',
  },
}));

const SocialIconsContainer = styled(Box)({
  display: 'flex',
  gap: '12px',
  marginBottom: '24px'
});

const SocialIcon = styled(Box)({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#F5F5F5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#E0E0E0',
    transform: 'scale(1.05)'
  }
});

const SettingsSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
});

const SettingItem = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px'
});

const SettingContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
});

const SettingTitle = styled(Typography)({
  color: '#212121',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.4
});

const SettingDescription = styled(Typography)({
  color: '#616161',
  fontSize: '12px',
  lineHeight: 1.4
});

interface SocialLinksProps {
  socialMedia: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    facebook?: string;
  };
  agencyBranding?: boolean;
  monetization?: boolean;
  onAgencyBrandingChange?: (checked: boolean) => void;
  onMonetizationChange?: (checked: boolean) => void;
}

export default function SocialLinks({ 
  socialMedia, 
  agencyBranding = true, 
  monetization = true,
  onAgencyBrandingChange,
  onMonetizationChange 
}: SocialLinksProps) {
  const socialPlatforms = [
    {
      name: 'Instagram',
      icon: <Instagram sx={{ fontSize: 20, color: '#000000' }} />,
      handle: socialMedia.instagram
    },
    {
      name: 'Facebook',
      icon: <Facebook sx={{ fontSize: 20, color: '#000000' }} />,
      handle: socialMedia.facebook
    },
    {
      name: 'Twitter',
      icon: <Twitter sx={{ fontSize: 20, color: '#000000' }} />,
      handle: socialMedia.twitter
    },
    {
      name: 'TikTok',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#000000"/>
        </svg>
      ),
      handle: socialMedia.tiktok
    },
    {
      name: 'YouTube',
      icon: <YouTube sx={{ fontSize: 20, color: '#000000' }} />,
      handle: socialMedia.youtube
    }
  ];

  return (
    <SocialLinksContainer>
      <SocialLinksTitle>Social Links</SocialLinksTitle>
      
      <SocialIconsContainer>
        {socialPlatforms.map((platform) => (
          <SocialIcon
            key={platform.name}
            title={platform.handle ? `${platform.name}: ${platform.handle}` : `${platform.name} not connected`}
          >
            {platform.icon}
          </SocialIcon>
        ))}
      </SocialIconsContainer>

      <SettingsSection>
        <SettingItem>
          <Checkbox
            checked={agencyBranding}
            onChange={(checked) => onAgencyBrandingChange?.(checked)}
          />
          <SettingContent>
            <SettingTitle>Agency Branding</SettingTitle>
            <SettingDescription>Show agency logo on profile.</SettingDescription>
          </SettingContent>
        </SettingItem>

        <SettingItem>
          <Checkbox
            checked={monetization}
            onChange={(checked) => onMonetizationChange?.(checked)}
          />
          <SettingContent>
            <SettingTitle>Monetization</SettingTitle>
            <SettingDescription>Allow agency to handle monetization.</SettingDescription>
          </SettingContent>
        </SettingItem>
      </SettingsSection>
    </SocialLinksContainer>
  );
}
