'use client';

import React, { useState, useLayoutEffect, Suspense } from 'react';
import { Box } from '@mui/material';
import { Button, Typography } from '@superline/design-system';
import { isValidPhoneNumber } from 'react-phone-number-input';
import PhoneInput from 'react-phone-input-2';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '../../components/AuthLayout';
import { getRecaptchaTokenForSendOTP } from '../../utils/recaptcha';
import { useSendOTP } from '../../hooks/useAuthApi';
import { useOriginCountry } from '../../hooks/useOriginCountry';
import { useAuth } from '../../contexts/AuthContext';
import { redirectIfAuthenticated } from '../../lib/authGuard';
import Loader from '../../components/Loader';

function SignUpContent() {
  const router = useRouter();
  const { execute: sendOTP, loading: sendOTPLoading } = useSendOTP();
  const { isAuthenticated, isLoading, userState, currentUser } = useAuth();
  // react-phone-input-2 expects digits only (no leading "+")
  const [phoneDigits, setPhoneDigits] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shouldRender, setShouldRender] = useState(false);
  const countryCode = useOriginCountry();

  // useLayoutEffect runs synchronously before paint - prevents flash
  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      setShouldRender(true);
      return;
    }

    // Use auth context to prevent duplicate API calls
    const checkAndRedirect = async () => {
      if (isLoading) {
        return; // Still loading, wait
      }

      const result = await redirectIfAuthenticated(router, {
        userState,
        currentUser,
        isAuthenticated,
        isLoading,
      });

      if (result.shouldRedirect) {
        return; // Redirecting, don't render
      }

      // No redirect needed - show page
      setShouldRender(true);
    };

    checkAndRedirect();
  }, [router, isAuthenticated, isLoading, userState, currentUser]);

  // Styling variables
  const containerStyles = {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    justifyContent: 'center',
    margin: '0 auto',
    flexDirection: 'column',
    alignItems: 'flex-start',
  };

  const logoContainerStyles = {
    marginBottom: { xs: '40px', md: '64px' },
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  };

  const titleStyles = {
    fontSize: { xs: '24px', sm: '28px', md: '32px' },
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-gray-800)',
    marginBottom: 'var(--padding-md)',
    textAlign: 'left',
    lineHeight: 'var(--line-height-tight)',
  };

  const subtitleStyles = {
    fontSize: 'var(--font-size-md)',
    color: 'var(--color-gray-500)',
    marginBottom: 'var(--padding-3xl)',
    textAlign: 'left',
    lineHeight: 'var(--line-height-relaxed)',
  };

  const phoneInputContainerStyles = {
    width: '100%',
    marginBottom: 'var(--padding-2xl)',
    position: 'relative',
    '& .react-tel-input': {
      width: '100%',
      fontFamily: 'inherit',
    },
    '& .react-tel-input .form-control': {
      width: '100% !important',
      border: 'none',
      outline: 'none',
      fontSize: 'var(--font-size-md-1)',
      // reduced left padding to match design
      padding: 'var(--padding-lg) 0 var(--padding-lg) 58px',
      backgroundColor: 'transparent',
      color: 'var(--color-gray-800)',
      fontFamily: 'inherit',
      '&::placeholder': {
        color: 'var(--color-gray-400)',
        opacity: 1,
      },
    },
    '& .react-tel-input .flag-dropdown': {
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      width: '56px',
    },
    '& .react-tel-input .selected-flag': {
      backgroundColor: 'transparent !important',
      padding: '0',
      width: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative',
      overflow: 'visible',
    },
    '& .react-tel-input .selected-flag .dial-code, & .react-tel-input .selected-flag .selected-dial-code': {
      color: 'var(--color-gray-800)',
      fontSize: 'var(--font-size-md-1)',
      fontFamily: 'inherit',
      fontWeight: 500,
      paddingRight: '16px', // keep space for chevron
    },
    // Force dropdown chevron to always show (independent of library arrow element)
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
    '& .react-tel-input .flag-dropdown.open .selected-flag::after': {
      transform: 'translateY(-50%) rotate(-135deg)',
    },
    '& .react-tel-input .country-list': {
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(17, 24, 39, 0.12)',
      border: '1px solid rgba(0,0,0,0.06)',
      marginTop: '8px',
      width: '260px',
    },
    '& .react-tel-input .search-box': {
      width: '100%',
      borderRadius: '10px',
      border: '1px solid rgba(0,0,0,0.08)',
      padding: '10px 12px',
      outline: 'none',
      fontSize: '14px',
      fontFamily: 'inherit',
    },
  };

  const phoneInputBorderStyles = {
    width: '100%',
    borderBottom: '1px solid var(--color-gray-200)',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 'var(--padding-xs)',
    transition: 'border-color var(--transition-normal)',
    '&:focus-within': {
      borderBottom: '1px solid var(--color-gray-800)',
    },
  };

  const buttonStyles = {
    width: '100%',
    height: '48px',
    padding: '0px',
    marginBottom: 'var(--padding-2xl)',
    borderRadius: 'var(--border-radius-md)',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'none',
  };

  const linkTextStyles = {
    fontSize: 'var(--font-size-md)',
    color: 'var(--color-gray-500)',
    textAlign: 'left',
    width: '100%',
  };

  const handleContinue = async () => {
    setError('');
    const phoneE164 = phoneDigits ? `+${phoneDigits}` : '';

    // Validation
    if (!phoneDigits) {
      setError('Phone number is required');
      return;
    }

    if (!isValidPhoneNumber(phoneE164)) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      // Store phone + flow in sessionStorage for OTP verification
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('signup-phone', phoneE164);
        sessionStorage.setItem('auth-flow', 'signup');
        // Let OTP page send the OTP (keeps navigation instant)
        sessionStorage.setItem('otp-auto-send', 'true');
      }

      // Redirect to OTP verification immediately (no waiting on API)
      setLoading(true);
      router.push(`/otp-verify?phone=${encodeURIComponent(phoneE164)}`);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const phoneE164 = phoneDigits ? `+${phoneDigits}` : '';
  const isPhoneValid = phoneE164 && isValidPhoneNumber(phoneE164);

  // Show loader while checking
  if (isLoading || !shouldRender) {
    return <Loader fullScreen={true} />;
  }

  return (
    <AuthLayout>
      <Box sx={containerStyles}>
        {/* Logo */}
        <Box sx={logoContainerStyles}>
          <img
            src="/assets/landing/asset 0.svg"
            alt="SuperLink Logo"
            style={{
              height: '26px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </Box>

        {/* Title */}
        <Typography variant="h4" sx={titleStyles}>
          Create your account
        </Typography>

        {/* Subtitle */}
        <Typography variant="body2" sx={subtitleStyles}>
          Share your phone to verify your identity.
        </Typography>

        {/* Error Message */}
        {error && (
          <Typography
            variant="body2"
            sx={{
              fontSize: 'var(--font-size-sm)',
              color: '#dc2626',
              marginBottom: 'var(--padding-md)',
              textAlign: 'left',
              width: '100%',
            }}
          >
            {error}
          </Typography>
        )}

        {/* Phone Input Container */}
        <Box sx={phoneInputContainerStyles}>
          <Box sx={phoneInputBorderStyles}>
            <PhoneInput
              country={countryCode}
              value={phoneDigits}
              onChange={(value: string) => setPhoneDigits(value || '')}
              placeholder="Enter phone number"
              countryCodeEditable={false}
              enableSearch={true}
              disableSearchIcon={true}
              inputProps={{ autoComplete: 'tel' }}
            />
          </Box>
        </Box>

        {/* Continue Button */}
        <Button
          variant={isPhoneValid ? 'primary-dark' : 'primary-light'}
          onClick={handleContinue}
          disabled={!isPhoneValid || loading || sendOTPLoading}
          loading={loading || sendOTPLoading}
          sx={buttonStyles}
        >
          Continue
        </Button>

        {/* Login Link */}
        <Typography variant="body2" sx={linkTextStyles}>
          Already have an account?{' '}
          <Link
            href="/login"
            style={{
              color: 'var(--color-gray-800)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            Log In
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<Loader fullScreen={true} />}>
      <SignUpContent />
    </Suspense>
  );
}

