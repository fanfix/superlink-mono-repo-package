'use client';
import { Box } from '@mui/material';
import { Button, Card, TextField, Typography, Toast } from '@superline/design-system';
import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { getRedirectPath } from '../../lib/auth';
import { ROUTES } from '../../config/routes';

function LoginForm() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  // Empty form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
  // Store redirect URL in state
  const [redirectUrl, setRedirectUrl] = useState(ROUTES.DASHBOARD);

  // Get redirect URL from sessionStorage or cookie
  useEffect(() => {
    // First check sessionStorage
    let redirectPath = getRedirectPath();
    
    // If not in sessionStorage, check cookie (set by middleware)
    if (!redirectPath && typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      const redirectCookie = cookies.find(cookie => cookie.trim().startsWith('admin-redirect-path='));
      if (redirectCookie) {
        redirectPath = redirectCookie.split('=')[1].trim();
        // Move from cookie to sessionStorage and clear cookie
        if (redirectPath && redirectPath !== ROUTES.HOME) {
          sessionStorage.setItem('admin-redirect-path', redirectPath);
          document.cookie = 'admin-redirect-path=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          setRedirectUrl(redirectPath);
        } else {
          setRedirectUrl(ROUTES.DASHBOARD);
        }
      } else {
        setRedirectUrl(redirectPath || ROUTES.DASHBOARD);
      }
    } else {
      setRedirectUrl(redirectPath || ROUTES.DASHBOARD);
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, loading, router, redirectUrl]);

  // Style objects for complex styling
  const pageContainerStyles = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-white-sidebar)',
    padding: { xs: 'var(--margin-md)', sm: 0 },
  };

  const cardStyles = {
    width: { xs: '100%', sm: '90%', md: '422px' },
    maxWidth: '422px',
    height: '100%',
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: 'var(--shadow-lg) !important',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: { xs: 'var(--margin-lg)', sm: 'var(--margin-xl)' },
  };

  const headingContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 'var(--width-form-container)',
  };

  const subtitleStyles = {
    width: 'var(--width-sm)',
    textAlign: 'center',
    color: 'var(--color-grey-main)',
    marginBottom: 'var(--margin-lg)',
  };

  const usernameInputStyles = {
    width: '100%',
    marginBottom: 'var(--margin-lg)',
    minHeight: 'var(--min-height-input)',
    fontSize: 'var(--font-size-md-1)',
    color: 'var(--color-text-primary)',
  };

  const passwordInputStyles = {
    width: '100%',
    marginBottom: 'var(--margin-sm)',
    fontSize: 'var(--font-size-md-1)',
    color: 'var(--color-text-primary)',
  };

  const helperTextStyles = {
    color: 'var(--color-text-secondary)',
    width: '100%',
    marginBottom: 'var(--margin-lg)',
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--line-height-md)',
  };

  const continueButtonStyles = {
    marginBottom: 'var(--margin-sm)',
    width: '100%',
    height: 'var(--height-sm)',
    padding: '0px',
  };

  const handleLogin = async () => {
    if (!username || !password) return;

    setLoading(true);
    setShowToast(false);
    try {
      await login(username, password);
      
      // Show success toast briefly
      setToastMessage('Admin logged in successfully!');
      setToastType('success');
      setShowToast(true);
      
      // Reset loading state - the useEffect will handle redirect when isAuthenticated becomes true
      setLoading(false);
      
      // Auto-hide toast after 1 second (redirect will happen via useEffect)
      setTimeout(() => {
        setShowToast(false);
      }, 1000);
    } catch (error: any) {
      setLoading(false);
      // Show error toast
      const errorMsg = error.message || 'Login failed. Please try again.';
      setToastMessage(errorMsg);
      setToastType('error');
      setShowToast(true);
      // Auto-hide error toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      console.error('Login failed:', error);
    }
  };

  return (
    <Box sx={pageContainerStyles}>
      <Card onClick={() => {}} sx={cardStyles}>
        {/* Heading */}
        <Box sx={headingContainerStyles}>
          <Typography variant="heading-sm" sx={{ marginBottom: 'var(--margin-sm)' }}>
            Admin Login
          </Typography>
          {/* Subtitle */}
          <Typography variant="text-sm" sx={subtitleStyles}>
            Sign in to access the Admin Panel
          </Typography>
        </Box>
        {/* Username Input */}
        <TextField
          label=""
          helperText=""
          variant="standard"
          placeholder="Username"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          sx={usernameInputStyles}
        />
        {/* Password Input */}
        <TextField
          helperText=""
          label=""
          variant="standard"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          sx={passwordInputStyles}
        />
        {/* Helper Text */}
        <Typography variant="text-sm" sx={helperTextStyles}>
          Must be at least 8 characters
        </Typography>
        {/* Continue Button */}
        <Button
          disabled={!username || !password}
          variant={username && password ? 'primary-dark' : 'primary-light'}
          onClick={handleLogin}
          loading={loading}
          sx={continueButtonStyles}
        >
          Continue
        </Button>
        {/* Bottom Links */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: 'var(--margin-md)',
          }}
        >
          <Link href={ROUTES.RESET_PASSWORD}>
            <Button disabled={false} sx={{}} variant="blue-text">
              Forgot your password?
            </Button>
          </Link>
        </Box>
      </Card>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        visible={showToast}
        position="top-center"
        onClose={() => setShowToast(false)}
        showCloseButton={true}
        sx={{ textAlign: 'center' }}
      />
    </Box>
  );
}

export default function LoginPage() {
  const loadingContainerStyles = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Suspense fallback={
      <Box sx={loadingContainerStyles}>
        <Typography>Loading...</Typography>
      </Box>
    }>
      <LoginForm />
    </Suspense>
  );
}

