'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, IconButton, Box } from '@mui/material';
import { Typography, Button } from '@superline/design-system';
import CloseIcon from '@mui/icons-material/Close';
import PhoneInput from 'react-phone-input-2';
import { isValidPhoneNumber } from 'react-phone-number-input';
import Link from 'next/link';
import { useOriginCountry } from '../hooks/useOriginCountry';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  /** After phone entered and Continue: parent redirects to /otp-verify (we set sessionStorage here) */
  onContinue: (phoneE164: string) => void;
}

const LOGO_GREEN = '#1CD069';

const phoneInputContainerStyles = {
  width: '100%',
  marginBottom: 'var(--padding-xl)',
  position: 'relative' as const,
  '& .react-tel-input': { width: '100%', fontFamily: 'inherit' },
  '& .react-tel-input .form-control': {
    width: '100% !important',
    border: 'none',
    outline: 'none',
    fontSize: 'var(--font-size-md-1)',
    padding: 'var(--padding-lg) 0 var(--padding-lg) 58px',
    backgroundColor: 'transparent',
    color: 'var(--color-gray-800)',
    fontFamily: 'inherit',
    '&::placeholder': { color: 'var(--color-gray-400)', opacity: 1 },
  },
  '& .react-tel-input .flag-dropdown': { backgroundColor: 'transparent', border: 'none', cursor: 'pointer', width: '56px' },
  '& .react-tel-input .selected-flag': {
    backgroundColor: 'transparent !important',
    padding: 0,
    width: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  '& .react-tel-input .selected-flag .dial-code, & .react-tel-input .selected-flag .selected-dial-code': {
    color: 'var(--color-gray-800)',
    fontSize: 'var(--font-size-md-1)',
    fontFamily: 'inherit',
    fontWeight: 500,
    paddingRight: '16px',
  },
  '& .react-tel-input .selected-flag::after': {
    content: '""',
    position: 'absolute',
    right: '32px',
    top: '50%',
    width: '9px',
    height: '9px',
    transform: 'translateY(-50%) rotate(45deg)',
    borderStyle: 'solid',
    borderWidth: '0 1px 1px 0',
    borderColor: 'var(--color-gray-500)',
    pointerEvents: 'none',
  },
  '& .react-tel-input .flag-dropdown.open .selected-flag::after': { transform: 'translateY(-50%) rotate(-135deg)' },
  '& .react-tel-input .country-list': {
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(17, 24, 39, 0.12)',
    border: '1px solid rgba(0,0,0,0.06)',
    marginTop: '8px',
    width: '260px',
  },
};

const phoneInputBorderStyles = {
  width: '100%',
  borderBottom: '1px solid var(--color-gray-200)',
  display: 'flex',
  alignItems: 'center',
  paddingBottom: 'var(--padding-xs)',
  '&:focus-within': { borderBottom: '1px solid var(--color-gray-800)' },
};

const linkStyle: React.CSSProperties = {
  color: '#2563eb',
  textDecoration: 'underline',
  fontWeight: 500,
};

export function LoginModal({ open, onClose, onContinue }: LoginModalProps) {
  const [phoneDigits, setPhoneDigits] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const countryCode = useOriginCountry(open);

  const handleContinue = async () => {
    setError('');
    const phoneE164 = phoneDigits ? `+${phoneDigits}` : '';
    if (!phoneDigits) {
      setError('Phone number is required');
      return;
    }
    if (!isValidPhoneNumber(phoneE164)) {
      setError('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('login-phone', phoneE164);
        sessionStorage.setItem('auth-flow', 'login');
        sessionStorage.setItem('otp-auto-send', 'true');
      }
      onContinue(phoneE164);
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : 'Something went wrong.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const phoneE164 = phoneDigits ? `+${phoneDigits}` : '';
  const isPhoneValid = !!phoneE164 && isValidPhoneNumber(phoneE164);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 'var(--border-radius-lg)',
          padding: 0,
          maxWidth: '90vw',
          width: 400,
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
        },
      }}
      slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.4)' } } }}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12, color: 'var(--color-black)', zIndex: 1 }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ pt: 5, px: 3, pb: 3, textAlign: 'center' }}>
          {/* Logo - centered, larger */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3, px: 2 }}>
            <img
              src="/assets/landing/asset 0.svg"
              alt="SuperLink"
              style={{ width: 180, maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </Box>

          {/* Title */}
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: 'var(--color-gray-800)', mb: 0.5 }}>
            Login
          </Typography>

          {/* Subtitle with line break */}
          <Typography sx={{ fontSize: 14, color: 'var(--color-gray-600)', opacity: 0.9, mb: 2.5, lineHeight: 1.4 }}>
            To continue designing,
            <br />
            simply add sign up via phone number.
          </Typography>

          {error && (
            <Typography sx={{ fontSize: 'var(--font-size-sm)', color: '#dc2626', mb: 1 }}>{error}</Typography>
          )}

          {/* Phone input */}
          <Box sx={{ ...phoneInputContainerStyles, mt: 2.5 }}>
            <Box sx={phoneInputBorderStyles}>
              <PhoneInput
                country={countryCode}
                value={phoneDigits}
                onChange={(value: string) => setPhoneDigits(value || '')}
                placeholder="1 (702) 123-4567"
                countryCodeEditable={false}
                enableSearch
                disableSearchIcon
                inputProps={{ autoComplete: 'tel' }}
              />
            </Box>
          </Box>

          {/* Continue - pill shape, green when valid */}
          <Button
            fullWidth
            onClick={handleContinue}
            disabled={!isPhoneValid || loading}
            loading={loading}
            sx={{
              height: 48,
              borderRadius: 9999,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 'var(--font-size-md)',
              backgroundColor: isPhoneValid ? LOGO_GREEN : 'var(--color-gray-300)',
              color: 'var(--color-white)',
              mb: 2,
              '&:hover': {
                backgroundColor: isPhoneValid ? '#18b85c' : 'var(--color-gray-300)',
              },
              '&.Mui-disabled': {
                backgroundColor: 'var(--color-gray-300)',
                color: 'var(--color-white)',
              },
            }}
          >
            Continue
          </Button>

          {/* Full T&C - match reference copy */}
          <Typography sx={{ fontSize: 11, color: 'var(--color-gray-600)', lineHeight: 1.5, textAlign: 'center' }}>
            By tapping continue, I confirm that I am 18+, agree to SuperLink&apos;s{' '}
            <Link href="/terms-conditions" style={linkStyle} target="_blank" rel="noopener noreferrer">
              Terms of Services
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" style={linkStyle} target="_blank" rel="noopener noreferrer">
              Privacy Policy,
            </Link>{' '}
            consent to receive marketing or other messages (including SMS &amp; MMS) from SuperLink &amp; its agents at
            my cell # above (even if on DNC list), including those sent via automated means. Consent NOT required for
            purchase, but may be necessary for registration and interactions with Users that I follow. Msg &amp; data
            rates may apply. Msg frequency varies. Reply HELP for help, STOP to cancel.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
