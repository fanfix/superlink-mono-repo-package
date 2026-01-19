'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Typography } from '@superline/design-system';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { useSupportEmail } from '../../../hooks/useSupportApi';

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

const Content = styled(Box)({
  padding: 'var(--padding-xl)',
  backgroundColor: 'var(--color-gray-50)',
  borderRadius: 'var(--border-radius-md)',
  textAlign: 'center',
});

const Description = styled(Typography)({
  fontSize: 'var(--font-size-settings-base)',
  color: 'var(--color-gray-600)',
  marginBottom: 'var(--padding-2xl)',
});

const EmailLink = styled(Link)({
  color: 'var(--color-primary-main)',
  textDecoration: 'none',
  fontWeight: 'var(--font-weight-medium)',
  '&:hover': {
    textDecoration: 'underline',
  },
});

export default function EmailSupport() {
  const supportEmail = useSupportEmail();

  return (
    <Container>
      <Title>Email Support</Title>
      <Content>
        <Description>
          Contact our support team via email at{' '}
          <EmailLink href={`mailto:${supportEmail}`} target="_blank" rel="noopener noreferrer">
            {supportEmail}
          </EmailLink>
        </Description>
      </Content>
    </Container>
  );
}

