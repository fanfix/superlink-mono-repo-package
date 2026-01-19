'use client';

import { Button, TextField, Typography, Card, Toast } from '@superline/design-system';
import { Box, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../config/routes';

export default function SignUpPage() {
  const router = useRouter();
  const { signup, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorToast, setErrorToast] = useState({ visible: false, message: '' });

  // Redirect if already authenticated (this will trigger after signup completes)
  useEffect(() => {
    if (isAuthenticated && !loading) {
      // Small delay to ensure state is fully updated
      const timer = setTimeout(() => {
        router.replace(ROUTES.DASHBOARD);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading, router]);

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
    minHeight: '562px',
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

  const continueButtonStyles = {
    fontWeight: 'var(--font-weight-semibold)',
    width: '100%',
    height: 'var(--height-sm)',
    padding:'0px'
  };

  const legalTextContainerStyles = {
    textAlign: 'center',
    marginBottom: 'var(--padding-3xl)',
    paddingRight: 'var(--padding-lg)',
    paddingLeft: 'var(--padding-lg)',
  };

  const legalTextStyles = {
    color: 'var(--color-grey-main)',
  };

  const accountLinkContainerStyles = {
    textAlign: 'center',
    marginTop: 'var(--padding-4xl)',
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.phone) return;

    setLoading(true);
    setErrorToast({ visible: false, message: '' });
    try {
      await signup(formData.name, formData.email, formData.password, formData.phone);
      setShowToast(true);
      
      // Reset loading state - the useEffect will handle redirect when isAuthenticated becomes true
      setLoading(false);
      
      // Auto-hide toast after 1 second (redirect will happen via useEffect)
      setTimeout(() => {
        setShowToast(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      const message =
        (error as Error)?.message || 'We could not create your account. Please try again.';
      setErrorToast({ visible: true, message });
      console.error('Signup failed:', error);
    }
  };

  return (
    <Box sx={pageContainerStyles}>
      {/* Sign Up Form Card */}
      <Card sx={cardStyles} onClick={() => {}}>
        {/* Header Section */}
        <Box sx={headerSectionStyles}>
          <Typography variant="heading-sm" sx={{}}>
            Sign Up
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
            {/* Name Field */}
            <Box>
              <TextField
                label=""
                placeholder="Name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('name', e.target.value)
                }
                variant="standard"
                helperText=""
                sx={{ width: '100%' }}
              />
            </Box>

            {/* Email Field */}
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

            {/* Password Field */}
            <Box>
              <TextField
                label=""
                placeholder="Password"
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

            {/* Phone Field */}
            <Box>
              <TextField
                label=""
                placeholder="+1"
                type="tel"
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('phone', e.target.value)
                }
                variant="standard"
                helperText=""
                sx={{ width: '100%' }}
              />
            </Box>
          </Stack>
        </Box>

        {/* Continue Button */}
        <Box sx={buttonContainerStyles}>
          <Button
            variant={
              formData.name && formData.email && formData.password && formData.phone
                ? 'primary-dark'
                : 'primary-light'
            }
            onClick={handleSubmit}
            loading={loading}
            disabled={!formData.name || !formData.email || !formData.password || !formData.phone}
            sx={continueButtonStyles}
          >
            Continue
          </Button>
        </Box>

        {/* Legal Text */}
        <Box sx={legalTextContainerStyles}>
          <Typography variant="text-sm" sx={legalTextStyles}>
            You must be at least 18 years old to register. By tapping Continue, you agree to our
            <Link
              href="#"
              style={{
                color: 'var(--color-blue-main)',
                textDecoration: 'none',
              }}
            >
              {' '}
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
              I already have an account
            </Button>
          </Link>
        </Box>
      </Card>

      {/* Toast Notification */}
      <Toast
        message="Account created successfully!"
        type="success"
        visible={showToast}
        position="top-center"
        onClose={() => setShowToast(false)}
        showCloseButton={false}
        sx={{ textAlign: 'center' }}
      />
      <Toast
        message={errorToast.message}
        type="error"
        visible={errorToast.visible}
        position="top-center"
        onClose={() => setErrorToast({ visible: false, message: '' })}
        showCloseButton
        sx={{ textAlign: 'center' }}
      />
    </Box>
  );
}
