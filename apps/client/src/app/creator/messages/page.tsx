'use client';

import { useState, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';

import MessageStatsBar, { MessageStat } from './components/MessageStatsBar';
import EmptyInboxState from './components/EmptyInboxState';
import AccountSettingsModal from './components/AccountSettingsModal';
import { useGetChannels } from '../../../hooks/useMessagesApi';
import { useMyAccount } from '../../../contexts/MyAccountContext';
import { useMonetization } from '../../../contexts/MonetizationContext';
import { useRouter } from 'next/navigation';

// Style variables
const pageContainerStyles = {
  minHeight: '100vh',
  backgroundColor: 'var(--color-white)',
  display: 'flex',
  flexDirection: 'column',
};

const mainContainerStyles = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  paddingBottom: { xs: 'var(--padding-3xl)', md: 'var(--padding-4xl)' },
  backgroundColor: 'var(--color-white)',
};

const contentBoxStyles = {
  flexGrow: 1,
  backgroundColor: 'var(--color-white)',
  paddingTop: { xs: '56px', md: '72px' },
  paddingInline: { xs: 'var(--padding-insights-xl)', md: 'var(--padding-insights-4xl)' },
};

/**
 * Format number for display
 */
const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(2)}`;
};

export default function CreatorMessagesPage() {
  const { user } = useMyAccount();
  const { paymentMethod, loading: monetizationLoading, connectStripe, connectingStripe } = useMonetization();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  
  const { execute: getChannels, loading: channelsLoading, data: channelsData } = useGetChannels();

  // Check if Stripe is connected - show modal only if not connected
  useEffect(() => {
    if (!monetizationLoading) {
      if (paymentMethod?.transferAllowed) {
        // Stripe is connected, don't show modal
        setModalOpen(false);
      } else {
        // Stripe is not connected, show modal
        setModalOpen(true);
      }
    }
  }, [paymentMethod, monetizationLoading]);

  const handleConnectStripe = async () => {
    try {
      await connectStripe();
      // Modal will close automatically after Stripe redirect
    } catch (error) {
      console.error('Failed to connect Stripe:', error);
    }
  };

  const handleGoToSettings = () => {
    setModalOpen(false);
    // Redirect to myPage when modal is closed
    router.push('/creator/myPage');
  };

  const handleModalClose = () => {
    setModalOpen(false);
    // Redirect to myPage when modal is closed (like superlink-main)
    router.push('/creator/myPage');
  };

  // Fetch channels earnings on mount - this is the MAIN API call (like superlink-main)
  useEffect(() => {
    if (user?.id) {
      // Call the API immediately when user is available
      getChannels(user.id).catch((error) => {
        console.error('Failed to fetch channels:', error);
      });
    }
  }, [user?.id, getChannels]);

  // Calculate message stats from channels data
  const messageStats = useMemo((): MessageStat[] => {
    if (!channelsData) {
      return [
  { label: 'total', value: '$0', color: 'var(--color-message-total)' },
  { label: 'growth', value: '+$0', color: 'var(--color-message-growth)' },
  { label: 'pending', value: '$0', color: 'var(--color-message-pending)' },
];
    }

    // Use total if available, otherwise calculate from all channels
    let totalSucceeded = 0;
    let totalPending = 0;
    let totalMissed = 0;

    if (channelsData.total) {
      // Use pre-calculated totals from API
      totalSucceeded = channelsData.total.succeeded || 0;
      totalPending = channelsData.total.pending || 0;
      totalMissed = channelsData.total.missed || 0;
    } else {
      // Calculate totals from all channels
      Object.values(channelsData).forEach((channel) => {
        if (channel && typeof channel === 'object' && 'succeeded' in channel) {
          totalSucceeded += channel.succeeded || 0;
          totalPending += channel.pending || 0;
          totalMissed += channel.missed || 0;
        }
      });
    }

    return [
      { 
        label: 'total', 
        value: formatNumber(totalSucceeded), 
        color: 'var(--color-message-total)' 
      },
      { 
        label: 'growth', 
        value: `+${formatNumber(totalPending)}`, 
        color: 'var(--color-message-growth)' 
      },
      { 
        label: 'pending', 
        value: formatNumber(totalMissed || totalPending), 
        color: 'var(--color-message-pending)' 
      },
    ];
  }, [channelsData]);

  return (
    <Box sx={pageContainerStyles}>
      <AccountSettingsModal 
        open={modalOpen} 
        onClose={handleModalClose}
        onConnectStripe={handleConnectStripe}
        connectingStripe={connectingStripe}
        onGoToSettings={handleGoToSettings}
      />

      <Box component="main" sx={mainContainerStyles}>
        <MessageStatsBar 
          stats={messageStats} 
          loading={channelsLoading}
        />

        <Box sx={contentBoxStyles}>
          <EmptyInboxState />
        </Box>
      </Box>
    </Box>
  );
}

