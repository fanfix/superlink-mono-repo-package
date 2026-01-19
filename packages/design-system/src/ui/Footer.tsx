import React, { FC, ReactElement } from 'react';
import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Icon } from './Icon';
import { Typography } from './Typography';
import {
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { Image } from './Image';
export interface FooterProps {
  /**
   * The variant of the footer
   * @default 'dark'
   */
  variant?: 'dark' | 'light';
  /**
   * Company name
   */
  companyName?: string;
  /**
   * Copyright text
   */
  copyrightText?: string;
  /**
   * Social media links
   */
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    email?: string;
  };
  /**
   * Social media click handlers
   */
  onSocialClick?: (platform: 'instagram' | 'linkedin' | 'email') => void;
  /**
   * Custom width override
   */
  width?: string | number;
  /**
   * Custom height override
   */
  height?: string | number;
}

const StyledFooter = styled(Box)<{ variant?: string }>(({ theme, variant }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '600px',
  height: '127.33px',
  paddingLeft: '50px',
  paddingRight: '50px',
  paddingTop: '40px',
  paddingBottom: '40px',
  gap: 'auto',
  
  ...(variant === 'dark' && {
    backgroundColor: '#14171F',
    color: 'var(--color-white)',
  }),
  
  ...(variant === 'light' && {
    backgroundColor: 'var(--color-grey-footer)',
    color: '#14171F',
  }),
}));

const LeftSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 'var(--padding-sm)',
}));

const RightSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--padding-lg)',
}));

const CompanyLogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--padding-sm)',
}));

const CompanyLogoIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  flexShrink: 0,
}));

const CompanyName = styled(Typography)<{ footerVariant?: string }>(({ theme, footerVariant }) => ({
  fontSize: 'var(--font-size-lg)',
  fontWeight: 'var(--font-weight-semibold)',
  fontFamily: 'var(--font-family-primary)',
  lineHeight: 1,
  color: footerVariant === 'dark' ? 'var(--color-white)' : '#14171F',
}));

const CopyrightText = styled(Typography)<{ footerVariant?: string }>(({ theme, footerVariant }) => ({
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-normal)',
  fontFamily: 'var(--font-family-primary)',
  lineHeight: 1,
  opacity: 0.8,
  color: footerVariant === 'dark' ? 'var(--color-white)' : '#14171F',
}));

const SocialIconButton = styled(IconButton)<{ variant?: string }>(({ theme, variant }) => ({
  padding: 'var(--padding-sm)',
  borderRadius: 'var(--border-radius-sm)',
  color: variant === 'dark' ? 'var(--color-white)' : '#14171F',
  '&:hover': {
    backgroundColor: variant === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(20, 23, 31, 0.1)',
  },
}));

export const Footer: FC<FooterProps> = ({
  variant = 'dark',
  companyName = 'SuperLink',
  copyrightText = '© 2022 Superlink - All Rights Reserved',
  socialLinks,
  onSocialClick,
  width,
  height,
}) => {
  const footerStyles = {
    ...(width && { width }),
    ...(height && { height }),
  };

  const handleSocialClick = (platform: 'instagram' | 'linkedin' | 'email') => {
    if (onSocialClick) {
      onSocialClick(platform);
    }
    // Open external links if provided
    const link = socialLinks?.[platform];
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <StyledFooter variant={variant} sx={footerStyles}>
      {/* Left Section - Company Branding */}
      <LeftSection>
        <CompanyLogoContainer>
          <CompanyLogoIcon>
            <Image
              src={variant === 'dark' ? 'public/footer_icon.png' : 'public/black_footer_icon.png'}
              alt={'Company Logo'}
              variant="rounded-sm"
              size="sm"
              width="24px"
              height="24px"
              objectFit="contain"
            />
          </CompanyLogoIcon>
          <CompanyName footerVariant={variant}>
            {companyName}
          </CompanyName>
        </CompanyLogoContainer>
        
        <CopyrightText footerVariant={variant}>
          {copyrightText}
        </CopyrightText>
      </LeftSection>

      {/* Right Section - Social Media Icons */}
      <RightSection>
        {/* Instagram Icon */}
        <SocialIconButton 
          variant={variant}
          onClick={() => handleSocialClick('instagram')}
        >
          <Icon
            icon={<InstagramIcon />}
            size="lg"
            color={variant === 'dark' ? 'white' : 'black'}
          />
        </SocialIconButton>

        {/* LinkedIn Icon */}
        <SocialIconButton 
          variant={variant}
          onClick={() => handleSocialClick('linkedin')}
        >
          <Icon
            icon={<LinkedInIcon />}
            size="lg"
            color={variant === 'dark' ? 'white' : 'black'}
          />
        </SocialIconButton>

        {/* Email Icon */}
        <SocialIconButton 
          variant={variant}
          onClick={() => handleSocialClick('email')}
        >
          <Icon
            icon={<EmailIcon />}
            size="lg"
            color={variant === 'dark' ? 'white' : 'black'}
          />
        </SocialIconButton>
      </RightSection>
    </StyledFooter>
  );
};
