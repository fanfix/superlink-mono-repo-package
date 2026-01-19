'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Avatar, IconButton } from '@mui/material';
import { Typography, Card, Button, TextField, Checkbox, Toast, Loader } from '@superline/design-system';
import { Add as AddIcon, Chat as ChatIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { Icon } from '@superline/design-system';
import { useProfileApi, useSettingsApi } from '../../../hooks';
import type { StripeAccount } from '../../../api/types';
import { useAuth } from '../../../contexts/AuthContext';

type SettingsSection = 'profile' | 'change-password' | 'branding' | 'company-details' | 'payments';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  // Add these state variables after your existing useState declarations
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isStripeConnected, setIsStripeConnected] = useState(false);
  const [isSingleStripePayout, setIsSingleStripePayout] = useState(false);
  const [stripeAccount, setStripeAccount] = useState<StripeAccount | null>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const {
    profile,
    loading,
    uploadProfileImage,
    updateProfile,
    updateAgencyBranding,
    loadingStates: profileLoadingStates,
  } = useProfileApi();
  const { changePassword } = useAuth();
  const {
    fetchPayoutMethod,
    fetchStripeAccountDetails,
    fetchStripeDashboardLink,
    updatePayoutMethod,
  } = useSettingsApi();
  const { execute: fetchPayoutMethodExecute } = fetchPayoutMethod;
  const { execute: fetchStripeAccountDetailsExecute } = fetchStripeAccountDetails;
  const {
    execute: fetchStripeDashboardLinkExecute,
    loading: stripeDashboardLinkLoading,
  } = fetchStripeDashboardLink;
  const {
    execute: updatePayoutMethodExecute,
    loading: updatePayoutMethodLoading,
  } = updatePayoutMethod;
  const isSavingProfile = profileLoadingStates.update;
  const isSavingBranding = profileLoadingStates.agencyUpdate;
  const isUploadingImage = profileLoadingStates.imageUpload;
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [toastState, setToastState] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = 'profile-photo-input';
  const brandingFileInputRef = useRef<HTMLInputElement>(null);
  const brandingFileInputId = 'brand-logo-input';
  const stripeSetupRedirectedRef = useRef(false);

  const [profileData, setProfileData] = useState({
    name: profile?.name ?? '',
    email: profile?.email ?? '',
    phone: profile?.phoneNumber ?? '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    imageURL: profile?.imageURL ?? '',
  });

  const [brandingData, setBrandingData] = useState({
    agencyId: profile?.agencyId ?? '',
    name: profile?.agencyName ?? '',
    email: profile?.brandingEmail ?? '',
    phone: profile?.brandingPhoneNumber ?? '',
    website: profile?.website ?? '',
    introMessage: profile?.introMessage ?? '',
    imageURL: profile?.brandImageURL ?? '',
    displayAgencyBranding: !!profile?.displayAgencyBranding,
  });

  const [companyData, setCompanyData] = useState({
    street: profile?.companyStreet ?? '',
    city: profile?.companyCity ?? '',
    state: profile?.companyState ?? '',
    postalCode: profile?.companyPostalCode ?? '',
    country: profile?.companyCountry ?? '',
    landmark: profile?.companyLandmark ?? '',
  });

  useEffect(() => {
    if (activeSection !== 'payments') {
      return;
    }

    const initializePayments = async () => {
      try {
        const payout = await fetchPayoutMethodExecute();
        if (payout) {
          setIsSingleStripePayout(payout.payoutMethod === 'agency_payout');
        }
      } catch (error) {
        console.error('SettingsPage: ❌ Failed to fetch payout method', error);
      }

      try {
        const account = await fetchStripeAccountDetailsExecute();
        if (account) {
          setStripeAccount(account);
          setIsStripeConnected(Boolean(account.transferAllowed));

          if (account.url && !stripeSetupRedirectedRef.current && typeof window !== 'undefined') {
            stripeSetupRedirectedRef.current = true;
            window.location.href = account.url;
          }
        } else {
          setStripeAccount(null);
          setIsStripeConnected(false);
        }
      } catch (error) {
        console.error('SettingsPage: ❌ Failed to fetch Stripe account details', error);
      }
    };

    void initializePayments();
  }, [
    activeSection,
    fetchPayoutMethodExecute,
    fetchStripeAccountDetailsExecute,
  ]);

  const EyeIcon = ({ isVisible }: { isVisible: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
        stroke="#808080"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke="#808080"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {!isVisible && <path d="M1 1L23 23" stroke="#808080" strokeWidth="2" strokeLinecap="round" />}
    </svg>
  );

  // Main container styles
  const mainContainerStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)', md: 'var(--padding-2xl)', lg: 'var(--padding-3xl)' },
    gap: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)', md: 'var(--padding-xl)', lg: 'var(--padding-2xl)' },
    backgroundColor: 'var(--color-white-sidebar)',
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
  };

  // Content card styles
  const contentCardStyles = {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    position: 'relative',
  };

  // Nested sidebar styles
  const nestedSidebarStyles = {
    width: { xs: '100%', md: '240px' },
    backgroundColor: 'var(--color-white)',
    borderRight: { xs: 'none', md: '1px solid var(--color-white-light)' },
    borderBottom: { xs: '1px solid var(--color-white-light)', md: 'none' },
    padding: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)', md: 'var(--padding-xl)' },
    display: 'flex',
    flexDirection: { xs: 'row', md: 'column' },
    gap: { xs: 'var(--padding-sm)', md: 'var(--padding-md)' },
    overflowX: { xs: 'auto', md: 'visible' },
    overflowY: { xs: 'visible', md: 'auto' },
  };

  // Main content area styles
  const mainContentStyles = {
    flex: 1,
    padding: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)', md: 'var(--padding-xl)' },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'auto',
  };

  const saveButtonStyles = {
    minWidth: { xs: '100%', sm: 'var(--width-sm-1)' },
    width: { xs: '100%', sm: 'auto' },
    height: 'var(--height-sm-1)',
  };

  // Header styles
  const headerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--padding-lg)',
  };

  // Chat icon styles
  const chatIconStyles = {
    width: '40px',
    height: '40px',
    backgroundColor: 'var(--color-success-main)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };

  // Photo upload section styles
  const photoUploadStyles = {
    display: 'flex',
    alignItems: { xs: 'flex-start', sm: 'center' },
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)' },
  };

  // Avatar styles
  const avatarStyles = {
    width: { xs: '64px', sm: '80px' },
    height: { xs: '64px', sm: '80px' },
    minWidth: { xs: '64px', sm: '80px' },
    minHeight: { xs: '64px', sm: '80px' },
    backgroundColor: 'var(--color-black-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: 'var(--border-radius-full)',
    position: 'relative' as const,
    overflow: 'visible' as const,
  };

  // Form field styles
  const fieldContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-md)',
    width: '100%',
    // backgroundColor: 'red',
  };

  // Button container styles
  const buttonContainerStyles = {
    display: 'flex',
    gap: 'var(--padding-lg-1)',
    justifyContent: 'flex-end',
    flexDirection: { xs: 'column', sm: 'row' },
    width: { xs: '100%', sm: 'auto' },
    marginTop: { xs: 'var(--padding-lg)'},
  };
 
  const uploadBadgeStyles = {
    position: 'absolute' as const,
    top: '-4px',
    right: '-3px',
    width: '25px',
    height: '25px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-white-light)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  };

  // Sidebar button styles
  const sidebarButtonStyles = (isActive: boolean) => ({
    width: '100%',
    padding: 'var(--padding-md) var(--padding-lg)',
    textAlign: 'left' as const,
    backgroundColor: isActive ? 'var(--color-white-sidebar)' : 'transparent',
    border: 'none',
    borderRadius: 'var(--border-radius-sm)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'var(--color-white-sidebar)',
    },
  });

  // Additional style objects for inline sx props
  const profileContentContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: { xs: 'var(--padding-xl)', sm: '56px' },
  };

  const avatarSxStyles = {
    width: { xs: '64px', sm: '80px' },
    height: { xs: '64px', sm: '80px' },
    overflow: 'hidden',
  };

  const addIconWhiteStyles = {
    color: 'var(--color-white)',
    fontSize: '24px',
  };

  const addIconBlackStyles = {
    color: 'var(--color-black)',
    width: '21px',
    height: '21px',
    fontSize: '16px',
  };

  const uploadPhotoTextStyles = {
    color: 'var(--color-black-secondary)',
    marginBottom: '4px',
  };

  const formFieldsContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  };

  const fieldsWrapperStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
  };

  const textFieldFullWidthStyles = {
    width: '100%',
    '& .MuiInputBase-root': {
      width: '100% !important',
    },
  };

  const rowFieldsContainerStyles = {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: '16px',
  };

  const passwordFieldsContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
  };

  const passwordFieldStyles = {
    width: '100%',
    '& .MuiInputBase-root': {
      width: '100% !important',
      paddingRight: '40px',
    },
  };

  const brandingContentContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  };

  const brandingFieldsWrapperStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
  };

  const brandingRowFieldsStyles = {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: '16px',
  };

  const brandingUploadTextStyles = {
    color: 'var(--color-black-secondary)',
    marginBottom: '4px',
  };

  const checkboxContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  };

  const checkboxRowStyles = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  };

  const checkboxTextContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const checkboxLabelStyles = {
    color: 'var(--color-black-secondary)',
    fontWeight: 500,
  };

  const companyDetailsContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  };

  const companyFieldsWrapperStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
  };

  const paymentsContentContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  const paymentsMainContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: { xs: 'var(--padding-xl)', sm: '56px' },
  };

  const paymentsHeaderContainerStyles = {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'flex-start',
    alignItems: { xs: 'flex-start', sm: 'center' },
    gap: '16px',
  };

  const paymentsSectionContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  };

  const paymentsFieldsWrapperStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
  };

  const stripeCheckboxRowStyles = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  };

  const stripeCheckboxTextContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  };

  const stripeCheckboxLabelStyles = {
    color: 'var(--color-black-secondary)',
    fontWeight: 500,
  };

  const stripeAccountContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
  };

  const stripeAccountTextContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    width: '100%',
  };

  const stripeAccountLabelStyles = {
    color: 'var(--color-grey-light)',
    fontWeight: 500,
  };

  const settingsIconStyles = {
    fontSize: '20px',
    color: 'var(--color-grey-light)',
  };

  const stripeAccountTextFieldStyles = {
    width: '100%',
    '& .MuiInputBase-root': {
      width: '100% !important',
      padding: '12px 16px',
      minHeight: '60px',
      alignItems: 'flex-start',
    },
    '& .MuiInputBase-input': {
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
    },
  };

  const earningsReportsContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
  };

  const payoutsContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
  };

  const payoutsHeaderContainerStyles = {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    width: '100%',
    gap: { xs: 'var(--padding-md)', sm: '16px' },
  };

  const progressBarContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
  };

  const progressBarHeaderStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  };

  const progressBarLabelStyles = {
    color: 'var(--color-black-secondary)',
    fontWeight: 500,
  };

  const progressBarBoxStyles = {
    width: '100%',
    height: '8px',
    backgroundColor: 'var(--color-white-light)',
    borderRadius: '4px',
    overflow: 'hidden',
  };

  const progressBarFillStyles = {
    width: '80%',
    height: '100%',
    backgroundColor: 'var(--color-black-secondary)',
    borderRadius: '4px',
  };

  const totalAvailableContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    border: '1px solid var(--color-white-light)',
    borderRadius: 'var(--border-radius-md)',
    padding: '12px',
    minWidth: { xs: '100%', sm: 'fit-content' },
    width: { xs: '100%', sm: 'auto' },
  };

  const payoutModalContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    textAlign: 'center',
  };

  const payoutModalTitleStyles = {
    color: 'var(--color-black-secondary)',
    fontWeight: 600,
  };

  // Additional style objects for inline sx props
  const loadingContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: '60vh',
    gap: 'var(--padding-lg)',
  };

  const modalOverlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  };

  const modalCardStyles = {
    width: { xs: '90%', sm: '100%' },
    maxWidth: '400px',
    padding: { xs: 'var(--padding-lg)', sm: '32px' },
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: 'var(--shadow-lg)',
  };

  const payoutAmountTextFieldStyles = {
    width: '100%',
    '& .MuiInputBase-root': {
      width: '100% !important',
    },
  };

  const modalActionsStyles = {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: '12px',
    justifyContent: 'flex-end',
  };

  const modalCancelButtonStyles = {
    minWidth: { xs: '100%', sm: '100px' },
    width: { xs: '100%', sm: 'auto' },
  };

  const modalSubmitButtonStyles = {
    minWidth: { xs: '100%', sm: '140px' },
    width: { xs: '100%', sm: 'auto' },
  };

  const stripeConnectButtonStyles = {
    minWidth: { xs: '100%', sm: 'fit-content' },
    width: { xs: '100%', sm: 'auto' },
    backgroundColor: 'var(--color-white-sidebar)',
    border: 'none',
  };

  const askForPayoutButtonStyles = {
    minWidth: { xs: '100%', sm: 'fit-content' },
    width: { xs: '100%', sm: 'auto' },
    backgroundColor: 'var(--color-white-sidebar)',
    border: 'none',
  };

  const cancelButtonWidthStyles = {
    minWidth: { xs: '100%', sm: 'var(--width-sm-1)' },
    width: { xs: '100%', sm: 'auto' },
  };

  const sidebarTypographyStyles = (isActive: boolean) => ({
    color: 'var(--color-black-secondary)',
    fontWeight: isActive
      ? 'var(--font-weight-medium)'
      : 'var(--font-weight-regular)',
      whiteSpace: { xs: 'nowrap', sm: 'normal' },
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleBrandingInputChange =
    (field: 'name' | 'email' | 'phone' | 'website' | 'introMessage') =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setBrandingData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleBrandingDisplayChange = async (checked: boolean) => {
    // Update local state immediately for UI responsiveness
    setBrandingData((prev) => ({
      ...prev,
      displayAgencyBranding: checked,
    }));

    // Save to API immediately
    const agencyId = brandingData.agencyId || profile?.agencyId || '';
    if (!agencyId) {
      setToastState({
        visible: true,
        message: 'Cannot update branding setting without agency ID.',
        type: 'error',
      });
      // Revert the checkbox state on error
      setBrandingData((prev) => ({
        ...prev,
        displayAgencyBranding: !checked,
      }));
      return;
    }

    try {
      await updateAgencyBranding({
        agencyId,
        displayAgencyBranding: checked,
      });

      setToastState({
        visible: true,
        message: `Agency branding ${checked ? 'enabled' : 'disabled'} successfully.`,
        type: 'success',
      });
    } catch (error) {
      console.error('SettingsPage: ❌ Failed to update display agency branding', error);
      setToastState({
        visible: true,
        message: 'Failed to update branding setting. Please try again.',
        type: 'error',
      });
      // Revert the checkbox state on error
      setBrandingData((prev) => ({
        ...prev,
        displayAgencyBranding: !checked,
      }));
    }
  };

  const handleCompanyInputChange =
    (field: keyof typeof companyData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCompanyData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const resetProfileData = () => {
    setProfileData((prev) => ({
      ...prev,
      name: profile?.name ?? '',
      email: profile?.email ?? '',
      phone: profile?.phoneNumber ?? '',
      imageURL: profile?.imageURL ?? '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };

  const resetPasswordFields = () => {
    setProfileData((prev) => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };

  const resetBrandingData = () => {
    setBrandingData({
      agencyId: profile?.agencyId ?? '',
      name: profile?.agencyName ?? '',
      email: profile?.brandingEmail ?? '',
      phone: profile?.brandingPhoneNumber ?? '',
      website: profile?.website ?? '',
      introMessage: profile?.introMessage ?? '',
      imageURL: profile?.brandImageURL ?? '',
      displayAgencyBranding: !!profile?.displayAgencyBranding,
    });

    if (brandingFileInputRef.current) {
      brandingFileInputRef.current.value = '';
    }
  };

  const resetCompanyData = () => {
    setCompanyData({
      street: profile?.companyStreet ?? '',
      city: profile?.companyCity ?? '',
      state: profile?.companyState ?? '',
      postalCode: profile?.companyPostalCode ?? '',
      country: profile?.companyCountry ?? '',
      landmark: profile?.companyLandmark ?? '',
    });
  };

  useEffect(() => {
    setProfileData((prev) => ({
      ...prev,
      name: profile?.name ?? '',
      email: profile?.email ?? '',
      phone: profile?.phoneNumber ?? '',
      imageURL: profile?.imageURL ?? '',
    }));
  }, [profile?.name, profile?.email, profile?.phoneNumber, profile?.imageURL]);

  useEffect(() => {
    setBrandingData((prev) => ({
      ...prev,
      agencyId: profile?.agencyId ?? '',
      name: profile?.agencyName ?? '',
      email: profile?.brandingEmail ?? '',
      phone: profile?.brandingPhoneNumber ?? '',
      website: profile?.website ?? '',
      introMessage: profile?.introMessage ?? '',
      imageURL: profile?.brandImageURL ?? '',
      displayAgencyBranding: !!profile?.displayAgencyBranding,
    }));
  }, [
    profile?.agencyId,
    profile?.agencyName,
    profile?.brandingEmail,
    profile?.brandingPhoneNumber,
    profile?.website,
    profile?.introMessage,
    profile?.brandImageURL,
    profile?.displayAgencyBranding,
  ]);

  useEffect(() => {
    setCompanyData((prev) => ({
      ...prev,
      street: profile?.companyStreet ?? '',
      city: profile?.companyCity ?? '',
      state: profile?.companyState ?? '',
      postalCode: profile?.companyPostalCode ?? '',
      country: profile?.companyCountry ?? '',
      landmark: profile?.companyLandmark ?? '',
    }));
  }, [
    profile?.companyStreet,
    profile?.companyCity,
    profile?.companyState,
    profile?.companyPostalCode,
    profile?.companyCountry,
    profile?.companyLandmark,
  ]);

  useEffect(() => {
    if (!toastState.visible || toastState.type !== 'success') {
      return;
    }

    const timer = setTimeout(() => {
      setToastState((prev) => ({ ...prev, visible: false }));
    }, 3000);

    return () => clearTimeout(timer);
  }, [toastState.visible, toastState.type]);

  const handleSave = async () => {
    try {
      switch (activeSection) {
        case 'branding': {
          const agencyId = brandingData.agencyId || profile?.agencyId || '';
          if (!agencyId) {
            setToastState({
              visible: true,
              message: 'Cannot update branding without agency ID.',
              type: 'error',
            });
            return;
          }

          const normalizedImageURL =
            brandingData.imageURL && brandingData.imageURL.startsWith('blob:')
              ? profile?.brandImageURL ?? undefined
              : brandingData.imageURL || profile?.brandImageURL || undefined;

          await updateAgencyBranding({
            agencyId,
            name: brandingData.name || undefined,
            email: brandingData.email || undefined,
            phoneNumber: brandingData.phone || undefined,
            website: brandingData.website || undefined,
            introMessage: brandingData.introMessage || undefined,
            imageURL: normalizedImageURL,
            displayAgencyBranding: brandingData.displayAgencyBranding,
          });

          setToastState({
            visible: true,
            message: 'Branding information updated successfully.',
            type: 'success',
          });
          break;
        }
        case 'profile': {
          const normalizedImageURL =
            profileData.imageURL && profileData.imageURL.startsWith('blob:')
              ? profile?.imageURL || undefined
              : profileData.imageURL || profile?.imageURL || undefined;

          const updated = await updateProfile({
            name: profileData.name,
            email: profileData.email,
            phoneNumber: profileData.phone,
            imageURL: normalizedImageURL,
          });

          if (updated) {
            setProfileData((prev) => ({
              ...prev,
              name: updated.name ?? prev.name,
              email: updated.email ?? prev.email,
              phone: updated.phoneNumber ?? prev.phone,
              imageURL: updated.imageURL ?? prev.imageURL,
            }));

            setToastState({
              visible: true,
              message: 'Profile updated successfully.',
              type: 'success',
            });
          } else {
            setToastState({
              visible: true,
              message: 'Failed to update profile. Please try again.',
              type: 'error',
            });
          }
          break;
        }
        case 'company-details': {
          const agencyId = brandingData.agencyId || profile?.agencyId || '';
          if (!agencyId) {
            setToastState({
              visible: true,
              message: 'Cannot update company details without agency ID.',
              type: 'error',
            });
            return;
          }

          await updateAgencyBranding({
            agencyId,
            street: companyData.street || undefined,
            city: companyData.city || undefined,
            state: companyData.state || undefined,
            zip: companyData.postalCode || undefined,
            country: companyData.country || undefined,
            landmark: companyData.landmark || undefined,
          });

          setToastState({
            visible: true,
            message: 'Company details updated successfully.',
            type: 'success',
          });
          break;
        }
        case 'change-password': {
          if (!profileData.currentPassword || !profileData.newPassword || !profileData.confirmPassword) {
            setToastState({
              visible: true,
              message: 'Please fill in all password fields.',
              type: 'error',
            });
            return;
          }

          if (profileData.newPassword !== profileData.confirmPassword) {
            setToastState({
              visible: true,
              message: 'The new passwords do not match.',
              type: 'error',
            });
            return;
          }

          setIsChangingPassword(true);
          try {
            await changePassword(profileData.currentPassword, profileData.newPassword);
            resetPasswordFields();
            setToastState({
              visible: true,
              message: 'Password updated successfully.',
              type: 'success',
            });
          } catch (error) {
            const message =
              (error as Error)?.message || 'Failed to update password. Please try again.';
            setToastState({
              visible: true,
              message,
              type: 'error',
            });
            console.error('SettingsPage: ❌ Failed to change password', error);
          } finally {
            setIsChangingPassword(false);
          }
          break;
        }
        default:
          break;
      }
    } catch (error) {
      let errorMessage = 'Failed to save changes. Please try again.';
      
      if (activeSection === 'branding') {
        errorMessage = 'Failed to update branding information. Please try again.';
        console.error('SettingsPage: ❌ Failed to update branding info', error);
      } else if (activeSection === 'company-details') {
        errorMessage = 'Failed to update company details. Please try again.';
        console.error('SettingsPage: ❌ Failed to update company details', error);
      } else if (activeSection === 'change-password') {
        errorMessage = 'Failed to change password. Please try again.';
        console.error('SettingsPage: ❌ Failed to change password', error);
      } else if (activeSection === 'profile') {
        errorMessage = 'Failed to update profile. Please try again.';
        console.error('SettingsPage: ❌ Failed to update profile', error);
      } else {
        console.error('SettingsPage: ❌ Failed to handle save action', error);
      }

      setToastState({
        visible: true,
        message: errorMessage,
        type: 'error',
      });
    }
  };

  const handleCancel = () => {
    if (activeSection === 'branding') {
      resetBrandingData();
      return;
    }

    if (activeSection === 'change-password') {
      resetPasswordFields();
      return;
    }

    if (activeSection === 'company-details') {
      resetCompanyData();
      return;
    }

    resetProfileData();
  };

  const handleStripeConnect = async () => {
    const redirectToStripe = (url: string) => {
      if (typeof window !== 'undefined') {
        window.location.href = url;
      }
    };

    if (stripeAccount?.url) {
      redirectToStripe(stripeAccount.url);
      return;
    }

    try {
      const link = await fetchStripeDashboardLinkExecute();
      const url = link?.url || stripeAccount?.url;

      if (url) {
        redirectToStripe(url);
      } else {
        setToastState({
          visible: true,
          message: 'Stripe dashboard link is unavailable right now.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('SettingsPage: ❌ Failed to retrieve Stripe dashboard link', error);
      if (stripeAccount?.url) {
        redirectToStripe(stripeAccount.url);
        return;
      }

      setToastState({
        visible: true,
        message: 'Failed to open the Stripe dashboard. Please try again.',
        type: 'error',
      });
    }
  };

  const handleSingleStripeToggle = async (nextValue: boolean) => {
    const previousValue = isSingleStripePayout;

    setIsSingleStripePayout(nextValue);

    try {
      const updated = await updatePayoutMethodExecute({
        payoutMethod: nextValue ? 'agency_payout' : 'individual_payout',
      });

      if (updated) {
        setIsSingleStripePayout(updated.payoutMethod === 'agency_payout');
      }

      setToastState({
        visible: true,
        message: 'Payout method updated successfully.',
        type: 'success',
      });
    } catch (error) {
      setIsSingleStripePayout(previousValue);
      console.error('SettingsPage: ❌ Failed to toggle payout method', error);
      setToastState({
        visible: true,
        message: 'Failed to update payout method. Please try again.',
        type: 'error',
      });
    }
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setProfileData((prev) => ({
      ...prev,
      imageURL: localPreview,
    }));

    try {
      const response = await uploadProfileImage(file, { target: 'profile' });
      if (response?.imageURL) {
        setProfileData((prev) => ({
          ...prev,
          imageURL: response.imageURL,
        }));
      }
    } catch (error) {
      console.error('SettingsPage: ❌ Failed to upload profile image', error);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      } else {
        event.target.value = '';
      }

      URL.revokeObjectURL(localPreview);
    }
  };

  const handleBrandLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setBrandingData((prev) => ({
      ...prev,
      imageURL: localPreview,
    }));

    try {
      const response = await uploadProfileImage(file, { target: 'brand' });
      if (response?.imageURL) {
        setBrandingData((prev) => ({
          ...prev,
          imageURL: response.imageURL,
        }));
      }
    } catch (error) {
      console.error('SettingsPage: ❌ Failed to upload branding logo', error);
    } finally {
      if (brandingFileInputRef.current) {
        brandingFileInputRef.current.value = '';
      } else {
        event.target.value = '';
      }

      URL.revokeObjectURL(localPreview);
    }
  };

  const renderProfileContent = () => (
    <>
      <Box sx={profileContentContainerStyles}>
        <Box sx={headerStyles}>
          <Typography variant="heading-sm" sx={{ color: 'var(--color-black-secondary)' }}>
            Owner Profile
          </Typography>
        </Box>

        <Box sx={formFieldsContainerStyles}>
          <Box sx={photoUploadStyles}>
            <Box component="label" htmlFor={fileInputId} sx={avatarStyles}>
              <Avatar
                key={profileData.imageURL || profile?.imageURL || 'profile-avatar'}
                src={profileData.imageURL || profile?.imageURL || undefined}
                alt={profileData.name || profile?.name || 'Profile'}
                sx={avatarSxStyles}
              >
                {!profileData.imageURL && !profile?.imageURL && (
                  <AddIcon sx={addIconWhiteStyles} />
                )}
              </Avatar>
              <Box sx={uploadBadgeStyles}>
                <AddIcon sx={addIconBlackStyles} />
              </Box>
            </Box>
            <input
              id={fileInputId}
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
            <Box>
              <Typography
                variant="text-md"
                sx={uploadPhotoTextStyles}
              >
                Upload your photo
              </Typography>
              <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
                Your photo should be in JPEG, PNG, JPG format.
              </Typography>
            </Box>
          </Box>

          <Box sx={fieldsWrapperStyles}>
            <Box sx={fieldContainerStyles}>
              <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                Name
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Enter your name"
                label=""
                helperText=""
                value={profileData.name}
                onChange={handleInputChange('name')}
                sx={textFieldFullWidthStyles}
              />
            </Box>

            <Box sx={rowFieldsContainerStyles}>
              <Box sx={fieldContainerStyles}>
                <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                  Email
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="john@example.com"
                  label=""
                  helperText=""
                  value={profileData.email}
                  onChange={handleInputChange('email')}
                  sx={textFieldFullWidthStyles}
                />
              </Box>

              <Box sx={fieldContainerStyles}>
                <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                  Phone Number
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="+1 (098) 765 3334"
                  label=""
                  helperText=""
                  value={profileData.phone}
                  onChange={handleInputChange('phone')}
                  sx={textFieldFullWidthStyles}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={buttonContainerStyles}>
        <Button 
          variant="outline-sm" 
          onClick={handleCancel} 
          disabled={false} 
          sx={{
            ...cancelButtonWidthStyles,
            order: { xs: 2, sm: 1 },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary-dark-sm"
          onClick={handleSave}
          disabled={isSavingProfile || isUploadingImage}
          sx={{
            ...saveButtonStyles,
            order: { xs: 1, sm: 2 },
          }}
        >
          Save
        </Button>
      </Box>
    </>
  );

  const renderChangePasswordContent = () => (
    <>
      <Box sx={profileContentContainerStyles}>
        <Box sx={headerStyles}>
          <Typography variant="heading-sm" sx={{ color: 'var(--color-black-secondary)' }}>
            Change Password
          </Typography>
        </Box>

        <Box sx={formFieldsContainerStyles}>
          <Box sx={passwordFieldsContainerStyles}>
            {/* Current Password Field */}
            <Box sx={fieldContainerStyles}>
              <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                Current Password
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Enter current password"
                label=""
                helperText=""
                type={showCurrentPassword ? 'text' : 'password'}
                value={profileData.currentPassword}
                onChange={handleInputChange('currentPassword')}
                sx={passwordFieldStyles}
                InputProps={{
                  endAdornment: (
                    <div
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                      }}
                    >
                      <EyeIcon isVisible={showCurrentPassword} />
                    </div>
                  ),
                }}
              />
            </Box>

            {/* New Password Field */}
            <Box sx={fieldContainerStyles}>
              <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                New Password
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Enter new password"
                label=""
                helperText=""
                type={showNewPassword ? 'text' : 'password'}
                value={profileData.newPassword}
                onChange={handleInputChange('newPassword')}
                sx={passwordFieldStyles}
                InputProps={{
                  endAdornment: (
                    <div
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                      }}
                    >
                      <EyeIcon isVisible={showNewPassword} />
                    </div>
                  ),
                }}
              />
            </Box>

            {/* Confirm New Password Field */}
            <Box sx={fieldContainerStyles}>
              <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                Confirm New Password
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Confirm new password"
                label=""
                helperText=""
                type={showConfirmPassword ? 'text' : 'password'}
                value={profileData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                sx={passwordFieldStyles}
                InputProps={{
                  endAdornment: (
                    <div
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                      }}
                    >
                      <EyeIcon isVisible={showConfirmPassword} />
                    </div>
                  ),
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={buttonContainerStyles}>
        <Button 
          variant="outline-sm" 
          onClick={handleCancel} 
          disabled={isChangingPassword} 
          sx={{
            ...cancelButtonWidthStyles,
            order: { xs: 2, sm: 1 },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary-dark-sm"
          onClick={handleSave}
          disabled={
            isChangingPassword ||
            !profileData.currentPassword ||
            !profileData.newPassword ||
            !profileData.confirmPassword
          }
          sx={{
            ...saveButtonStyles,
            order: { xs: 1, sm: 2 },
          }}
        >
          Save
        </Button>
      </Box>
    </>
  );

  const renderBrandingContent = () => (
    <>
      <Box sx={profileContentContainerStyles}>
        <Box sx={headerStyles}>
          <Typography variant="heading-sm" sx={{ color: 'var(--color-black-secondary)' }}>
            Branding
          </Typography>
        </Box>

        <Box sx={brandingContentContainerStyles}>
          <Box sx={photoUploadStyles}>
            <Box component="label" htmlFor={brandingFileInputId} sx={avatarStyles}>
              <Avatar
                key={brandingData.imageURL || profile?.brandImageURL || 'branding-avatar'}
                src={brandingData.imageURL || profile?.brandImageURL || undefined}
                alt={brandingData.name || profile?.agencyName || 'Brand logo'}
                sx={avatarSxStyles}
              >
                {!brandingData.imageURL && !profile?.brandImageURL && (
                  <AddIcon sx={addIconWhiteStyles} />
                )}
              </Avatar>
              <Box sx={uploadBadgeStyles}>
                <AddIcon sx={addIconBlackStyles} />
              </Box>
            </Box>
            <input
              id={brandingFileInputId}
              ref={brandingFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleBrandLogoChange}
              style={{ display: 'none' }}
            />
            <Box>
              <Typography
                variant="text-md"
                sx={brandingUploadTextStyles}
              >
                Upload Brand Logo
              </Typography>
              <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
                Your photo should be in JPEG, PNG, JPG format.
              </Typography>
            </Box>
          </Box>

          <Box sx={brandingFieldsWrapperStyles}>
            <Box sx={brandingRowFieldsStyles}>
              <Box sx={fieldContainerStyles}>
                <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                  Brand Name
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="Enter brand name"
                  label=""
                  helperText=""
                  value={brandingData.name}
                  onChange={handleBrandingInputChange('name')}
                  sx={textFieldFullWidthStyles}
                />
              </Box>

              <Box sx={fieldContainerStyles}>
                <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                  Website
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="https://example.com"
                  label=""
                  helperText=""
                  value={brandingData.website}
                  onChange={handleBrandingInputChange('website')}
                  sx={textFieldFullWidthStyles}
                />
              </Box>
            </Box>
            <Box sx={brandingRowFieldsStyles}>
              <Box sx={fieldContainerStyles}>
                <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                  Brand Email
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="john@example.com"
                  label=""
                  helperText=""
                  value={brandingData.email}
                  onChange={handleBrandingInputChange('email')}
                  sx={textFieldFullWidthStyles}
                />
              </Box>

              <Box sx={fieldContainerStyles}>
                <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                  Phone Number
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="+1 (098) 765 3334"
                  label=""
                  helperText=""
                  value={brandingData.phone}
                  onChange={handleBrandingInputChange('phone')}
                  sx={textFieldFullWidthStyles}
                />
              </Box>
            </Box>
            <Box sx={brandingRowFieldsStyles}>
              <Box sx={fieldContainerStyles}>
                <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                  Intro Message
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="Enter intro message"
                  label=""
                  helperText=""
                  value={brandingData.introMessage}
                  onChange={handleBrandingInputChange('introMessage')}
                  multiline
                  rows={4}
                  sx={{
                    ...textFieldFullWidthStyles,
                    '& .MuiOutlinedInput-root': {
                      padding: 0,
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: 0,
                    },
                  }}
                  
                />
              </Box>
            </Box>

            {/* Display Agency Branding Section */}
          </Box>

          <Box sx={checkboxContainerStyles}>
            <Box sx={checkboxRowStyles}>
              <Checkbox
                
                checked={brandingData.displayAgencyBranding}
                onChange={handleBrandingDisplayChange}
              />
              <Box sx={checkboxTextContainerStyles}>
                <Typography
                  variant="text-md"
                  sx={checkboxLabelStyles}
                >
                  Display Agency Branding
                </Typography>
                <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
                  Display your agency logo on creator profile
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={buttonContainerStyles}>
        <Button 
          variant="outline-sm" 
          onClick={handleCancel} 
          disabled={false} 
          sx={{
            ...cancelButtonWidthStyles,
            order: { xs: 2, sm: 1 },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary-dark-sm"
          onClick={handleSave}
          disabled={isSavingBranding || isUploadingImage}
          sx={{
            ...saveButtonStyles,
            order: { xs: 1, sm: 2 },
          }}
        >
          Save
        </Button>
      </Box>
    </>
  );

  const renderCompanyDetailsContent = () => (
    <>
      <Box sx={profileContentContainerStyles}>
        <Box sx={headerStyles}>
          <Typography variant="heading-sm" sx={{ color: 'var(--color-black-secondary)' }}>
            Company Details
          </Typography>
        </Box>

        <Box sx={companyDetailsContainerStyles}>
          <Box sx={companyFieldsWrapperStyles}>
            <Box sx={brandingRowFieldsStyles}>
              <Box sx={fieldContainerStyles}>
                <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                  Street
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="123 Main Street"
                  label=""
                  helperText=""
                  value={companyData.street}
                  onChange={handleCompanyInputChange('street')}
                  sx={textFieldFullWidthStyles}
                />
              </Box>

              <Box sx={fieldContainerStyles}>
                <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                  City
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="San Francisco"
                  label=""
                  helperText=""
                  value={companyData.city}
                  onChange={handleCompanyInputChange('city')}
                  sx={textFieldFullWidthStyles}
                />
              </Box>
            </Box>

            <Box sx={brandingRowFieldsStyles}>
              <Box sx={fieldContainerStyles}>
                <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                  ZIP/Postal Code
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="94105"
                  label=""
                  helperText=""
                  value={companyData.postalCode}
                  onChange={handleCompanyInputChange('postalCode')}
                  sx={textFieldFullWidthStyles}
                />
              </Box>

              <Box sx={fieldContainerStyles}>
                <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                  State
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="California"
                  label=""
                  helperText=""
                  value={companyData.state}
                  onChange={handleCompanyInputChange('state')}
                  sx={textFieldFullWidthStyles}
                />
              </Box>
            </Box>

            <Box sx={brandingRowFieldsStyles}>
              <Box sx={fieldContainerStyles}>
                <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                  Landmark
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="Near Central Park"
                  label=""
                  helperText=""
                  value={companyData.landmark}
                  onChange={handleCompanyInputChange('landmark')}
                  sx={textFieldFullWidthStyles}
                />
              </Box>

              <Box sx={fieldContainerStyles}>
                <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                  Country
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="United States"
                  label=""
                  helperText=""
                  value={companyData.country}
                  onChange={handleCompanyInputChange('country')}
                  sx={textFieldFullWidthStyles}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={buttonContainerStyles}>
        <Button 
          variant="outline-sm" 
          onClick={handleCancel} 
          disabled={false} 
          sx={{
            ...cancelButtonWidthStyles,
            order: { xs: 2, sm: 1 },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary-dark-sm"
          onClick={handleSave}
          disabled={false}
          sx={{
            ...saveButtonStyles,
            order: { xs: 1, sm: 2 },
          }}
        >
          Save
        </Button>
      </Box>
    </>
  );

  const renderPaymentsContent = () => (
      <Box sx={paymentsContentContainerStyles}>
      <Box sx={paymentsMainContainerStyles}>
        {/* Header with Disconnect Stripe Button */}
        <Box sx={paymentsHeaderContainerStyles}>
          <Typography variant="heading-sm" sx={{ color: 'var(--color-black-secondary)' }}>
            Payments
          </Typography>
          <Button
            variant="outline-sm"
            onClick={handleStripeConnect}
            disabled={stripeDashboardLinkLoading}
            sx={stripeConnectButtonStyles}
          >
            {stripeDashboardLinkLoading
              ? 'Opening Stripe...'
              : isStripeConnected
              ? 'Open Stripe Dashboard'
              : 'Connect to Stripe'}
          </Button>
        </Box>

        <Box sx={paymentsSectionContainerStyles}>
          {/* Single Stripe Payout Section */}
          <Box sx={paymentsFieldsWrapperStyles}>
            <Box sx={stripeCheckboxRowStyles}>
              <Checkbox
                checked={isSingleStripePayout}
                onChange={handleSingleStripeToggle}
                disabled={updatePayoutMethodLoading}
              />
              <Box sx={stripeCheckboxTextContainerStyles}>
                <Typography
                  variant="text-md"
                  sx={stripeCheckboxLabelStyles}
                >
                  Single Stripe Payout
                </Typography>
                <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
                  All creator earnings will be paid-out to the Agency connected Stripe Account
                  below. Agency is responsible for creator payouts.
                </Typography>
              </Box>
            </Box>

            {/* Connected Stripe Account - Only show when Stripe is connected */}
            {isStripeConnected && (
              <Box sx={stripeAccountContainerStyles}>
                <TextField
                  variant="outlined"
                  placeholder=""
                  label=""
                  helperText=""
                  value=""
                  sx={stripeAccountTextFieldStyles}
                  InputProps={{
                    startAdornment: (
                      <Box sx={stripeAccountTextContainerStyles}>
                        <Typography
                          variant="text-md"
                          sx={stripeAccountLabelStyles}
                        >
                          {stripeAccount?.id ?? 'Stripe account pending'}
                        </Typography>
                        <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
                          {stripeAccount?.transferAllowed
                            ? 'Transfers enabled'
                            : 'Awaiting Stripe confirmation'}
                        </Typography>
                      </Box>
                    ),
                    endAdornment: (
                      <div
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                        }}
                      >
                        <SettingsIcon sx={settingsIconStyles} />
                      </div>
                    ),
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Earning Reports Section */}
          <Box sx={earningsReportsContainerStyles}>
            <Typography variant="heading-sm" sx={{ color: 'var(--color-black-secondary)' }}>
              Earning Reports
            </Typography>
            <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
              Input emails to receive reports on how much each creator earned. These reports can be
              used to determine creator payouts.
            </Typography>

            <Box sx={fieldContainerStyles}>
              <Typography variant="text-md" sx={{ color: 'var(--color-black-secondary)' }}>
                Emails
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Enter email(s)"
                label=""
                helperText=""
                sx={textFieldFullWidthStyles}
              />
            </Box>
          </Box>

          {/* Payouts Section */}
          <Box sx={payoutsContainerStyles}>
            <Box sx={payoutsHeaderContainerStyles}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="heading-sm" sx={{ color: 'var(--color-black-secondary)' }}>
                  Payouts
                </Typography>
                <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
                  Input emails to receive reports on how much each creator earned. These reports can
                  be used to determine creator payouts.
                </Typography>
              </Box>

              <Button
                variant="outline-sm"
                onClick={() => setShowPayoutModal(true)}
                disabled={false}
                sx={askForPayoutButtonStyles}
              >
                Ask for Payout
              </Button>
            </Box>
            <Box
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                width: '100%', 
                gap: '20px' 
              }}
            >
              {/* Payout Progress Bar */}
              <Box sx={progressBarContainerStyles}>
                <Box sx={progressBarHeaderStyles}>
                  <Typography
                    variant="text-md"
                    sx={progressBarLabelStyles}
                  >
                    $5988 (Available)
                  </Typography>
                  <Typography variant="text-md" sx={{ color: 'var(--color-grey-light)' }}>
                    $1234 (Total)
                  </Typography>
                </Box>

                {/* Progress Bar */}
                <Box sx={progressBarBoxStyles}>
                  <Box sx={progressBarFillStyles} />
                </Box>
              </Box>
              <Box sx={totalAvailableContainerStyles}>
                <Typography variant="text-md" color="var(--color-grey-light)" fontWeight={500}>
                  Total Available
                </Typography>
                <Typography variant="text-md" color="var(--color-grey-light)" fontWeight={500}>
                  Custom Amount
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom Action Buttons */}
      <Box sx={buttonContainerStyles}>
        <Button 
          variant="outline-sm" 
          onClick={handleCancel} 
          disabled={false} 
          sx={{
            ...cancelButtonWidthStyles,
            order: { xs: 2, sm: 1 },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary-dark-sm"
          onClick={handleSave}
          disabled={false}
          sx={{
            ...saveButtonStyles,
            order: { xs: 1, sm: 2 },
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );

  // Payout Modal Component
  const renderPayoutModal = () => {
    if (!showPayoutModal) return null;

    const handleModalClose = () => {
      setShowPayoutModal(false);
    };

    const handlePayoutSubmit = () => {
      // Handle payout submission logic here
      console.log('Payout amount:', payoutAmount);
      setShowPayoutModal(false);
    };

    return (
      <Box sx={modalOverlayStyles}>
        <Card sx={modalCardStyles}>
          {/* Modal Header */}
          <Box sx={payoutModalContainerStyles}>
            <Typography
              variant="heading-md"
              sx={payoutModalTitleStyles}
            >
              Enter Payout Amount
            </Typography>
            <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
              Please enter the amount you'd like to withdraw.
            </Typography>
          </Box>

          {/* Amount Input */}
          <TextField
            variant="outlined"
            placeholder="Enter amount"
            label=""
            helperText=""
            value={payoutAmount}
            onChange={(e) => setPayoutAmount(e.target.value)}
            sx={payoutAmountTextFieldStyles}
          />

          {/* Modal Actions */}
          <Box sx={modalActionsStyles}>
            <Button
              variant="outline-sm"
              onClick={handleModalClose}
              disabled={false}
              sx={modalCancelButtonStyles}
            >
              Cancel
            </Button>
            <Button
              variant="primary-dark-sm"
              onClick={handlePayoutSubmit}
              disabled={false}
              sx={modalSubmitButtonStyles}
            >
              Ask For Payout
            </Button>
          </Box>
        </Card>
      </Box>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileContent();
      case 'change-password':
        return renderChangePasswordContent();
      case 'branding':
        return renderBrandingContent();
      case 'company-details':
        return renderCompanyDetailsContent();
      case 'payments':
        return renderPaymentsContent();
      default:
        return renderProfileContent();
    }
  };

  // Show loader while profile is loading initially
  if (loading && !profile) {
    return (
      <Box sx={mainContainerStyles}>
        <Box sx={loadingContainerStyles}>
          <Loader size={40} color="black" />
          <Typography variant="text-md" sx={{ color: 'var(--color-grey-light)' }}>
            Loading settings...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={mainContainerStyles}>
      <Card sx={contentCardStyles} onClick={() => {}}>
        {/* Nested Sidebar */}
        <Box sx={nestedSidebarStyles}>
          <button
            style={sidebarButtonStyles(activeSection === 'profile')}
            onClick={() => setActiveSection('profile')}
          >
            <Typography
              variant="text-md"
              sx={sidebarTypographyStyles(activeSection === 'profile')}
            >
              Profile
            </Typography>
          </button>

          <button
            style={sidebarButtonStyles(activeSection === 'change-password')}
            onClick={() => setActiveSection('change-password')}
          >
            <Typography
              variant="text-md"
              sx={sidebarTypographyStyles(activeSection === 'change-password')}
            >
              Change Password
            </Typography>
          </button>

          <button
            style={sidebarButtonStyles(activeSection === 'branding')}
            onClick={() => setActiveSection('branding')}
          >
            <Typography
              variant="text-md"
              sx={sidebarTypographyStyles(activeSection === 'branding')}
            >
              Branding
            </Typography>
          </button>

          <button
            style={sidebarButtonStyles(activeSection === 'company-details')}
            onClick={() => setActiveSection('company-details')}
          >
            <Typography
              variant="text-md"
              sx={sidebarTypographyStyles(activeSection === 'company-details')}
            >
              Company Details
            </Typography>
          </button>

          <button
            style={sidebarButtonStyles(activeSection === 'payments')}
            onClick={() => setActiveSection('payments')}
          >
            <Typography
              variant="text-md"
              sx={sidebarTypographyStyles(activeSection === 'payments')}
            >
              Payments
            </Typography>
          </button>
        </Box>

        {/* Main Content Area */}
        <Box sx={mainContentStyles}>{renderContent()}</Box>
      </Card>

      {/* Payout Modal */}
      {renderPayoutModal()}
      <Toast
        message={toastState.message}
        type={toastState.type}
        visible={toastState.visible}
        position="top-center"
        onClose={() => setToastState((prev) => ({ ...prev, visible: false }))}
        showCloseButton={toastState.type === 'error'}
        sx={{ textAlign: 'center' }}
      />
    </Box>
  );
}
