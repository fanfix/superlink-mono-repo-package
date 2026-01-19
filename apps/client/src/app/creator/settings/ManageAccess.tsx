'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Box, InputAdornment, IconButton } from '@mui/material';
import { Typography, TextField, SearchIcon, Button } from '@superline/design-system';
import { styled } from '@mui/material/styles';
import { useManageAccess } from '../../../contexts/ManageAccessContext';
// Simple debounce hook
const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  return React.useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};
import { Delete, Add, Mail } from '@mui/icons-material';
import type { Agency } from '../../../api/types';

const Container = styled(Box)({
  maxWidth: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
  padding: '0',
});

const Title = styled(Typography)({
  fontSize: 'var(--font-size-h3)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-gray-900)',
  marginBottom: 'var(--padding-3xl)',
  lineHeight: 'var(--line-height-snug)',
  letterSpacing: '-0.01em',
});

const SearchContainer = styled(Box)({
  width: '100%',
  marginBottom: 'var(--padding-2xl)',
});

const SearchField = styled(TextField)({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: 'var(--border-radius-md)',
    height: 'var(--height-search-field)',
    backgroundColor: 'var(--color-gray-50)',
    '& fieldset': {
      borderColor: 'var(--color-gray-200)',
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-gray-300)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-gray-900)',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: 'var(--padding-xl) var(--padding-2xl)',
    fontSize: 'var(--font-size-lg)',
    color: 'var(--color-gray-900)',
    fontWeight: 'var(--font-weight-normal)',
  },
  '& .MuiInputAdornment-root': {
    marginRight: 'var(--padding-xl)',
  },
});

const SectionTitle = styled(Box)({
  backgroundColor: 'var(--color-gray-100)',
  padding: 'var(--padding-md)',
  borderRadius: 'var(--border-radius-md)',
  marginBottom: 'var(--padding-md)',
});

const SectionTitleText = styled(Typography)({
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-gray-900)',
  textTransform: 'uppercase',
});

const AgencyList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

const AgencyItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--padding-lg) 0',
  borderBottom: '1px solid var(--color-gray-200)',
  '&:last-child': {
    borderBottom: 'none',
  },
});

const AgencyInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--padding-md)',
});

const AgencyImage = styled('img')({
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '1px solid var(--color-gray-200)',
  backgroundColor: 'var(--color-white)',
});

const AgencyName = styled(Typography)({
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--color-gray-900)',
});

const InviteButton = styled(Button)({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--padding-xs)',
  fontSize: 'var(--font-size-sm)',
  textTransform: 'none',
  minWidth: 'auto',
  padding: 'var(--padding-xs) var(--padding-md)',
});

const EmptyState = styled(Box)({
  padding: 'var(--padding-3xl) 0',
  textAlign: 'center',
});

const EmptyStateText = styled(Typography)({
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-gray-500)',
  fontWeight: 'var(--font-weight-medium)',
});

