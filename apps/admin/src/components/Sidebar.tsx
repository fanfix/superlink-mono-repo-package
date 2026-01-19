'use client';

import React, { FC, ReactElement, useState, useEffect } from 'react';
import { Box, Stack, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Icon, Typography } from '@superline/design-system';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Import Material UI icons directly
import {
  Dashboard as DashboardIcon,
  Person as UsersIcon,
  PersonAdd as BiosIcon,
  Flag as ReportsIcon,
  AdminPanelSettings as AdminsIcon,
  Groups as AgenciesIcon,
  Work as SubscriptionsIcon,
  BarChart as BrandKitLeadsIcon,
  Lock as LockIcon,
  Close as CloseIcon
} from '@mui/icons-material';

export interface SidebarItem {
  id: string;
  label: string;
  icon: ReactElement;
  active?: boolean;
  onClick?: () => void;
  hasNotification?: boolean;
  href?: string;
}

export interface AdminSidebarProps {
  items: SidebarItem[];
  onItemClick?: (item: SidebarItem) => void;
}

const StyledSidebar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'transparent',
  width: '100%',
  height: 'calc(100vh - 40px)', // Subtract header height
  padding: '10px 30px',
  gap: '0px',
  position: 'sticky', // Make it sticky
  top: '64px', // Start below header
  left: 0,
  zIndex: 1000,
  [theme.breakpoints.down('md')]: {
    backgroundColor: 'white',
    // boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
    padding: '0px', // Remove padding for mobile, will be handled by close button
    position: 'fixed', // Fixed on mobile for overlay behavior
    top: '-24px', // Also start below header on mobile
  },
}));

const SidebarMenuItem = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: 'fit-content',
  minHeight: '52px',
  justifyContent: 'flex-start',
  backgroundColor: 'transparent',
  color: '#666666',
  padding: '8px 0px',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontSize: '16px',
  fontWeight: '400',
  position: 'relative',
  '&:hover': {
    
    color: '#333333',
    fontWeight: '500',
  },
  '&.active': {
    
    color: '#333333',
    fontWeight: '500',
  },
}));

const NotificationDot = styled(Box)(() => ({
  width: '8px',
  height: '8px',

  marginLeft: 'auto',
}));

export const AdminSidebar: FC<AdminSidebarProps> = ({
  items,
  onItemClick,
}) => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string | null>('dashboard');
  const theme = useTheme();
  // Show close button on mobile and tablet (md and below)
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Update active item based on current pathname
  useEffect(() => {
    console.log('Current pathname:', pathname);
    console.log('Available items:', items.map(item => ({ id: item.id, href: item.href })));
    
    const currentItem = items.find(item => item.href === pathname);
    if (currentItem) {
      console.log('Found matching item:', currentItem.id);
      setActiveItem(currentItem.id);
    } else if (pathname === '/dashboard') {
      console.log('Setting dashboard as active');
      setActiveItem('dashboard');
    }
  }, [pathname, items]);

  const handleItemClick = (item: SidebarItem) => {
    setActiveItem(item.id);
    if (item.onClick) {
      item.onClick();
    }
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const handleCloseSidebar = () => {
    // This will be handled by the parent Layout component
    if (onItemClick) {
      onItemClick({ id: 'close', label: 'Close', icon: null } as SidebarItem);
    }
  };

  return (
    <StyledSidebar>
      {/* Mobile/Tablet Close Button */}
      {isMobileOrTablet && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '16px 16px 8px 16px',
            borderBottom: '1px solid #e0e0e0',
            marginBottom: '16px',
          }}
        >
          <Box
            onClick={handleCloseSidebar}
            sx={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
          >
            <Icon
              icon={<CloseIcon />}
              size="sm"
              color="black"
            />
          </Box>
        </Box>
      )}
      
      <Stack 
        spacing={1} 
        sx={{ 
          flex: 1, 
          width: '100%', 
          padding: isMobileOrTablet ? '0 16px' : '0',
          overflowY:'auto',
          maxHeight: isMobileOrTablet ? 'calc(100vh - 120px)' : 'none',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#a8a8a8',
            },
          },
        }}
      >
        {items.map((item) => {
          const MenuItemContent = (
            <SidebarMenuItem
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={activeItem === item.id ? 'active' : ''}
            >
              <Icon
                icon={item.icon}
                size="xl"
                color={activeItem === item.id ? 'black' : 'secondary'}
                sx={{
                  fontSize: '28px',
                  color: activeItem === item.id ? 'var(--color-black-primary)' : 'var(--color-secondary)',
                }}
              />
              <Typography
                variant="text-sm"
                sx={{
                  color: activeItem === item.id ? 'var(--color-black-primary)' : 'var(--color-secondary)',
               fontWeight: 'var(--font-weight-regular)'
                }}
              >
                {item.label}
              </Typography>
              {item.hasNotification && <NotificationDot />}
            </SidebarMenuItem>
          );

          return item.href ? (
            <Link key={item.id} href={item.href} style={{ textDecoration: 'none', marginTop: '0px' }}>
              {MenuItemContent}
            </Link>
          ) : (
            MenuItemContent
          );
        })}
      </Stack>
    </StyledSidebar>
  );
};

// Default sidebar items for admin dashboard
export const defaultAdminSidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    active: true,
    href: '/dashboard',
  },
  {
    id: 'users',
    label: 'Users',
    icon: <UsersIcon />,
    href: '/users',
  },
  {
    id: 'bios',
    label: 'Bios',
    icon: <BiosIcon />,
    href: '/bios',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: <ReportsIcon />,
    href: '/reports',
  },
  {
    id: 'admins',
    label: 'Admins',
    icon: <AdminsIcon />,
    href: '/admins',
  },
  {
    id: 'agencies',
    label: 'Agencies',
    icon: <AgenciesIcon />,
    href: '/agencies',
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    icon: <SubscriptionsIcon />,
    href: '/subscriptions',
  },
  {
    id: 'brand-kit-leads',
    label: 'Brand kit leads',
    icon: <BrandKitLeadsIcon />,
    hasNotification: true,
    href: '/brand-kit-leads',
  },
  {
    id: 'superlockeds',
    label: 'Superlockeds',
    icon: <LockIcon />,
    hasNotification: true,
    href: '/superlockeds',
  },
];
