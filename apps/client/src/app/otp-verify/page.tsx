'use client';

import React, { useState, useEffect, useLayoutEffect, useRef, Suspense } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Button, Typography } from '@superline/design-system';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '../../components/AuthLayout';
import { useOTPLogin, useSendOTP } from '../../hooks/useAuthApi';
import { executeRecaptcha, getRecaptchaTokenForSendOTP } from '../../utils/recaptcha';
import { setAuthToken, getAuthToken } from '../../lib/auth';
import { redirectIfAuthenticated } from '../../lib/authGuard';
import { getAuthStateApi } from '../../api/services/authService';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../../components/Loader';

function OTPVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { execute: otpLogin, loading: otpLoginLoading } = useOTPLogin();
  const { execute: sendOTP, loading: sendOTPLoading } = useSendOTP();
  const { refreshAuth } = useAuth();
  
  // Get phone number from URL params or sessionStorage
  const phoneFromUrl = searchParams?.get('phone') || '';
  const phoneFromStorage = typeof window !== 'undefined' ? sessionStorage.getItem('login-phone') || sessionStorage.getItem('signup-phone') : null;
  const phoneNumber = phoneFromUrl || phoneFromStorage || '';
  
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // Synchronously check token BEFORE any render - prevents flash
  const token = typeof window !== 'undefined' ? getAuthToken() : null;
  const [isChecking, setIsChecking] = useState(!!token);
  const [shouldRender, setShouldRender] = useState(!token);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Auto-send OTP when user arrives from login/signup (keeps navigation fast)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!phoneNumber) return;

    const shouldAutoSend = sessionStorage.getItem('otp-auto-send') === 'true';
    if (!shouldAutoSend) return;

    // Remove flag immediately to prevent double send on rerender/refresh
    sessionStorage.removeItem('otp-auto-send');

    (async () => {
      try {
        setLoading(true);
        setError('');
        const captchaToken = await getRecaptchaTokenForSendOTP();
        await sendOTP({ phoneNumber, captchaToken });
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to send OTP. Please use "Resend Code".';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [phoneNumber, sendOTP]);

  // Prefetch likely next routes to reduce redirect time
  useEffect(() => {
    router.prefetch('/onboarding');
    router.prefetch('/creator/myPage');
  }, [router]);

  // useLayoutEffect runs synchronously before paint - prevents flash
  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      setShouldRender(true);
      return;
    }

    if (!token) {
      setShouldRender(true);
      setIsChecking(false);
      return;
    }

    const validateAndRedirect = async () => {
      try {
        const result = await redirectIfAuthenticated(router);
        if (result.shouldRedirect) {
          return;
        }
        setShouldRender(true);
      } catch (error) {
        setShouldRender(true);
      } finally {
        setIsChecking(false);
      }
    };

    validateAndRedirect();
  }, [router, token]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{1,6}$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);
      const nextEmptyIndex = newOtp.findIndex((val) => !val);
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    
    // Validation
    if (otpString.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    if (!/^\d{6}$/.test(otpString)) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    if (!phoneNumber) {
      setError('Phone number is missing. Please try logging in again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Get captcha token
      const captchaToken = await executeRecaptcha('form_submit');
      
      // Step 2: Call OTP login API
      const response = await otpLogin({
        username: phoneNumber, // phone number
        password: otpString, // OTP code
        captchaToken,
      });

      // Step 3: Save auth token (in both localStorage and cookie - superlink-main compatibility)
      if (response?.accessToken) {
        setAuthToken(response.accessToken);
        
        // Clear session storage
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('login-phone');
          sessionStorage.removeItem('signup-phone');
          sessionStorage.removeItem('auth-flow');
        }
        
        // Step 4: Decide route based on state/currentUser (bio/creator existence)
        const stateData = await getAuthStateApi(response.accessToken);
        const hasBio = !!(stateData?.bio?.id || stateData?.bioId);
        if (hasBio) {
          router.replace('/creator/myPage');
        } else {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('onboarding-in-progress', 'true');
          }
          router.replace('/onboarding');
        }

        // Refresh AuthContext in background (token change also triggers this via event)
        refreshAuth(true);
      } else {
        throw new Error('No access token received');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Verification failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    if (!phoneNumber) {
      setError('Phone number is missing. Please try logging in again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Get captcha token
      const captchaToken = await getRecaptchaTokenForSendOTP();
      
      // Step 2: Resend OTP
      await sendOTP({
        phoneNumber,
        captchaToken,
      });
      
      // Step 3: Reset timer and OTP fields
      setResendTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to resend OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  // Show loader while checking (only if token exists)
  if (isChecking || !shouldRender) {
    return <Loader fullScreen={true} />;
  }

  // Container styles
  const containerStyles = {
    width: '100%',
    maxWidth: { xs: '100%', sm: '400px', md: '450px' },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin:'0 auto',
    alignItems: 'flex-start',
  };

  const logoContainerStyles = {
    marginBottom: { xs: '32px', md: '48px' },
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  };

  const titleStyles = {
    fontSize: { xs: '24px', sm: '28px', md: '32px' },
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-gray-800)',
    marginBottom: 'var(--padding-sm)',
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

  const phoneDisplayStyles = {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-gray-800)',
    marginBottom: 'var(--padding-2xl)',
    textAlign: 'left',
  };

  const otpContainerStyles = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    gap: { xs: '6px', sm: '10px', md: '12px' },
    marginBottom: 'var(--padding-lg)',
    flexWrap: 'nowrap',
  };

  const getOtpInputStyles = (isFocused: boolean): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      textAlign: 'center',
      fontWeight: 600,
      border: `1.5px solid ${isFocused ? '#111111' : '#e5e5e5'}`,
      backgroundColor: '#ffffff',
      color: '#111111',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit',
      outline: 'none',
      cursor: 'text',
    };

    if (isMobile) {
      return {
        ...baseStyles,
        flex: '1 1 0',
        minWidth: 0,
        width: '100%',
        height: '52px',
        fontSize: '24px',
        borderRadius: '10px',
      };
    } else if (isTablet) {
      return {
        ...baseStyles,
        flex: '0 0 auto',
        width: '50px',
        height: '56px',
        fontSize: '28px',
        borderRadius: '11px',
      };
    } else {
      return {
        ...baseStyles,
        flex: '0 0 auto',
        width: '64px',
        height: '60px',
        fontSize: '32px',
        borderRadius: '12px',
      };
    }
  };

  const errorStyles = {
    fontSize: 'var(--font-size-sm)',
    color: '#dc2626',
    marginBottom: 'var(--padding-md)',
    textAlign: 'left',
    minHeight: '20px',
  };

  const buttonStyles = {
    width: '100%',
    height: { xs: '44px', sm: '48px' },
    padding: '0px',
    marginBottom: 'var(--padding-lg)',
    borderRadius: 'var(--border-radius-md)',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'none',
  };

  const resendContainerStyles = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--padding-sm)',
  };

  const resendTextStyles = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-gray-500)',
    textAlign: 'center',
  };

  const resendButtonStyles = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-gray-800)',
    fontWeight: 'var(--font-weight-semibold)',
    textDecoration: 'none',
    cursor: canResend ? 'pointer' : 'not-allowed',
    opacity: canResend ? 1 : 0.5,
    '&:hover': {
      textDecoration: canResend ? 'underline' : 'none',
    },
  };

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    // Format: +1 (430) 562-9252
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      const match = cleaned.match(/^1(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
      }
    }
    return phone;
  };

  const backButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: { xs: '24px', md: '32px' },
    fontSize: 'var(--font-size-md)',
    color: 'var(--color-gray-800)',
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    padding: 0,
    fontFamily: 'inherit',
    '&:hover': {
      opacity: 0.7,
    },
  };

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

        {/* Back Button */}
        <Box
          component="button"
          onClick={() => router.back()}
          sx={backButtonStyles}
        >
          ← Back
        </Box>

        {/* Title */}
        <Typography 
          variant="h4" 
          sx={{
            ...titleStyles,
            fontSize: { xs: '28px', sm: '32px', md: '36px' },
            marginBottom: { xs: '12px', md: '16px' },
          }}
        >
          Check your phone
        </Typography>

        {/* Subtitle with Phone Number */}
        <Typography 
          variant="body2" 
          sx={{
            ...subtitleStyles,
            fontSize: { xs: '15px', sm: '16px' },
            marginBottom: { xs: '20px', md: '20px' },
            color: 'var(--color-gray-600)',
          }}
        >
          {phoneNumber 
            ? `We sent a confirmation code to ${formatPhoneNumber(phoneNumber)}.`
            : 'Enter the 6-digit verification code sent to your phone.'
          }
        </Typography>

        {/* OTP Input Container */}
        <Box 
          sx={{
            ...otpContainerStyles,
            justifyContent: 'start',
            marginBottom: { xs: '20px', md: '20px' },
          }}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              onFocus={(e) => {
                e.target.style.borderColor = '#111111';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e5e5';
              }}
              style={getOtpInputStyles(false)}
            />
          ))}
        </Box>

        {/* Error Message */}
        {error && (
          <Typography variant="body2" sx={errorStyles}>
            {error}
          </Typography>
        )}

        {/* Resend OTP Section */}
        <Box 
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
            marginBottom: { xs: '24px', md: '32px' },
          }}
        >
          <Typography 
            variant="body2" 
            sx={{
              fontSize: { xs: '14px', sm: '15px' },
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-gray-800)',
              marginBottom: '4px',
            }}
          >
            Didn&apos;t receive the code?
          </Typography>
          <Typography 
            variant="body2" 
            sx={{
              fontSize: { xs: '13px', sm: '14px' },
              color: 'var(--color-gray-500)',
              lineHeight: 1.5,
              marginBottom: '12px',
            }}
          >
            If you haven&apos;t received the verification code, please click below and we will send you a new one.
          </Typography>
          {canResend ? (
            <Button
              variant="primary-light"
              onClick={handleResend}
              disabled={loading || sendOTPLoading}
              loading={sendOTPLoading}
              sx={{
                fontSize: { xs: '14px', sm: '15px' },
                fontWeight: 'var(--font-weight-semibold)',
                textTransform: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                minWidth: 'auto',
              }}
            >
              Resend Code
            </Button>
          ) : (
            <Typography 
              variant="body2" 
              sx={{
                fontSize: { xs: '13px', sm: '14px' },
                color: 'var(--color-gray-500)',
              }}
            >
              Resend code in {resendTimer}s
            </Typography>
          )}
        </Box>

        {/* Continue Button */}
        <Button
          variant={isOtpComplete ? 'primary-dark' : 'primary-light'}
          onClick={handleVerify}
          disabled={!isOtpComplete || loading || otpLoginLoading}
          loading={loading || otpLoginLoading}
          sx={{
            ...buttonStyles,
            borderRadius: '12px',
          }}
        >
          Continue
        </Button>
      </Box>
    </AuthLayout>
  );
}

export default function OTPVerifyPage() {
  return (
    <Suspense fallback={<Loader fullScreen={true} />}>
      <OTPVerifyContent />
    </Suspense>
  );
}