// Email validation helper
const validateEmail = (email: string): boolean => {
  const emailRegex = /^\w+([+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/;
  return emailRegex.test(email);
};

export default function ManageAccess() {
  const {
    agencies,
    invitedAgency,
    loading,
    searching,
    inviting,
    revoking,
    searchAgencies,
    inviteAgency,
    revokeAgencyAccess,
    refreshAgencyStatus,
    clearSearch,
  } = useManageAccess();

  // Fetch agency status when component mounts
  React.useEffect(() => {
    refreshAgencyStatus();
  }, [refreshAgencyStatus]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  // Debounced search
  const debouncedSearch = useDebounce((query: string) => {
    searchAgencies(query);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      debouncedSearch(value);
    } else {
      clearSearch();
    }
  };

  const handleInviteClick = (agency?: Agency) => {
    if (invitedAgency) return; // Can't invite if already has agency
    setSelectedAgency(agency || null);
    setShowInviteModal(true);
  };

  const handleInviteConfirm = async () => {
    try {
      if (selectedAgency) {
        await inviteAgency({ agencyId: selectedAgency.id });
      } else if (validateEmail(searchQuery)) {
        await inviteAgency({ email: searchQuery.trim() });
      }
      setShowInviteModal(false);
      setSearchQuery('');
      clearSearch();
    } catch (error) {
      console.error('Failed to invite agency:', error);
      // You can add toast notification here
    }
  };

  const handleRevokeClick = () => {
    setShowRevokeModal(true);
  };

  const handleRevokeConfirm = async () => {
    if (!invitedAgency) return;
    try {
      await revokeAgencyAccess({ agencyId: invitedAgency.id });
      setShowRevokeModal(false);
    } catch (error) {
      console.error('Failed to revoke access:', error);
      // You can add toast notification here
    }
  };

  return (
    <Container>
      <Title>Manage Access</Title>
      
      <SearchContainer>
        <SearchField
          variant="outlined"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon size={24} color="var(--color-gray-500)" />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>

      {/* Agency Has Access Note */}
      {invitedAgency?.accepted && (
        <Box
          sx={{
            backgroundColor: 'var(--color-gray-100)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--padding-lg)',
            marginBottom: 'var(--padding-2xl)',
            border: '1px solid var(--color-gray-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <AgencyInfo>
            <AgencyImage
              src={invitedAgency.imageURL || '/images/icons/user_icon.svg'}
              alt={invitedAgency.name}
            />
            <Box>
              <AgencyName>{invitedAgency.name}</AgencyName>
              <Typography sx={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
                Has access to manage your profile
              </Typography>
            </Box>
          </AgencyInfo>
          <IconButton onClick={handleRevokeClick} disabled={revoking} size="small">
            <Delete sx={{ fontSize: 'var(--icon-size-sm)', color: 'var(--color-error-main)' }} />
          </IconButton>
        </Box>
      )}

      {/* Invited Agency (not accepted yet) */}
      {invitedAgency && !invitedAgency.accepted && (
        <Box sx={{ marginBottom: 'var(--padding-2xl)' }}>
          <SectionTitle>
            <SectionTitleText>INVITED AGENCY</SectionTitleText>
          </SectionTitle>
          <AgencyList>
            <AgencyItem>
              <AgencyInfo>
                <AgencyImage
                  src={invitedAgency.imageURL || '/images/icons/user_icon.svg'}
                  alt={invitedAgency.name}
                />
                <AgencyName>{invitedAgency.name}</AgencyName>
              </AgencyInfo>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--padding-lg)' }}>
                <Typography sx={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
                  Invited
                </Typography>
                <IconButton
                  onClick={() => handleRevokeClick()}
                  disabled={revoking}
                  size="small"
                >
                  <Delete sx={{ fontSize: 'var(--icon-size-sm)', color: 'var(--color-gray-500)' }} />
                </IconButton>
              </Box>
            </AgencyItem>
          </AgencyList>
        </Box>
      )}

      {/* Search Results */}
      {(agencies.length > 0 || (searchQuery && !agencies.length && !validateEmail(searchQuery) && !searching)) && (
        <Box sx={{ marginBottom: 'var(--padding-2xl)' }}>
          <SectionTitle>
            <SectionTitleText>SEARCHES</SectionTitleText>
          </SectionTitle>
          {agencies.length > 0 ? (
            <AgencyList>
              {agencies.map((agency) => (
                <AgencyItem key={agency.id}>
                  <AgencyInfo>
                    <AgencyImage
                      src={agency.imageURL || '/images/icons/user_icon.svg'}
                      alt={agency.name}
                    />
                    <AgencyName>{agency.name}</AgencyName>
                  </AgencyInfo>
                  <InviteButton
                    variant="secondary"
                    onClick={() => handleInviteClick(agency)}
                    disabled={!!invitedAgency || inviting}
                    startIcon={<Add sx={{ fontSize: 'var(--icon-size-sm)' }} />}
                  >
                    Invite
                  </InviteButton>
                </AgencyItem>
              ))}
            </AgencyList>
          ) : (
            !searching && (
              <EmptyState>
                <EmptyStateText>No results</EmptyStateText>
              </EmptyState>
            )
          )}
        </Box>
      )}

      {/* Email Invite Option */}
      {searchQuery && !agencies.length && validateEmail(searchQuery) && !searching && (
        <Box>
          <SectionTitle>
            <SectionTitleText>E-MAIL</SectionTitleText>
          </SectionTitle>
          <AgencyItem
            sx={{
              cursor: invitedAgency ? 'not-allowed' : 'pointer',
              opacity: invitedAgency ? 0.5 : 1,
            }}
            onClick={() => !invitedAgency && handleInviteClick()}
          >
            <AgencyInfo>
              <Mail sx={{ fontSize: 'var(--icon-size-md)', color: 'var(--color-gray-500)' }} />
              <AgencyName>Invite {searchQuery.trim()}</AgencyName>
            </AgencyInfo>
          </AgencyItem>
        </Box>
      )}

      {/* Loading State */}
      {searching && (
        <EmptyState>
          <EmptyStateText>Searching...</EmptyStateText>
        </EmptyState>
      )}

      {/* Invite Confirmation Modal (simplified - you can enhance with proper modal component) */}
      {showInviteModal && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowInviteModal(false)}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              padding: 'var(--padding-3xl)',
              borderRadius: 'var(--border-radius-md)',
              maxWidth: '400px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography sx={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', mb: 2 }}>
              Do you permit Agency to handle payments?
            </Typography>
            <Typography sx={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', mb: 3 }}>
              This gives the Agency the ability to manage Stripe payouts
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="primary-dark"
                onClick={handleInviteConfirm}
                loading={inviting}
                disabled={inviting}
                sx={{ flex: 1 }}
              >
                Yes
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowInviteModal(false)}
                disabled={inviting}
                sx={{ flex: 1 }}
              >
                Maybe Later
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Revoke Confirmation Modal */}
      {showRevokeModal && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowRevokeModal(false)}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              padding: 'var(--padding-3xl)',
              borderRadius: 'var(--border-radius-md)',
              maxWidth: '400px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography sx={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', mb: 2 }}>
              {invitedAgency?.accepted ? 'Remove Agency Access' : 'Cancel Invite'}
            </Typography>
            <Typography sx={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', mb: 3 }}>
              {invitedAgency?.accepted
                ? 'Are you sure you want to remove access from this agency? Agency will no longer be able to access or manage your profile.'
                : 'Are you sure you want to cancel the invite to this agency to access and manage your profile?'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="primary-dark"
                onClick={handleRevokeConfirm}
                loading={revoking}
                disabled={revoking}
                sx={{ flex: 1 }}
              >
                {invitedAgency?.accepted ? 'Remove' : 'Okay'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowRevokeModal(false)}
                disabled={revoking}
                sx={{ flex: 1 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
}

