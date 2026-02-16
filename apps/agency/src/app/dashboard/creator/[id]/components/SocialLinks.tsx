"use client";

import React from 'react';
import { Box } from '@mui/material';
import { Typography, Checkbox } from '@superline/design-system';
import { getSocialIcon } from '../../socialIcons';
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
  textDecoration: 'none',
  color: 'inherit',
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

export interface SocialLinkItem {
  name: string;
  url?: string;
  link?: string;
}

interface SocialLinksProps {
  socialLinks: SocialLinkItem[];
  agencyBranding?: boolean;
  monetization?: boolean;
  onAgencyBrandingChange?: (checked: boolean) => void;
  onMonetizationChange?: (checked: boolean) => void;
}

export default function SocialLinks({ 
  socialLinks, 
  agencyBranding = true, 
  monetization = true,
  onAgencyBrandingChange,
  onMonetizationChange 
}: SocialLinksProps) {
  // Agar array khali hai to pura section hide - na icons, kuch bhi nahi
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  const linksWithUrl = socialLinks.filter(
    (item) => (item.url || item.link || '').trim() !== ''
  );
  // Agar koi bhi valid link nahi to bhi kuch mat dikhao
  if (linksWithUrl.length === 0) {
    return null;
  }

  return (
    <SocialLinksContainer>
      <SocialLinksTitle>Social Links</SocialLinksTitle>
      
      <SocialIconsContainer>
        {linksWithUrl.map((item, index) => {
          const linkUrl = item.url || item.link || '';
          const platformName = item.name?.toLowerCase() || 'other';
          const icon = getSocialIcon(platformName, 20, '#000000');
          if (!icon) return null;
          return (
            <SocialIcon
              key={`${platformName}-${index}`}
              component="a"
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`${item.name}: ${linkUrl}`}
            >
              {icon}
            </SocialIcon>
          );
        })}
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
