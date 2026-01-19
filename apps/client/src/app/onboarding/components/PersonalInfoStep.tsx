'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import { Button, TextField, Typography } from '@superline/design-system';

interface PersonalInfoStepProps {
  onContinue: (data: { name: string; email: string }) => void;
}

// Style variables
const containerStyles = {
  maxWidth: 'var(--width-onboarding-container)',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
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
  gap: 2.2,
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

const textFieldStyles = {
  width: '100% !important',
  '& .MuiOutlinedInput-root': {
    borderRadius: 'var(--border-radius-onboarding-input)',
    backgroundColor: 'var(--color-white-sidebar) !important',
    minHeight: 'var(--height-onboarding-input)',
    width: '100% !important',
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
    padding: 'var(--padding-onboarding-md) var(--padding-onboarding-xl)',
    fontSize: 'var(--font-size-onboarding-md)',
    fontWeight: 500,
    color: 'var(--color-onboarding-text-dark)',
    '&::placeholder': {
      color: 'var(--color-onboarding-text-placeholder)',
    },
  },
};

const buttonStyles = {
  height: 'var(--height-onboarding-button)',
  borderRadius: 'var(--border-radius-onboarding-button)',
  fontSize: 'var(--font-size-onboarding-lg)',
  fontWeight: 600,
  padding: '0px',
  textTransform: 'none',
};

const PersonalInfoStep = ({ onContinue }: PersonalInfoStepProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleContinue = () => {
    const newErrors: { name?: string; email?: string } = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (name.trim().length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onContinue({ name: name.trim(), email: email.trim() });
    }
  };

  const isFormValid = name.trim().length >= 2 && email.trim().length > 0 && validateEmail(email);

  return (
    <Box sx={containerStyles}>
      <Typography sx={titleStyles}>Tell us about you...</Typography>

      <Typography sx={descriptionStyles}>
        Share your name, email, and phone to complete your profile and stay connected!
      </Typography>

      <Box sx={formContainerStyles}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography sx={fieldLabelStyles}>Name</Typography>

          <TextField
            variant="outlined"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            error={!!errors.name}
            helperText={errors.name}
            sx={textFieldStyles}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography sx={fieldLabelStyles}>Email</Typography>

          <TextField
            variant="outlined"
            placeholder="Enter email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={!!errors.email}
            helperText={errors.email}
            sx={textFieldStyles}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Button
          variant={isFormValid ? 'primary-dark' : 'primary-light'}
          fullWidth
          sx={buttonStyles}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default PersonalInfoStep;


