"use client";

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { Box, Modal } from '@mui/material';
import { Typography, Card, Button, Image, Toast, Loader } from '@superline/design-system';

import { styled } from '@mui/material/styles';
import { useRouter, useParams } from 'next/navigation';
import { useCreatorsApi } from '../../../../hooks/useCreatorsApi';
import { useAuth } from '../../../../contexts/AuthContext';
import { Creator, CreatorEarningsPoint } from '../../../../api/types';
import { getAgencyAccessToken, getAccountClaimToken, getStripeConnectUrl } from '../../../../api/services/creatorsService';
import CreatorProfileHeader from './components/CreatorProfileHeader';
import SocialLinks from './components/SocialLinks';

import AssignedTo from './components/AssignedTo';
import RevenueSection from './components/RevenueSection';
const PageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: 'var(--padding-md)',
  gap: 'var(--padding-lg)',
  backgroundColor: 'var(--color-white-sidebar)',
  maxWidth: '100vw',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    padding: 'var(--padding-lg)',
    gap: 'var(--padding-xl)',
  },
  [theme.breakpoints.up('md')]: {
    padding: 'var(--padding-xl)',
    gap: 'var(--padding-2xl)',
  },
}));

const BackButtonContainer = styled(Box)({
  marginBottom: 'var(--padding-md)'
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  gap: 'var(--padding-lg)'
});

const ErrorContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh'
});

const LeftSideCard = styled(Box)(({ theme }) => ({
  padding: 'var(--padding-md)',
  backgroundColor: 'var(--color-white)',
  borderRadius: 'var(--border-radius-md)',
  boxShadow: 'var(--shadow-sm)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--padding-md)',
  width: '100%',
  height: '100%',
  [theme.breakpoints.up('sm')]: {
    padding: 'var(--padding-lg)',
    gap: 'var(--padding-lg)',
  },
  [theme.breakpoints.up('md')]: {
    padding: 'var(--padding-xl)',
    gap: 'var(--padding-xl)',
  },
}));

const RightSideCard = styled(Box)(({ theme }) => ({
  padding: 'var(--padding-2xl)',
  backgroundColor: 'var(--color-white)',
  borderRadius: 'var(--border-radius-md)',
  boxShadow: 'var(--shadow-sm)',
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--padding-xl)',
  alignItems: 'center',
  [theme.breakpoints.up('md')]: {
    padding: 'var(--padding-3xl)',
  },
}));

const PreviewTitle = styled(Typography)({
  fontSize: 'var(--font-size-2xl)',
  fontWeight: 700,
  color: 'var(--color-black-secondary)',
  textAlign: 'center',
});

const PreviewSubtitle = styled(Typography)({
  fontSize: 'var(--font-size-md)',
  color: 'var(--color-grey-light)',
  textAlign: 'center',
});

const PromoCard = styled(Box)({
  width: '100%',
  backgroundColor: '#F5F5F5',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--padding-xl)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--padding-md)',
  alignItems: 'center',
  textAlign: 'center',
});

const SuperLinkLogo = styled(Image)({
  width: 120,
  height: 'auto',
  borderRadius: 0,
  objectFit: 'contain',
});


