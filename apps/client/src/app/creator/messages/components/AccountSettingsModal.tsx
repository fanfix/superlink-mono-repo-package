'use client';

import { Backdrop, Box, Button, Fade, IconButton, Modal, Typography } from '@mui/material';
import CloseRounded from '@mui/icons-material/CloseRounded';

interface AccountSettingsModalProps {
  open: boolean;
  onClose: () => void;
  onConnectStripe?: () => void;
  connectingStripe?: boolean;
  onGoToSettings?: () => void;
}

// Style variables
const modalBoxStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'var(--width-modal-messages)',
  backgroundColor: 'var(--color-white)',
  borderRadius: 'var(--border-radius-modal)',
  padding: { xs: 'var(--padding-3xl)', md: 'var(--padding-insights-3xl)' },
  textAlign: 'center',
  boxShadow: 'var(--shadow-modal)',
};

const closeButtonStyles = {
  position: 'absolute',
  top: 'var(--padding-lg-1)',
  right: 'var(--padding-lg-1)',
  backgroundColor: 'var(--color-gray-background-very-light-messages)',
  borderRadius: '50%',
};

const titleStyles = {
  fontWeight: 600,
  marginBottom: 'var(--spacing-gap-sm)',
  color: 'var(--color-dark-text-alt)',
};

const descriptionStyles = {
  color: 'var(--color-gray-text-dark-messages)',
  marginBottom: 'var(--padding-3xl)',
  fontSize: 'var(--font-size-md-1)',
};

const okayButtonStyles = {
  backgroundColor: 'var(--color-black)',
  color: 'var(--color-white)',
  borderRadius: 'var(--border-radius-button-pill-full)',
  paddingBlock: 'var(--spacing-insights-gap-md)',
  fontSize: 'var(--font-size-md-1)',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'var(--color-black)',
  },
};

const buttonContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--padding-md)',
  width: '100%',
};

const AccountSettingsModal = ({ 
  open, 
  onClose, 
  onConnectStripe,
  connectingStripe = false,
  onGoToSettings,
}: AccountSettingsModalProps) => {
  return (
  <Modal
    open={open}
      onClose={(event, reason) => {
        // Close on backdrop click or escape key
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          onClose();
        }
      }}
    closeAfterTransition
      disableAutoFocus
      disableEnforceFocus
    aria-labelledby="account-settings-modal-title"
  >
    <Fade in={open}>
        <Box 
          sx={modalBoxStyles}
          onClick={(e) => e.stopPropagation()}
        >
        <IconButton
            onClick={() => {
              // When close button is clicked, redirect to myPage
              if (onGoToSettings) {
                onGoToSettings();
              } else {
                onClose();
              }
            }}
          aria-label="Close account settings modal"
          sx={closeButtonStyles}
        >
          <CloseRounded />
        </IconButton>

        <Typography id="account-settings-modal-title" variant="h5" sx={titleStyles}>
          Account Settings
        </Typography>

        <Typography sx={descriptionStyles}>
          Please login with Stripe to begin messaging.
        </Typography>

          <Box sx={buttonContainerStyles}>
            {onConnectStripe && (
              <Button 
                fullWidth 
                size="large" 
                onClick={onConnectStripe}
                disabled={connectingStripe}
                loading={connectingStripe}
                sx={{
                  ...okayButtonStyles,
                  backgroundColor: connectingStripe ? 'var(--color-gray-400)' : 'var(--color-black)',
                }}
              >
                {connectingStripe ? 'Connecting...' : 'Connect Stripe'}
              </Button>
            )}
            {onGoToSettings && (
              <Button 
                fullWidth 
                size="large" 
                onClick={onGoToSettings}
                sx={{
                  ...okayButtonStyles,
                  backgroundColor: 'transparent',
                  color: 'var(--color-black)',
                  border: '1px solid var(--color-gray-300)',
                  '&:hover': {
                    backgroundColor: 'var(--color-gray-100)',
                  },
                }}
              >
                Go to Settings
              </Button>
            )}
            {!onConnectStripe && (
        <Button fullWidth size="large" onClick={onClose} sx={okayButtonStyles}>
          Okay
        </Button>
            )}
          </Box>
      </Box>
    </Fade>
  </Modal>
);
};

export default AccountSettingsModal;

