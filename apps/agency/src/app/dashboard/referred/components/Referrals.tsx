'use client';

import React, { useState } from 'react';
import { Card, Typography, Button, TextField } from '@superline/design-system';
import { Box, styled } from '@mui/material';

// MUI Styled Components
const StyledCard = styled(Card)(() => ({
  backgroundColor: 'var(--color-white)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--padding-2xl)',
  boxShadow: 'var(--shadow-sm)',
}));

const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--padding-lg)',
}));

const Title = styled(Typography)(() => ({
  fontSize: 'var(--font-size-lg)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-black-secondary)',
  margin: 0,
  lineHeight: 1.2,
}));

const Description = styled(Typography)(() => ({
  fontSize: 'var(--font-size-md)',
  fontWeight: 'var(--font-weight-normal)',
  color: 'var(--color-grey-main)',
  margin: 0,
  lineHeight: 1.4,
}));

const LinkSection = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '4px',
}));

const StyledTextField = styled(TextField)(() => ({
  width: '300px',
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'var(--color-white)',
    borderColor: 'var(--color-white-light)',
    borderRadius: 'var(--border-radius-md)',
    height: 'var(--height-sm-1)',
    '& fieldset': {
      borderColor: 'var(--color-white-light)',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-white-light)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-white-light)',
    },
  },
  '& .MuiOutlinedInput-input': {
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-normal)',
    color: 'var(--color-black-secondary)',
    padding: '0 var(--padding-lg)',
    cursor: 'default',
    height: 'var(--height-sm-1)',
    display: 'flex',
    alignItems: 'center',
  },
}));

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== '$copied',
})<{ $copied: boolean }>(({ $copied }) => ({
  minWidth: '120px',
  height: 'var(--height-md)',
  fontSize: 'var(--font-size-md)',
  fontWeight: 'var(--font-weight-medium)',
  borderRadius: 'var(--border-radius-md)',
  backgroundColor: $copied ? 'var(--color-success-main)' : 'var(--color-black-secondary)',
  '&:hover': {
    backgroundColor: $copied ? 'var(--color-success-main)' : 'var(--color-black-secondary)',
  },
  '&:disabled': {
    backgroundColor: 'var(--color-success-main)',
    color: 'var(--color-white)',
  },
}));

interface ReferralsProps {
  referralLink?: string;
  onCopyLink?: (link: string) => void;
}

export const Referrals: React.FC<ReferralsProps> = ({
  referralLink = 'superlink.com/referral007',
  onCopyLink,
}) => {
  const [copied, setCopied] = useState(false);
  const isLinkAvailable = Boolean(referralLink);
  const displayLink = referralLink || 'Generating link...';

  const handleCopyClick = () => {
    if (!referralLink) {
      return;
    }

    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        setCopied(true);
        onCopyLink?.(referralLink);

        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <StyledCard variant="default">
      <Container>
        {/* Title */}
        <Title variant="h6">Referrals</Title>

        {/* Description */}
        <Description variant="body2">
          Generate your own referral link that's ready to share.
        </Description>

        {/* Referral Link Section */}
        <LinkSection>
          {/* Referral Link Input */}
          <StyledTextField
            id="referral-link-input"
            variant="outlined"
            value={displayLink}
            InputProps={{
              readOnly: true,
            }}
          />

          {/* Copy Button */}
          <StyledButton
            variant="primary-dark-sm"
            onClick={handleCopyClick}
            disabled={copied || !isLinkAvailable}
            $copied={copied}
          >
            {copied ? 'Copied!' : isLinkAvailable ? 'Copy URL' : 'Generating...'}
          </StyledButton>
        </LinkSection>
      </Container>
    </StyledCard>
  );
};

export default Referrals;