function CreatorDetailContent() {
  const router = useRouter();
  const params = useParams();
  const { agencyId } = useAuth();
  const {
    fetchCreator,
    toggleBranding,
    togglePayout,
    revokeCreator,
    fetchCreatorDailyEarnings,
    fetchCreatorTotalEarnings,
  } = useCreatorsApi();
  const { execute: fetchCreatorExecute } = fetchCreator;
  const { execute: toggleBrandingExecute } = toggleBranding;
  const { execute: togglePayoutExecute } = togglePayout;
  const { execute: revokeCreatorExecute, loading: deletingCreator } = revokeCreator;
  const { execute: fetchDailyEarningsExecute } = fetchCreatorDailyEarnings;
  const { execute: fetchTotalEarningsExecute } = fetchCreatorTotalEarnings;
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialEndDate = useMemo(() => new Date(), []);
  const initialStartDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  }, []);
  const [bioId, setBioId] = useState<string | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [rangeRevenue, setRangeRevenue] = useState(0);
  const [revenueData, setRevenueData] = useState<CreatorEarningsPoint[]>([]);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [revenueRange, setRevenueRange] = useState({ start: initialStartDate, end: initialEndDate });
  const [toastState, setToastState] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const formatDateForApi = useCallback((date: Date) => {
    const normalized = new Date(date.getTime());
    const isoString = normalized.toISOString();
    return isoString.split('T')[0];
  }, []);

  const refreshCreator = useCallback(
    async (bio: string) => {
      try {
        const response = await fetchCreatorExecute({ bioId: bio });
        if (response?.getCreator) {
          setCreator(response.getCreator);
        }
      } catch (err) {
        console.error('CreatorDetailPage: ❌ Failed to refresh creator data', err);
      }
    },
    [fetchCreatorExecute]
  );

  const loadOverallRevenue = useCallback(async (bio: string) => {
    try {
      const total = await fetchTotalEarningsExecute({ bioId: bio });
      if (typeof total === 'number') {
        setTotalRevenue(total);
      }
    } catch (err) {
      console.error('CreatorDetailPage: ❌ Failed to load total revenue', err);
      setTotalRevenue(0);
    }
  }, [fetchTotalEarningsExecute]);

  const loadRangeRevenue = useCallback(
    async (bio: string, start: Date, end: Date) => {
      setRevenueLoading(true);
      try {
        const startDate = formatDateForApi(start);
        const endDate = formatDateForApi(end);

        const [daily, total] = await Promise.all([
          fetchDailyEarningsExecute({ bioId: bio, startDate, endDate }),
          fetchTotalEarningsExecute({ bioId: bio, startDate, endDate }),
        ]);

        if (Array.isArray(daily)) {
          setRevenueData(daily);
        } else {
          setRevenueData([]);
        }

        if (typeof total === 'number') {
          setRangeRevenue(total);
        } else {
          setRangeRevenue(0);
        }
      } catch (err) {
        console.error('CreatorDetailPage: ❌ Failed to load revenue range', err);
        setRevenueData([]);
        setRangeRevenue(0);
      } finally {
        setRevenueLoading(false);
      }
    },
    [fetchDailyEarningsExecute, fetchTotalEarningsExecute, formatDateForApi]
  );

  const handleRevenueRangeChange = useCallback(
    async (start: Date, end: Date) => {
      setRevenueRange({ start, end });
      if (!bioId) {
        return;
      }
      await loadRangeRevenue(bioId, start, end);
    },
    [bioId, loadRangeRevenue]
  );

  useEffect(() => {
    if (!params.id) {
      setLoading(false);
      setBioId(null);
      return;
    }

    // Prevent multiple calls and state updates after unmount
    let isMounted = true;

    const loadCreator = async () => {
      try {
        setLoading(true);
        setError(null);
        // Call GetCreator API with params.id (initial identifier from URL)
        const response = await fetchCreatorExecute({
          bioId: params.id as string,
        });
        
        if (isMounted) {
          if (response?.getCreator) {
            setCreator(response.getCreator);

            const bioIdentifier = response.getCreator.bio?.id;
            if (bioIdentifier) {
              setBioId(bioIdentifier);
              const defaultStart = new Date(initialStartDate.getTime());
              const defaultEnd = new Date(initialEndDate.getTime());
              setRevenueRange({ start: defaultStart, end: defaultEnd });

              try {
                await Promise.all([
                  getAgencyAccessToken({ bioId: bioIdentifier }),
                  loadOverallRevenue(bioIdentifier),
                  loadRangeRevenue(bioIdentifier, defaultStart, defaultEnd),
                ]);
              } catch (tokenErr: any) {
                console.warn('CreatorDetailPage: ⚠️ Auxiliary call failed', tokenErr);
              }
            }
          } else {
            setError('Creator not found');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Failed to load creator:', err);
          setError(err?.message || 'Failed to load creator');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCreator();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.id,
    fetchCreatorExecute,
    initialStartDate,
    initialEndDate,
    loadOverallRevenue,
    loadRangeRevenue,
  ]);

  const handleBack = () => {
    router.prefetch('/dashboard/creator');
    router.push('/dashboard/creator');
  };

  const handleEdit = () => {
    console.log('Edit creator:', creator?.id);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!bioId || !agencyId) {
      setToastState({
        visible: true,
        message: 'Unable to delete creator. Please try again.',
        type: 'error',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
      return;
    }

    try {
      await revokeCreatorExecute({
        agencyId,
        bioId,
      });
      
      setDeleteModalOpen(false);
      setToastState({
        visible: true,
        message: 'Creator deleted successfully',
        type: 'success',
      });
      setTimeout(() => {
        router.prefetch('/dashboard/creator');
        router.push('/dashboard/creator');
      }, 1000);
    } catch (err) {
      console.error('CreatorDetailPage: ❌ Failed to delete creator', err);
      setToastState({
        visible: true,
        message: 'Failed to delete creator. Please try again.',
        type: 'error',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
    }
  };

  const handleLogin = async () => {
    if (!bioId) {
      setToastState({
        visible: true,
        message: 'Unable to generate login token. Please try again.',
        type: 'error',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
      return;
    }

    try {
      const response = await getAgencyAccessToken({ bioId });
      if (response?.accessToken) {
        // You can use the accessToken here, e.g., open a new window with the token
        // For now, just show success message
        setToastState({
          visible: true,
          message: 'Login token generated successfully',
          type: 'success',
        });
        setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
      }
    } catch (err) {
      console.error('CreatorDetailPage: ❌ Failed to get access token', err);
      setToastState({
        visible: true,
        message: 'Failed to generate login token. Please try again.',
        type: 'error',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
    }
  };

  const handleAccountClaim = async () => {
    const userId = creator?.bio?.user?.id;
    if (!userId) {
      setToastState({
        visible: true,
        message: 'Unable to generate account claim token. User ID not found.',
        type: 'error',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
      return;
    }

    try {
      const response = await getAccountClaimToken({ userId });
      if (response?.accessToken) {
        setToastState({
          visible: true,
          message: 'Account claim token generated successfully',
          type: 'success',
        });
        setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
      }
    } catch (err) {
      console.error('CreatorDetailPage: ❌ Failed to get account claim token', err);
      setToastState({
        visible: true,
        message: 'Failed to generate account claim token. Please try again.',
        type: 'error',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
    }
  };

  const handleStripeConnect = async () => {
    try {
      const response = await getStripeConnectUrl();
      const redirectUrl = response?.url || response?.connectUrl;
      
      if (redirectUrl) {
        // Redirect to the Stripe Connect URL
        window.location.href = redirectUrl;
      } else {
        setToastState({
          visible: true,
          message: 'Failed to get Stripe Connect URL. Please try again.',
          type: 'error',
        });
        setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
      }
    } catch (err) {
      console.error('CreatorDetailPage: ❌ Failed to get Stripe Connect URL', err);
      setToastState({
        visible: true,
        message: 'Failed to connect Stripe. Please try again.',
        type: 'error',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
    }
  };

  const handleDuplicate = () => {
    console.log('Duplicate creator:', creator?.id);
  };

  const handleAgencyBrandingChange = async (checked: boolean) => {
    if (!bioId) {
      return;
    }

    setCreator(prev =>
      prev
        ? {
            ...prev,
            bio: {
              ...prev.bio,
              allowAgencyBranding: checked,
            },
          }
        : prev
    );

    try {
      await toggleBrandingExecute({ bioId });
      await refreshCreator(bioId);
      setToastState({
        visible: true,
        message: checked ? 'Agency branding enabled successfully' : 'Agency branding disabled successfully',
        type: 'success',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
    } catch (err) {
      console.error('CreatorDetailPage: ❌ Failed to toggle agency branding', err);
      setToastState({
        visible: true,
        message: 'Failed to update agency branding. Please try again.',
        type: 'error',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
      // Revert the optimistic update
      setCreator(prev =>
        prev
          ? {
              ...prev,
              bio: {
                ...prev.bio,
                allowAgencyBranding: !checked,
              },
            }
          : prev
      );
    }
  };

  const handleMonetizationChange = async (checked: boolean) => {
    if (!bioId) {
      return;
    }

    setCreator(prev =>
      prev
        ? {
            ...prev,
            payoutMethod: checked ? 'agency_payout' : 'individual_payout',
          }
        : prev
    );

    try {
      await togglePayoutExecute({ bioId });
      await refreshCreator(bioId);
      await Promise.all([
        loadOverallRevenue(bioId),
        loadRangeRevenue(bioId, revenueRange.start, revenueRange.end),
      ]);
      setToastState({
        visible: true,
        message: checked ? 'Monetization enabled successfully' : 'Monetization disabled successfully',
        type: 'success',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
    } catch (err) {
      console.error('CreatorDetailPage: ❌ Failed to toggle monetization', err);
      setToastState({
        visible: true,
        message: 'Failed to update monetization. Please try again.',
        type: 'error',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
      // Revert the optimistic update
      setCreator(prev =>
        prev
          ? {
              ...prev,
              payoutMethod: checked ? 'individual_payout' : 'agency_payout',
            }
          : prev
      );
    }
  };

  // Style objects for complex styling
  const loadingTextStyles = {
    marginTop: 'var(--padding-lg)',
    color: 'var(--color-grey-light)',
  };

  const twoColumnLayoutStyles = {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)', md: 'var(--padding-xl)' },
    maxWidth: '100%',
    width: '100%',
    alignItems: { xs: 'stretch', md: 'stretch' },
  };

  const leftColumnStyles = {
    flex: { xs: '1 1 100%', md: '0 0 60%' },
    maxWidth: { xs: '100%', md: '60%' },
    width: { xs: '100%', md: 'auto' },
    display: 'flex',
  };

  const rightColumnStyles = {
    flex: { xs: '1 1 100%', md: '0 0 40%' },
    maxWidth: { xs: '100%', md: '40%' },
    width: { xs: '100%', md: 'auto' },
    mt: { xs: 'var(--padding-md)', md: 0 },
    display: 'flex',
    minHeight: { md: '100%' },
  };

  const rightSideCardStyles = {
    flex: 1,
    minHeight: { md: '100%' },
    alignSelf: 'stretch',
  };

  const promoCardTextStyles = {
    color: 'var(--color-grey-light)',
    fontWeight: 600,
  };

  const promoCardHeadingStyles = {
    color: 'var(--color-black-secondary)',
    fontWeight: 600,
  };

  const fullWidthButtonStyles = {
    width: '100%',
  };

  const promoCardTransparentStyles = {
    backgroundColor: 'transparent',
    border: '1px dashed var(--color-border-light)',
  };

  const modalCardStyles = {
    position: 'absolute',
    top: { xs: '10%', sm: '50%' },
    left: '50%',
    transform: { xs: 'translate(-50%, 0)', sm: 'translate(-50%, -50%)' },
    width: { xs: '90%', sm: 420 },
    maxWidth: 420,
    padding: { xs: 'var(--padding-lg)', sm: 'var(--padding-xl)' },
    borderRadius: 'var(--border-radius-xl)',
    boxShadow: '0px 20px 45px rgba(15, 23, 42, 0.18)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-lg)',
  };

  const modalHeaderStyles = {
    textAlign: 'center',
  };

  const modalTitleStyles = {
    fontWeight: 700,
    color: 'var(--color-black-secondary)',
  };

  const modalDescriptionStyles = {
    color: 'var(--color-grey-light)',
    marginTop: 'var(--padding-sm)',
  };

  const modalActionsStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-sm)',
  };

  const cancelButtonStyles = {
    width: '100%',
    height: 'auto',
    paddingTop: 'var(--padding-md)',
    paddingBottom: 'var(--padding-md)',
    backgroundColor: 'var(--color-white-dull)',
    '&:hover': {
      backgroundColor: 'var(--color-white-light)',
    },
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Loader size={40} color="black" />
        <Typography variant="text-lg" sx={loadingTextStyles}>
          Loading...
        </Typography>
      </LoadingContainer>
    );
  }

  if (error || !creator) {
    return (
      <ErrorContainer>
        <Typography variant="text-lg">{error || 'Creator not found'}</Typography>
      </ErrorContainer>
    );
  }

  // Transform API response to match component expectations
  const bio = creator.bio;
  // Get all team members from agencyTeamAccess
  const teamMembers = bio.agencyTeamAccess?.map(access => access.agencyTeam?.user).filter(Boolean) || [];
  const assignedTeam = teamMembers[0]; // First team member for backward compatibility
  const socialLinks = bio.socialLinks || [];

  // Default avatar/logo paths
  const DEFAULT_AVATAR = '/assets/default-avatar.svg';
  const DEFAULT_COMPANY_LOGO = '/navbar_icon.png';

  const getProfileImage = (url: string | null | undefined) =>
    (url && typeof url === 'string' && url.trim() !== '' && url !== 'null' && url !== 'undefined')
      ? url
      : DEFAULT_AVATAR;

  // bio.imageURL null ho to default avatar - creator profile me (assigned team ka image use mat karo)
  const profileImage = getProfileImage(bio.imageURL);
  const assignedImg = getProfileImage(assignedTeam?.imageURL);

  // Transform creator data for components
  const creatorData = {
    id: creator.id,
    name: bio.pageName || '',
    email: bio.user?.email || '',
    username: bio.username || '',
    bio: bio.pageName || '',
    profileImage: profileImage,
    assignedTo: assignedTeam?.name || 'Unassigned',
    assignedEmail: assignedTeam?.email || '',
    assignedAvatar: assignedImg,
    socialLinks,
    allowAgencyBranding: bio.allowAgencyBranding || false,
    payoutMethod: creator.payoutMethod,
    accepted: creator.accepted,
    teamMembers, // Add all team members
  };

  return (
    <PageContainer>
      {/* Responsive Two Column Layout */}
      <Box sx={twoColumnLayoutStyles}>
        {/* Left Side Card - Responsive Width */}
        <Box sx={leftColumnStyles}>
          <LeftSideCard>
            <CreatorProfileHeader
              creator={creatorData as any}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onLogin={handleLogin}
              onAccountClaim={handleAccountClaim}
              onStripeConnect={handleStripeConnect}
              onDuplicate={handleDuplicate}
            />
            {/* Social Links */}
            <SocialLinks 
              socialLinks={socialLinks}
              agencyBranding={creatorData.allowAgencyBranding}
              monetization={creatorData.payoutMethod === 'agency_payout'}
              onAgencyBrandingChange={handleAgencyBrandingChange}
              onMonetizationChange={handleMonetizationChange}
            />

            {/* Agency Settings 
            <AgencySettings
              agencyBranding={true}
              monetization={true}
              onAgencyBrandingChange={handleAgencyBrandingChange}
              onMonetizationChange={handleMonetizationChange}
            />*/}

            {/* Assigned To */}
            {teamMembers.length > 0 && (
              <AssignedTo
                assignedTo={creatorData.assignedTo}
                assignedEmail={creatorData.assignedEmail}
                assignedAvatar={creatorData.assignedAvatar}
                teamMembers={teamMembers}
              />
            )}
            <RevenueSection
              totalRevenue={totalRevenue}
              periodRevenue={rangeRevenue}
              periodStart={formatDateForApi(revenueRange.start)}
              periodEnd={formatDateForApi(revenueRange.end)}
              revenueData={revenueData}
              onDateRangeChange={handleRevenueRangeChange}
              isLoading={revenueLoading}
            />
          </LeftSideCard>
        </Box>

        {/* Right Side Card - Responsive Width */}
        <Box sx={rightColumnStyles}>
          <RightSideCard sx={rightSideCardStyles}>
            <PreviewTitle>{creatorData.name}</PreviewTitle>
            <PreviewSubtitle>Later I will add</PreviewSubtitle>

            <PromoCard>
              <Typography variant="text-sm" sx={promoCardTextStyles}>
                Like this profile?
              </Typography>
              <Typography variant="heading-sm" sx={promoCardHeadingStyles}>
                Replicate it.
              </Typography>
              <Button variant="primary-dark-sm" sx={fullWidthButtonStyles}>
                Replicate this profile
              </Button>
            </PromoCard>

            <PromoCard sx={promoCardTransparentStyles}>
              <SuperLinkLogo
                src="/assets/black_footer_icon.png"
                alt="SuperLink"
                variant="rounded-sm"
                objectFit="contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.endsWith('/black_footer_icon.png')) target.src = '/black_footer_icon.png';
                }}
              />
              <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
                Create your own page
              </Typography>
              <Button variant="outline-sm" sx={fullWidthButtonStyles}>
                Create your own page
              </Button>
            </PromoCard>
          </RightSideCard>
        </Box>
      </Box>

      {/* Delete Confirmation Modal */}
      {isMounted && (
        <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} keepMounted={false}>
          <Card sx={modalCardStyles}>
            <Box sx={modalHeaderStyles}>
              <Typography variant="heading-sm" sx={modalTitleStyles}>
                Delete Confirmation
              </Typography>
              <Typography
                variant="text-md"
                sx={modalDescriptionStyles}
              >
                Are you sure you want to remove access? This process cannot be undone.
              </Typography>
            </Box>

            <Box sx={modalActionsStyles}>
              <Button
                variant="primary-dark"
                fullWidth
                onClick={handleConfirmDelete}
                disabled={deletingCreator}
              >
                {deletingCreator ? 'Deleting…' : 'Delete'}
              </Button>
              <Button
                variant="outline-sm"
                fullWidth
                onClick={() => setDeleteModalOpen(false)}
                disabled={deletingCreator}
                sx={cancelButtonStyles}
              >
                Cancel
              </Button>
            </Box>
          </Card>
        </Modal>
      )}

      <Toast
        message={toastState.message}
        type={toastState.type}
        visible={toastState.visible}
        position="top-center"
        onClose={() => setToastState(prev => ({ ...prev, visible: false }))}
      />
    </PageContainer>
  );
}

export default function CreatorDetailPage() {
  return (
    <Suspense fallback={<Loader fullScreen={true} />}>
      <CreatorDetailContent />
    </Suspense>
  );
}
