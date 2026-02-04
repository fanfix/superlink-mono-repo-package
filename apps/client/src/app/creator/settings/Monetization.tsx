'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton } from '@mui/material';
import { Typography, Button, Toggle, TextField } from '@superline/design-system';
import { styled } from '@mui/material/styles';
import { CheckCircle, Edit, Settings } from '@mui/icons-material';
import { useMonetization } from '../../../contexts/MonetizationContext';
import Loader from '../../../components/Loader';

const Container = styled(Box)({
  maxWidth: 'var(--width-settings-container)',
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

const VerifiedCreatorBox = styled(Box)({
  backgroundColor: 'var(--color-gray-100)',
  borderRadius: 'var(--border-radius-md)',
  padding: 'var(--padding-xl)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 'var(--padding-2xl)',
});

const VerifiedCreatorContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-settings-gap-lg)',
  flex: 1,
});

const VerifiedCreatorText = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-settings-gap-xs)',
});

const VerifiedCreatorTitle = styled(Typography)({
  fontSize: 'var(--font-size-base)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-gray-900)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--padding-md)',
  lineHeight: 'var(--line-height-normal)',
});

const VerifiedCreatorDescription = styled(Typography)({
  fontSize: 'var(--font-size-md)',
  color: 'var(--color-gray-500)',
  lineHeight: 'var(--line-height-normal)',
});

const ConnectStripeButton = styled(Button)({
  width: '100%',
  height: 'var(--height-button-primary)',
  borderRadius: 'var(--border-radius-button-pill)',
  fontSize: 'var(--font-size-base)',
  fontWeight: 'var(--font-weight-semibold)',
  marginBottom: 'var(--padding-3xl)',
  textTransform: 'none',
  letterSpacing: '0.02em',
  boxShadow: 'var(--shadow-sm)',
  '&:hover': {
    boxShadow: 'var(--shadow-md)',
  },
});

const SettingSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--padding-2xl) 0',
  borderBottom: `1px solid var(--color-gray-200)`,
  '&:last-child': {
    borderBottom: 'none',
  },
});

const SettingContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-settings-gap-sm)',
  flex: 1,
});

const SettingTitle = styled(Typography)({
  fontSize: 'var(--font-size-base)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--color-gray-900)',
  lineHeight: 'var(--line-height-normal)',
});

const SettingDescription = styled(Typography)({
  fontSize: 'var(--font-size-md)',
  color: 'var(--color-gray-500)',
  lineHeight: 'var(--line-height-normal)',
});

const MessagePriceContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'var(--padding-lg)',
  marginTop: 'var(--padding-xs)',
  width: '100%',
  justifyContent: 'space-between',
});

const MessagePriceValue = styled(TextField)({
  flex: '0 0 auto',
  minWidth: 'var(--width-price-input-min)',
  '& .MuiInput-underline:before': {
    borderBottomColor: 'var(--color-gray-200)',
    borderBottomWidth: '1px',
  },
  '& .MuiInput-underline:hover:before': {
    borderBottomColor: 'var(--color-gray-300)',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'var(--color-gray-200)',
  },
  '& .MuiInput-input': {
    paddingBottom: 'var(--padding-sm)',
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-gray-500)',
    fontWeight: 'var(--font-weight-normal)',
    letterSpacing: '0.01em',
  },
  '& .MuiInput-root': {
    '&::before': {
      borderBottom: `1px solid var(--color-gray-200)`,
    },
  },
});

const EditButton = styled(Button)({
  minWidth: 'auto',
  padding: 'var(--padding-md) var(--padding-lg-1)',
  height: 'var(--height-button-secondary)',
  fontSize: 'var(--font-size-md)',
  borderRadius: 'var(--border-radius-button-full)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--padding-md)',
  backgroundColor: 'var(--color-gray-100)',
  color: 'var(--color-gray-700)',
  border: `1px solid var(--color-gray-200)`,
  textTransform: 'none',
  fontWeight: 'var(--font-weight-medium)',
  '&:hover': {
    backgroundColor: 'var(--color-gray-200)',
    borderColor: 'var(--color-gray-300)',
  },
});

// Style variables
const detailsButtonStyles = {
  minWidth: 'var(--width-button-details)',
  height: 'var(--height-button-secondary)',
  fontSize: 'var(--font-size-md)',
  borderRadius: 'var(--border-radius-button-full)',
  textTransform: 'none',
  fontWeight: 'var(--font-weight-semibold)',
};

const editPriceContainerStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-settings-gap-lg)',
  mt: 1,
};

const priceTextFieldStyles = {
  width: 'var(--width-price-input)',
  '& .MuiOutlinedInput-root': {
    height: 'var(--height-button-secondary)',
    fontSize: 'var(--font-size-base)',
  },
};

const saveButtonStyles = {
  minWidth: 'auto',
  padding: 'var(--padding-md) var(--padding-lg-1)',
  height: 'var(--height-button-secondary)',
  fontSize: 'var(--font-size-md)',
  borderRadius: 'var(--border-radius-md)',
  textTransform: 'none',
  fontWeight: 'var(--font-weight-semibold)',
};

const disabledPriceInputStyles = {
  '& .MuiInput-input': {
    color: 'var(--color-gray-500)',
  },
};

export default function Monetization() {
  const {
    paymentMethod,
    bio,
    loading,
    updating,
    connectingStripe,
    connectStripe,
    updateTipping,
    updateMessaging,
    updateMessagePrice,
  } = useMonetization();

  const [messagePrice, setMessagePrice] = useState('');
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [priceError, setPriceError] = useState<string | undefined>(undefined);

  // Initialize message price from bio
  useEffect(() => {
    if (bio?.perMessageCost) {
      setMessagePrice(String(bio.perMessageCost));
    }
  }, [bio?.perMessageCost]);

  const handleEditPrice = () => {
    setIsEditingPrice(true);
    setPriceError(undefined);
  };

  const handleCancelEditPrice = () => {
    setIsEditingPrice(false);
    setPriceError(undefined);
    // Reset to original price
    if (bio?.perMessageCost) {
      setMessagePrice(String(bio.perMessageCost));
    }
  };

  const handleSavePrice = async () => {
    const price = parseFloat(messagePrice);
    
    // Validate price
    if (isNaN(price) || price < 1) {
      setPriceError('Price must be at least $1');
      return;
    }

    try {
      setPriceError(undefined);
      await updateMessagePrice(price);
      setIsEditingPrice(false);
    } catch (error: any) {
      setPriceError(error.message || 'Failed to update price');
    }
  };

  const handleTippingToggle = async (checked: boolean) => {
    if (!paymentMethod?.transferAllowed) {
      // Show error or prompt to connect stripe
      return;
    }
    
    try {
      await updateTipping(checked);
    } catch (error: any) {
      // You can add toast notification here
    }
  };

  const handleMessagingToggle = async (checked: boolean) => {
    if (!paymentMethod?.transferAllowed) {
      // Show error or prompt to connect stripe
      return;
    }
    
    try {
      await updateMessaging(checked);
    } catch (error: any) {
      // You can add toast notification here
    }
  };

  const handleConnectStripe = async () => {
    try {
      await connectStripe();
    } catch (error: any) {
      // You can add toast notification here
    }
  };

  const handleStripeDashboard = () => {
    if (paymentMethod?.transferAllowed) {
      // Open stripe dashboard - you may need to get the dashboard URL from API
      // For now, we'll use connectStripe which should handle it
      connectStripe();
    }
  };

  // Show loading state
  if (loading && !bio) {
    return (
      <Container>
        <Title>Monetization</Title>
        <Loader fullScreen={false} />
      </Container>
    );
  }

  const isStripeConnected = !!paymentMethod?.transferAllowed;
  const isAgencyManaged = paymentMethod?.isAgencyStripeAccount;

  return (
    <Container>
      <Title>Monetization</Title>

      {/* Become a Verified Creator Section */}
      {!bio?.verificationStatus && (
        <VerifiedCreatorBox>
          <VerifiedCreatorContent>
            <CheckCircle sx={{ color: 'var(--color-success-main)', fontSize: 'var(--icon-size-md)', flexShrink: 0 }} />
            <VerifiedCreatorText>
              <VerifiedCreatorTitle>
                Become a Verified Creator ✔
              </VerifiedCreatorTitle>
              <VerifiedCreatorDescription>
                Want access to all monetization features?
              </VerifiedCreatorDescription>
            </VerifiedCreatorText>
          </VerifiedCreatorContent>
          <Button
            variant="primary-dark"
            onClick={handleConnectStripe}
            sx={detailsButtonStyles}
            disabled={connectingStripe}
          >
            Details
          </Button>
        </VerifiedCreatorBox>
      )}

      {/* Agency Managed Notice */}
      {isAgencyManaged && (
        <Box
          sx={{
            backgroundColor: 'var(--color-gray-100)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--padding-lg)',
            marginBottom: 'var(--padding-2xl)',
            border: '1px solid var(--color-gray-200)',
          }}
        >
          <Typography sx={{ fontSize: 'var(--font-size-base)', color: 'var(--color-gray-900)', mb: 1 }}>
            This account&apos;s monetization is managed by an agency.
          </Typography>
          <Typography sx={{ fontSize: 'var(--font-size-md)', color: 'var(--color-gray-500)' }}>
            You can still connect to your own Stripe account below.
          </Typography>
        </Box>
      )}

      {/* Stripe Connection Status */}
      {isStripeConnected && !isAgencyManaged ? (
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
          <Box>
            <Typography sx={{ fontSize: 'var(--font-size-base)', color: 'var(--color-gray-900)', fontWeight: 'var(--font-weight-medium)' }}>
              {paymentMethod?.name || 'Stripe Account'}
            </Typography>
            <Typography sx={{ fontSize: 'var(--font-size-md)', color: 'var(--color-gray-500)', mt: 0.5 }}>
              Account ending in {paymentMethod?.last4}
            </Typography>
          </Box>
          <IconButton
            onClick={handleStripeDashboard}
            disabled={connectingStripe}
            sx={{ color: 'var(--color-gray-700)' }}
          >
            <Settings />
          </IconButton>
        </Box>
      ) : (
        <ConnectStripeButton
          variant="primary-dark"
          onClick={handleConnectStripe}
          disabled={connectingStripe}
          loading={connectingStripe}
        >
          Connect Stripe
        </ConnectStripeButton>
      )}

      {/* Tipping Section */}
      <SettingSection>
        <SettingContent>
          <SettingTitle>Tipping</SettingTitle>
          <SettingDescription>Allow fans to send tips</SettingDescription>
        </SettingContent>
        <Toggle
          checked={bio?.allowTipping ?? false}
          onChange={handleTippingToggle}
          size="md"
          activeColor="var(--color-success-green)"
          disabled={!isStripeConnected || updating}
        />
      </SettingSection>

      {/* Messaging Section */}
      <SettingSection>
        <SettingContent>
          <SettingTitle>Messaging</SettingTitle>
          <SettingDescription>Allow fans to send a message</SettingDescription>
        </SettingContent>
        <Toggle
          checked={bio?.allowMessaging ?? false}
          onChange={handleMessagingToggle}
          size="md"
          activeColor="var(--color-success-green)"
          disabled={!isStripeConnected || updating}
        />
      </SettingSection>

      {/* Message Price Section */}
      <SettingSection>
        <SettingContent>
          <SettingTitle>Message Price</SettingTitle>
          {isEditingPrice ? (
            <Box sx={editPriceContainerStyles}>
              <TextField
                type="number"
                variant="outlined"
                value={messagePrice}
                onChange={(e) => {
                  setMessagePrice(e.target.value);
                  setPriceError(undefined);
                }}
                sx={priceTextFieldStyles}
                autoFocus
                error={!!priceError}
                helperText={priceError}
                inputProps={{ min: 1, step: 1 }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="primary-light"
                  onClick={handleCancelEditPrice}
                  sx={saveButtonStyles}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary-dark"
                  onClick={handleSavePrice}
                  sx={saveButtonStyles}
                  loading={updating}
                  disabled={updating}
                >
                  Save
                </Button>
              </Box>
            </Box>
          ) : (
            <MessagePriceContainer>
              <MessagePriceValue
                variant="standard"
                value={bio?.perMessageCost ? `$${bio.perMessageCost}` : '$0'}
                disabled
                sx={disabledPriceInputStyles}
              />
              <EditButton
                onClick={handleEditPrice}
                disabled={!isStripeConnected || updating}
              >
                <Edit sx={{ fontSize: 'var(--icon-size-sm)' }} />
                EDIT
              </EditButton>
            </MessagePriceContainer>
          )}
        </SettingContent>
      </SettingSection>
    </Container>
  );
}

