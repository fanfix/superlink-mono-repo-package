'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, InputAdornment } from '@mui/material';
import { Button, TextField, Typography } from '@superline/design-system';
import { useCheckUsernameAvailability } from '../../../hooks/useOnboardingApi';

interface CreateAccountStepProps {
  onContinue: (data: { username: string }) => void;
  onBack?: () => void;
}

// Style variables
const containerStyles = {
  maxWidth: 'var(--width-onboarding-container)',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

const titleStyles = {
  fontSize: { xs: 'var(--font-size-onboarding-3xl)', md: 'var(--font-size-onboarding-6xl)' },
  fontWeight: 700,
  color: 'var(--color-onboarding-text-dark)',
};

const descriptionStyles = {
  fontSize: 'var(--font-size-onboarding-lg)',
  color: 'var(--color-onboarding-text-medium)',
  maxWidth: 'var(--width-onboarding-container-sm)',
  lineHeight: 1.5,
};

const formContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  mt: 3,
  width: '100%',
};

const fieldLabelStyles = {
  fontSize: 'var(--font-size-onboarding-sm)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  color: 'var(--color-onboarding-text-light)',
};

const prefixStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  height: 'var(--height-onboarding-prefix)',
  backgroundColor: 'transparent',
  fontSize: 'var(--font-size-onboarding-md)',
  color: 'var(--color-onboarding-text-gray)',
  whiteSpace: 'nowrap',
};

const textFieldStyles = {
  width: '100% !important',
  '& .MuiOutlinedInput-root': {
    width: '100% !important',
    borderRadius: 'var(--border-radius-onboarding-input)',
    backgroundColor: 'var(--color-white-sidebar)',
    minHeight: 'var(--height-onboarding-input-small)',
    '& fieldset': {
      borderColor: 'var(--color-onboarding-border-light)',
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-onboarding-border-medium)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-onboarding-text-dark)',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: 'var(--padding-onboarding-xs) var(--padding-onboarding-xs)',
    paddingLeft: 2,
    fontSize: 'var(--font-size-onboarding-md)',
    fontWeight: 500,
    color: 'var(--color-onboarding-text-dark)',
    '&::placeholder': {
      color: 'var(--color-onboarding-text-placeholder)',
    },
  },
  '& .MuiInputAdornment-root': {
    ml: 0,
  },
};

const buttonContainerStyles = {
  mt: 3,
  maxWidth: 'var(--width-onboarding-container-sm)',
  width: '100%',
};

const buttonStyles = {
  height: 'var(--height-onboarding-button)',
  borderRadius: 'var(--border-radius-onboarding-button)',
  fontSize: 'var(--font-size-onboarding-lg)',
  fontWeight: 600,
  padding: '0px',
  textTransform: 'none',
};

const termsTextStyles = {
  mt: { xs: 2 },
  fontSize: { xs: 'var(--font-size-onboarding-sm)', sm: 'var(--font-size-onboarding-md)', md: 'var(--font-size-onboarding-lg)' },
  color: 'var(--color-onboarding-text-medium)',
  maxWidth: { xs: '100%', sm: 'var(--width-onboarding-container-sm)' },
  lineHeight: 1.5,
  flexShrink: 0,
};

const CreateAccountStep = ({ onContinue }: CreateAccountStepProps) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const availabilityRequestId = useRef(0);

  const { execute: checkUsernameAvailability, loading: checkingAvailability } = useCheckUsernameAvailability();

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(username);
  };

  // Debounced username availability check
  useEffect(() => {
    const trimmed = username.trim();
    setIsAvailable(null);

    if (!trimmed || trimmed.length < 3 || trimmed.length > 30 || !validateUsername(trimmed)) {
      return;
    }

    const currentRequest = ++availabilityRequestId.current;
    const timer = setTimeout(async () => {
      try {
        const res = await checkUsernameAvailability(trimmed);
        if (!res || currentRequest !== availabilityRequestId.current) return;

        setIsAvailable(res.available);
        if (res.available) {
          // Clear "already exists" error if user fixed it
          if (error.toLowerCase().includes('already')) setError('');
        } else {
          setError('This username already exists');
        }
      } catch (err: any) {
        if (currentRequest !== availabilityRequestId.current) return;
        setIsAvailable(null);
        // Don't block user with a hard error; show message + keep continue disabled
        setError(err?.message || 'Unable to check username availability');
      }
    }, 450);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const handleContinue = () => {
    const trimmedUsername = username.trim();

    // Validation
    if (!trimmedUsername) {
      setError('Username is required');
      return;
    }

    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (trimmedUsername.length > 30) {
      setError('Username cannot exceed 30 characters');
      return;
    }

    if (!validateUsername(trimmedUsername)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    if (isAvailable !== true) {
      setError('Please choose an available username');
      return;
    }

    setError('');
    onContinue({ username: trimmedUsername });
  };

  const isFormValid = username.trim().length >= 3 && validateUsername(username.trim()) && isAvailable === true;

  return (
    <Box sx={containerStyles}>
      <Typography sx={titleStyles}>Create your account</Typography>

      <Typography sx={descriptionStyles}>
        Choose your unique username. Claim it now and make your profile truly yours.
      </Typography>

      <Box sx={formContainerStyles}>
        <Typography sx={fieldLabelStyles}>Username</Typography>

        <Box sx={{ maxWidth: 'var(--width-onboarding-container-sm)', width: '100%' }}>
          <TextField
            variant="outlined"
            placeholder="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError('');
            }}
            error={!!error}
            helperText={
              error ||
              (checkingAvailability
                ? 'Checking availability...'
                : isAvailable === true
                  ? 'Username is available'
                  : '')
            }
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box component="span" sx={prefixStyles}>
                    Superlink.io/
                  </Box>
                </InputAdornment>
              ),
            }}
            sx={textFieldStyles}
          />
        </Box>
      </Box>

      <Box sx={buttonContainerStyles}>
        <Button
          variant={isFormValid ? 'primary-dark' : 'primary-light'}
          fullWidth
          sx={buttonStyles}
          onClick={handleContinue}
          disabled={!isFormValid || checkingAvailability}
        >
          Continue
        </Button>
        <Typography sx={termsTextStyles}>
          By tapping continue, I confirm that I am 18+, agree to SuperLink&apos;s Terms of Service and Privacy
          Policy, and understand that I may receive SMS notifications.
        </Typography>
      </Box>
    </Box>
  );
};

export default CreateAccountStep;


