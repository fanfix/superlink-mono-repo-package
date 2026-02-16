import React, { FC, ReactElement, useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Button } from './Button';
import { Icon } from './Icon';
import { Typography } from './Typography';
import { Image } from './Image';
export interface SidebarItem {
  /**
   * Unique identifier for the sidebar item
   */
  id: string;
  /**
   * Display label for the sidebar item
   */
  label: string;
  /**
   * Icon component for the sidebar item
   */
  icon: ReactElement;
  /**
   * Whether this item is currently active
   */
  active?: boolean;
  /**
   * Click handler for the sidebar item
   */
  onClick?: () => void;
}

export interface SidebarProps {
  /**
   * The variant of the sidebar
   * @default 'default'
   */
  variant?: 'default' | 'agency';
  /**
   * Array of sidebar navigation items
   */
  items: SidebarItem[];
  /**
   * Company logo image source
   */
  companyLogo?: string;
  /**
   * Company logo alt text
   */
  companyLogoAlt?: string;
  /**
   * Company name for the bottom logo area
   */
  companyName?: string;
  /**
   * Company logo image source for the bottom area
   */
  companyLogoIcon?: string;
  /**
   * Top logo image source (displayed in LogoArea at the top)
   */
  topLogo?: string;
  /**
   * Top logo alt text
   */
  topLogoAlt?: string;
  /**
   * Callback when an item is clicked
   */
  onItemClick?: (item: SidebarItem) => void;
  /**
   * Custom width override
   */
  width?: string | number;
  /**
   * Custom height override
   */
  height?: string | number;
}

const StyledSidebar = styled(Box)<{ variant?: string }>(({ theme, variant }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--color-background-primary)',
  borderRight: '1px solid var(--color-white-light)',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1000,
  
  ...(variant === 'agency' && {
    width: '218px',
    height: '100vh',
    padding: 'var(--padding-lg-1)',
    gap: 'var(--padding-lg-1)',
  }),
  
  ...(variant === 'default' && {
    width: 'var(--width-sm)',
    height: '100vh',
    padding: 'var(--padding-lg)',
    gap: 'var(--padding-lg)',
  }),
}));

const LogoArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '75px',
  backgroundColor: 'var(--color-white-sidebar)',
  marginBottom: 'var(--padding-lg-1)',
  padding: 'var(--padding-sm)',
  overflow: 'hidden',
}));

const NavigationArea = styled(Stack)(({ theme }) => ({
  flex: 1,
  gap: 'var(--padding-sm)',
}));


const CompanyLogoArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: 'var(--padding-sm)',
  padding: 'var(--padding-md) var(--padding-lg)',
  marginTop: 'auto',
  backgroundColor: 'var(--color-background-primary)',
}));

const CompanyLogoIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  flexShrink: 0,
}));

export const Sidebar: FC<SidebarProps> = ({
  variant = 'default',
  items,
  companyLogo,
  companyLogoAlt = 'Company Logo',
  companyName,
  companyLogoIcon,
  topLogo,
  topLogoAlt = 'Brand Logo',
  onItemClick,
  width,
  height,
}) => {
  const [activeItem, setActiveItem] = useState<string | null>(
    items.find(item => item.active)?.id || null
  );
  const DEFAULT_FOOTER_ICON = '/black_footer_icon.png';
  const [footerIconError, setFooterIconError] = useState(false);
  const [topLogoError, setTopLogoError] = useState(false);
  const sidebarFooterIconSrc =
    footerIconError || !companyLogoIcon || (typeof companyLogoIcon === 'string' && companyLogoIcon.trim() === '')
      ? DEFAULT_FOOTER_ICON
      : companyLogoIcon;
  const sidebarTopLogoSrc =
    topLogoError || !topLogo
      ? (companyLogoIcon && !footerIconError ? companyLogoIcon : DEFAULT_FOOTER_ICON)
      : topLogo;
  const showTopLogo = topLogo || topLogoError;

  // Sync activeItem state with items prop when items change
  useEffect(() => {
    const activeItemFromProps = items.find(item => item.active);
    if (activeItemFromProps) {
      // Update active item if it's different from current state
      setActiveItem(prevActive => {
        if (prevActive !== activeItemFromProps.id) {
          return activeItemFromProps.id;
        }
        return prevActive;
      });
    }
  }, [items]);

  const handleItemClick = (item: SidebarItem) => {
    setActiveItem(item.id);
    if (item.onClick) {
      item.onClick();
    }
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const sidebarStyles = {
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <StyledSidebar variant={variant} sx={sidebarStyles}>
      {/* Top Logo Area */}
      <LogoArea>
        {showTopLogo && (
          <Image
            src={sidebarTopLogoSrc}
            alt={topLogoAlt}
            variant="rounded-sm"
            size="md"
            width="100%"
            height="100%"
            objectFit="contain"
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
            onError={() => setTopLogoError(true)}
          />
        )}
      </LogoArea>
      {/* Navigation Items */}
      <NavigationArea>
        {items.map((item) => (
          <Button
            key={item.id}
            variant="primary-dark-sm"
            onClick={() => handleItemClick(item)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--padding-md)',
              minHeight: '48px',
              justifyContent: 'flex-start',
              width: '100%',
              textAlign: 'left',
              backgroundColor: activeItem === item.id ? 'var(--color-black-secondary)' : 'transparent',
              color: activeItem === item.id ? 'var(--color-white)' : 'var(--color-grey-main)',
              '&:hover': {
                backgroundColor: activeItem === item.id ? 'var(--color-black-secondary)' : 'var(--color-background-secondary)',
                color: activeItem === item.id ? 'var(--color-white)' : 'var(--color-black-secondary)',
              },
            }}
          >
            <Icon
              icon={item.icon}
              size="md"
              color={activeItem === item.id ? 'white' : 'secondary'}
            />
            <Typography
              variant="text-md"
              sx={{
                color: activeItem === item.id ? 'var(--color-white)' : 'var(--color-grey-main)',
                fontWeight: activeItem === item.id ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
              }}
            >
              {item.label}
            </Typography>
          </Button>
        ))}
      </NavigationArea>

      {/* Bottom Company Logo */}
      <CompanyLogoArea>
        {(companyLogoIcon || footerIconError) && (
          <CompanyLogoIcon>
            <Image
              src={sidebarFooterIconSrc}
              alt={companyLogoAlt || 'Company Logo'}
              variant="rounded-sm"
              size="sm"
              width="24px"
              height="24px"
              objectFit="contain"
              onError={() => setFooterIconError(true)}
            />
          </CompanyLogoIcon>
        )}
        {companyName && (
       
        <Typography variant="heading-sm" style={{fontWeight: '800 !important'}}>
            {companyName}
        </Typography>
        )}
      </CompanyLogoArea>
    </StyledSidebar>
  );
};
