'use client';

import React, { useState, useLayoutEffect, Suspense } from 'react';
import { Box } from '@mui/material';
import { Button, Typography } from '@superline/design-system';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '../../components/AuthLayout';
import { getRecaptchaTokenForSendOTP } from '../../utils/recaptcha';
import { useSendOTP } from '../../hooks/useAuthApi';
import { useAuth } from '../../contexts/AuthContext';
import { redirectIfAuthenticated } from '../../lib/authGuard';
import Loader from '../../components/Loader';

function SignUpContent() {
  const router = useRouter();
  const { execute: sendOTP, loading: sendOTPLoading } = useSendOTP();
  const { isAuthenticated, isLoading, userState, currentUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shouldRender, setShouldRender] = useState(false);

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
    '& .PhoneInput': {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--padding-md)',
    },
    '& .PhoneInputInput': {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontSize: 'var(--font-size-md-1)',
      padding: 'var(--padding-lg) 0',
      backgroundColor: 'transparent',
      color: 'var(--color-gray-800)',
      fontFamily: 'inherit',
      '&::placeholder': {
        color: 'var(--color-gray-400)',
        opacity: 1,
      },
    },
    '& .PhoneInputCountry': {
      marginRight: '0',
      display: 'flex',
      alignItems: 'center',
    },
    '& .PhoneInputCountrySelect': {
      padding: 'var(--padding-lg) var(--padding-md) var(--padding-lg) 0',
      border: 'none',
      backgroundColor: 'transparent',
      fontSize: 'var(--font-size-md-1)',
      color: 'var(--color-gray-800)',
      cursor: 'pointer',
      fontFamily: 'inherit',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--padding-xs)',
      '&:focus': {
        outline: 'none',
      },
    },
    '& .PhoneInputCountryIcon': {
      display: 'none !important',
    },
    '& .PhoneInputCountryIconImg': {
      display: 'none !important',
    },
    '& .PhoneInputCountrySelectArrow': {
      opacity: 1,
      color: 'var(--color-gray-500)',
      width: 'var(--font-size-icon-sm-1)',
      height: 'var(--font-size-icon-sm-1)',
      marginLeft: 'var(--padding-xs)',
      borderStyle: 'solid',
      borderWidth: '0 1px 1px 0',
      borderColor: 'var(--color-gray-500)',
      transform: 'rotate(45deg)',
      display: 'inline-block',
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

    // Validation
    if (!phoneNumber) {
      setError('Phone number is required');
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Get reCAPTCHA token
      const captchaToken = await getRecaptchaTokenForSendOTP();

      // Step 2: Call send OTP API with phone number and captcha token
      const response = await sendOTP({
        phoneNumber: phoneNumber.trim(),
        captchaToken,
      });

      // Step 3: Store phone in sessionStorage for OTP verification
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('signup-phone', phoneNumber.trim());
        sessionStorage.setItem('auth-flow', 'signup');
      }

      // Step 4: Redirect to OTP verification page
      router.push(`/otp-verify?phone=${encodeURIComponent(phoneNumber.trim())}`);
    } catch (err: any) {
      console.error('Signup error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const isPhoneValid = phoneNumber && isValidPhoneNumber(phoneNumber);

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
              international
              defaultCountry="US"
              value={phoneNumber}
              onChange={(value: string | undefined) => setPhoneNumber(value || '')}
              placeholder="Enter phone number"
              numberInputProps={{
                style: {
                  width: '100%',
                },
              }}
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

