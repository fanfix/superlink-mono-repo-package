'use client';

import React, { useState, useCallback } from 'react';
import { Box, IconButton, Modal, useTheme } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import MyAccount from '../../../../settings/MyAccount';
import Monetization from '../../../../settings/Monetization';
import TippingHistory from '../../../../settings/TippingHistory';
import ManageAccess from '../../../../settings/ManageAccess';
import EmailSupport from '../../../../settings/EmailSupport';
import { SettingsModalProps, SettingsTab } from './types';
import { SETTINGS_TABS } from './constants';
import { settingsModalStyles } from './styles';
export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const theme = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>('my-account');

  const handleSignout = useCallback(() => {
    // Clear all localStorage items
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
      localStorage.removeItem('onboarding-complete');
      
      // Clear all sessionStorage items
      sessionStorage.removeItem('login-phone');
      sessionStorage.removeItem('signup-phone');
      sessionStorage.removeItem('auth-flow');
    }
    
    // Close the modal first
    onClose();
    
    // Redirect to login page
    router.push('/login');
  }, [router, onClose]);

  const handleTabClick = useCallback((tabId: SettingsTab) => {
    if (tabId === 'signout') {
      handleSignout();
    } else {
      setActiveTab(tabId);
    }
  }, [handleSignout]);

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case 'my-account':
        return <MyAccount />;
      case 'monetization':
        return <Monetization />;
      case 'tipping-history':
        return <TippingHistory />;
      case 'manage-access':
        return <ManageAccess />;
      case 'email-support':
        return <EmailSupport />;
      default:
        return <MyAccount />;
    }
  }, [activeTab]);

  return (
    <Modal open={open} onClose={onClose} sx={settingsModalStyles.modal} disableAutoFocus disableEnforceFocus>
      <Box sx={settingsModalStyles.modalContent(theme)}>
        <IconButton sx={settingsModalStyles.closeButton(theme)} onClick={onClose} aria-label="Close settings">
          <Close sx={{ fontSize: 'var(--icon-size-md)', color: 'black' }} />
        </IconButton>

        <Box sx={settingsModalStyles.sidebar(theme)}>
          {SETTINGS_TABS.map((tab) => {
            const isSignout = tab.id === 'signout';
            const baseStyles = settingsModalStyles.tabButton(!isSignout && activeTab === tab.id, theme);
            const signoutStyles = isSignout ? {
              color: 'var(--color-error-main)',
              '&:hover': {
                backgroundColor: 'var(--color-error-light)',
                color: 'var(--color-error-dark)',
              },
            } : {};
            return (
              <Box
                key={tab.id}
                sx={{ ...baseStyles, ...signoutStyles }}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </Box>
            );
          })}
        </Box>

        <Box sx={settingsModalStyles.contentArea(theme)}>{renderTabContent()}</Box>
      </Box>
    </Modal>
  );
}

