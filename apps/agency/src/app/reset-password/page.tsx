'use client';

import { Button, TextField, Typography, Card, Toast } from '@superline/design-system';
import { Box, Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '../../config/routes';
import { useAuth } from '../../contexts/AuthContext';

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [toastState, setToastState] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({
    visible: false,
    message: '',
    type: 'success',
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { forgotPassword, resetPassword } = useAuth();

  const tokenFromQuery = searchParams?.get('token');
  const tokenFromPath = useMemo(() => {
    if (!pathname) return null;
    const segments = pathname.split('/').filter(Boolean);
    const resetIndex = segments.indexOf('reset-password');
    if (resetIndex === -1) return null;
    const maybeToken = segments[resetIndex + 1];
    if (!maybeToken || maybeToken === 'reset-password') return null;
    return maybeToken;
  }, [pathname]);

  const resetToken = tokenFromQuery || tokenFromPath || undefined;
  const isResetMode = Boolean(resetToken);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      password: '',
      confirmPassword: '',
    }));
  }, [resetToken]);

  useEffect(() => {
    if (!toastState.visible || toastState.type !== 'success') {
      return;
    }

    const timer = setTimeout(() => {
      setToastState((prev) => ({ ...prev, visible: false }));
    }, 3000);

    return () => clearTimeout(timer);
  }, [toastState.visible, toastState.type]);

  // Style objects for complex styling
  const pageContainerStyles = {
    minHeight: '100vh',
    backgroundColor: 'var(--color-white-sidebar)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--padding-lg)',
  };

  const cardStyles = {
    width: '422px',
    minHeight: '380px',
    height: '100%',
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    padding: 'var(--padding-3xl)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'none',
  };

  const headerSectionStyles = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 'var(--padding-xs)',
  };

  const subtitleContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 'var(--padding-3xl)',
  };

  const subtitleStyles = {
    width: 'var(--width-sm)',
    textAlign: 'center',
    color: 'var(--color-grey-main)',
  };

  const formContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 'var(--padding-xl)',
  };

  const buttonContainerStyles = {
    marginBottom: 'var(--padding-sm)',
    display: 'flex',
    justifyContent: 'center',
  };

  const resetButtonStyles = {
    fontWeight: 'var(--font-weight-semibold)',
    whiteSpace: 'nowrap',
    width: '100%',
    height: 'var(--height-sm)',
    padding:'0px'
  };

  const legalTextContainerStyles = {
    textAlign: 'center',
    paddingRight: 'var(--padding-lg)',
    paddingLeft: 'var(--padding-lg)',
  };

  const legalTextStyles = {
    color: 'var(--color-grey-main)',
  };

  const accountLinkContainerStyles = {
    textAlign: 'center',
    marginTop: 'var(--padding-3xl)',
  };

  const handleInputChange = (field: 'email' | 'password' | 'confirmPassword', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (isResetMode) {
      if (!formData.password || !formData.confirmPassword) {
        setToastState({
          visible: true,
          message: 'Please enter and confirm your new password.',
          type: 'error',
        });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setToastState({
          visible: true,
          message: 'The passwords do not match. Please try again.',
          type: 'error',
        });
        return;
      }
    } else if (!formData.email) {
      return;
    }

    setLoading(true);
    setToastState({ visible: false, message: '', type: 'success' });

    try {
      if (isResetMode && resetToken) {
        await resetPassword(formData.password, resetToken);
        setToastState({
          visible: true,
          message: 'Password updated successfully. Redirecting to login...',
          type: 'success',
        });
        setTimeout(() => {
          setToastState((prev) => ({ ...prev, visible: false }));
          router.replace(ROUTES.LOGIN);
        }, 1500);
      } else {
        await forgotPassword(formData.email);
        setToastState({
          visible: true,
          message: 'Reset password email was sent successfully!',
          type: 'success',
        });
      }
    } catch (error) {
      const message =
        (error as Error)?.message ||
        (isResetMode
          ? 'We could not update your password. Please try again.'
          : 'We could not send the reset link. Please try again.');
      setToastState({
        visible: true,
        message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={pageContainerStyles}>
      {/* Sign Up Form Card */}
      <Card sx={cardStyles} onClick={() => {}}>
        {/* Header Section */}
        <Box sx={headerSectionStyles}>
          <Typography variant="heading-sm" sx={{}}>
            {isResetMode ? 'Set New Password' : 'Reset Password'}
          </Typography>
        </Box>

        <Box sx={subtitleContainerStyles}>
          <Typography variant="text-sm" sx={subtitleStyles}>
            {' '}
            We securely manage your account information and messages.
          </Typography>
        </Box>
        {/* Form Fields */}
        <Box sx={formContainerStyles}>
          <Stack spacing={2}>
            {!isResetMode ? (
              <Box>
                <TextField
                  label=""
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('email', e.target.value)
                  }
                  variant="standard"
                  helperText=""
                  sx={{ width: '100%' }}
                />
              </Box>
            ) : (
              <>
                <Box>
                  <TextField
                    label=""
                    placeholder="Enter new password"
                    type="password"
                    value={formData.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('password', e.target.value)
                    }
                    variant="standard"
                    helperText=""
                    sx={{ width: '100%' }}
                  />
                </Box>
                <Box>
                  <TextField
                    label=""
                    placeholder="Confirm new password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                    variant="standard"
                    helperText=""
                    sx={{ width: '100%' }}
                  />
                </Box>
              </>
            )}
          </Stack>
        </Box>

        {/* Continue Button */}
        <Box sx={buttonContainerStyles}>
          <Button
            variant={
              isResetMode
                ? formData.password && formData.confirmPassword
                  ? 'primary-dark'
                  : 'primary-light'
                : formData.email
                ? 'primary-dark'
                : 'primary-light'
            }
            onClick={handleSubmit}
            loading={loading}
            sx={resetButtonStyles}
            disabled={
              isResetMode
                ? !formData.password || !formData.confirmPassword || loading
                : !formData.email || loading
            }
          >
            {isResetMode ? 'Update Password' : 'Send Reset Link'}
          </Button>
        </Box>

        {/* Legal Text */}
        <Box sx={legalTextContainerStyles}>
          <Typography variant="text-sm" sx={legalTextStyles}>
            You must be at least 18 years old to register. By tapping Continue, you agree to our{' '}
            <Link
              href="#"
              style={{
                color: 'var(--color-blue-main)',
                textDecoration: 'none',
              }}
            >
              Terms of Use
            </Link>{' '}
            and{' '}
            <Link
              href="#"
              style={{
                color: 'var(--color-blue-main)',
                textDecoration: 'none',
              }}
            >
              Privacy Policy
            </Link>
          </Typography>
        </Box>

        {/* Account Link */}
        <Box sx={accountLinkContainerStyles}>
          <Link href={ROUTES.LOGIN}>
            <Button variant="blue-text" disabled={false} sx={{}}>
              Go back to Log In
            </Button>
          </Link>
        </Box>
      </Card>

      {/* Toast Notification */}
      <Toast
        message={toastState.message}
        type={toastState.type}
        visible={toastState.visible}
        position="top-center"
        onClose={() => setToastState((prev) => ({ ...prev, visible: false }))}
        showCloseButton={toastState.type === 'error'}
        sx={{ textAlign: 'center' }}
      />
    </Box>
  );
}
