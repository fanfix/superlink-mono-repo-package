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
import { useAuth } from '../../../../../../contexts/AuthContext';
import { useLogout } from '../../../../../../hooks/useAuthApi';
import Loader from '../../../../../../components/Loader';
import { SettingsModalProps, SettingsTab } from './types';
import { SETTINGS_TABS } from './constants';
import { settingsModalStyles } from './styles';
export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const theme = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>('my-account');
  const [signingOut, setSigningOut] = useState(false);
  const { clearAuth } = useAuth();
  const { execute: logout } = useLogout();

  const handleSignout = useCallback(() => {
    // Show full-screen loader immediately
    setSigningOut(true);

    // Fire-and-forget server-side logout; do NOT block redirect on this
    void logout().catch(() => undefined);

    // Always clear local tokens + user cache everywhere
    clearAuth();

    // Close the modal first
    onClose();

    // Redirect to login page (replace to prevent back navigation)
    router.replace('/login');

    // Fallback: force navigation if router doesn't update for any reason
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }, 150);
    }
  }, [logout, clearAuth, router, onClose]);

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
    <>
      {signingOut && <Loader fullScreen={true} />}
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
    </>
  );
}

