import React, { FC, ReactElement } from 'react';
import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Icon } from './Icon';
import { Image } from './Image';
import {
  Menu as MenuIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

export interface NavbarProps {
  /**
   * The variant of the navbar
   * @default 'default'
   */
  variant?: 'default' | 'superlink';
  /**
   * Company logo icon source
   */
  companyLogoIcon?: string;
  /**
   * Company logo icon alt text
   */
  companyLogoAlt?: string;
  /**
   * Hamburger menu click handler
   */
  onMenuClick?: () => void;
  /**
   * Retry/refresh click handler
   */
  onRetryClick?: () => void;
  /**
   * Custom width override
   */
  width?: string | number;
  /**
   * Custom height override
   */
  height?: string | number;
  /**
   * Whether the navbar is in mobile view
   */
  isMobile?: boolean;
}

const StyledNavbar = styled(Box)<{ variant?: string; isMobile?: boolean }>(({ theme, variant, isMobile }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'var(--color-white)',
  borderBottom: '1px solid var(--color-white-light)',
  position: 'relative',
  
  ...(variant === 'superlink' && {
    width: isMobile ? '375px' : '1440px',
    height: '67px',
    paddingLeft: '30px',
    paddingRight: '30px',
    paddingTop: '0px',
    paddingBottom: '0px',
    gap: 'auto',
  }),
  
  ...(variant === 'default' && {
    width: isMobile ? '375px' : '100%',
    height: '67px',
    padding: 'var(--padding-lg)',
    gap: 'var(--padding-lg)',
  }),
}));

const LeftSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 'auto',
}));

const RightSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--padding-md)',
}));

const CompanyLogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: 'var(--border-radius-sm)',
  flexShrink: 0,
}));

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  padding: 'var(--padding-sm)',
  borderRadius: 'var(--border-radius-sm)',
  color: 'var(--color-black-secondary)',
  '&:hover': {
    backgroundColor: 'var(--color-background-secondary)',
  },
}));

export const Navbar: FC<NavbarProps> = ({
  variant = 'default',
  companyLogoIcon = '/navbar_icon.png',
  companyLogoAlt = 'Company Logo',
  onMenuClick,
  onRetryClick,
  width,
  height,
  isMobile = false,
}) => {
  const navbarStyles = {
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <StyledNavbar variant={variant} isMobile={isMobile} sx={navbarStyles}>
      {/* Left Section */}
      <LeftSection>
        {/* Hamburger Menu */}
        <IconButtonStyled onClick={onMenuClick}>
          <Icon
            icon={<MenuIcon />}
            size="md"
            color="black"
          />
        </IconButtonStyled>
        
        
      </LeftSection>

      {/* Right Section */}
      <RightSection>
        {/* Retry/Refresh Icon */}
        <IconButtonStyled onClick={onRetryClick}>
          <Icon
            icon={<RefreshIcon />}
            size="md"
            color="black"
          />
        </IconButtonStyled>

        {/* Company Logo Icon */}
        {companyLogoIcon && (
          <CompanyLogoContainer>
            <Image
              src={companyLogoIcon}
              alt={companyLogoAlt}
              variant="rounded-sm"
              size="sm"
              width="30px"
              height="30px"
              objectFit="contain"
            />
          </CompanyLogoContainer>
        )}
      </RightSection>
    </StyledNavbar>
  );
};
