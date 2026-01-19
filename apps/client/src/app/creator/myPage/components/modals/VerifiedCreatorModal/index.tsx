'use client';

import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { Typography, Button, Modal } from '@superline/design-system';
import { CheckCircle } from '@mui/icons-material';
import { VerifiedCreatorModalProps } from './types';
import { verifiedCreatorModalStyles } from './styles';

const VERIFICATION_STEPS = [
  'Verify your identify via Stripe',
  'We will create a Stripe account for you to receive your earnings',
  "Start earning! It's that simple",
] as const;

export default function VerifiedCreatorModal({ open, onClose, onContinue }: VerifiedCreatorModalProps) {
  const handleContinue = useCallback(() => {
    onContinue?.();
    onClose();
  }, [onContinue, onClose]);

  return (
    <Modal open={open} onClose={onClose} title="Become a Verified Creator" maxWidth={500}>
      <Box sx={verifiedCreatorModalStyles.modalContentContainer}>
        <Box sx={verifiedCreatorModalStyles.iconContainer}>
          <Box sx={verifiedCreatorModalStyles.checkmarkCircle}>
            <CheckCircle sx={verifiedCreatorModalStyles.checkmarkIcon} />
          </Box>
        </Box>

        <Typography sx={verifiedCreatorModalStyles.description}>
          Verified Creators unlock access to all monetization and messaging features
        </Typography>

        <Box sx={verifiedCreatorModalStyles.stepsContainer}>
          {VERIFICATION_STEPS.map((step, index) => (
            <Box key={index} sx={verifiedCreatorModalStyles.stepItem}>
              <Box sx={verifiedCreatorModalStyles.stepNumber}>{index + 1}</Box>
              <Typography sx={verifiedCreatorModalStyles.stepText}>{step}</Typography>
            </Box>
          ))}
        </Box>

        <Button variant="primary-dark" onClick={handleContinue} sx={verifiedCreatorModalStyles.darkButton}>
          Continue
        </Button>
      </Box>
    </Modal>
  );
}

