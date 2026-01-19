'use client';

import React, { useState } from 'react';
import { Box, InputAdornment } from '@mui/material';
import {
  Button,
  TextField,
  Typography,
  SpotifyLogoIcon,
  OnlyFansLogoIcon,
} from '@superline/design-system';
import { getSocialIcon } from '../../creator/myPage/components/sections/SocialLinksSection/utils/getSocialIcon';

interface SocialLinksStepProps {
  onContinue: () => void;
}

// Style variables
const containerStyles = {
  maxWidth: 'var(--width-onboarding-container)',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const titleStyles = {
  fontSize: { xs: 'var(--font-size-onboarding-4xl)', md: 'var(--font-size-onboarding-5xl)' },
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
  gap: 1.3,
  mt: 2.5,
  maxWidth: 'var(--width-onboarding-container-sm)',
  width: '100%',
};

const iconContainerStyles = {
  width: 'var(--width-onboarding-icon)',
  height: 'var(--width-onboarding-icon)',
  borderRadius: 'var(--border-radius-onboarding-icon) !important',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  mr: 1,
};

const getTextFieldStyles = (isActive: boolean) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    width: '100% !important',
    borderRadius: 'var(--border-radius-onboarding-input-round) !important',
    backgroundColor: 'var(--color-onboarding-background-light)',
    '& fieldset': {
      borderColor: isActive ? 'var(--color-onboarding-border-dark)' : 'var(--color-onboarding-border-lighter)',
    },
    '&:hover fieldset': {
      borderColor: isActive ? 'var(--color-onboarding-border-darker)' : 'var(--color-onboarding-border-lightest)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-onboarding-text-dark)',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: 'var(--padding-onboarding-xs) var(--padding-onboarding-lg)',
    fontSize: 'var(--font-size-onboarding-md)',
    fontWeight: 500,
    color: isActive ? 'var(--color-onboarding-text-dark)' : 'var(--color-onboarding-text-placeholder-light)',
    '&::placeholder': {
      color: 'var(--color-onboarding-text-placeholder-lighter)',
    },
  },
  '& .MuiInputAdornment-root': {
    ml: 0,
  },
});

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

const skipButtonStyles = {
  mt: 1.5,
  fontSize: 'var(--font-size-onboarding-sm)',
  color: 'var(--color-onboarding-text-dark)',
  textDecoration: 'underline',
  textAlign: 'center',
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  padding: 0,
  fontFamily: 'inherit',
  width: '100%',
  '&:hover': {
    opacity: 0.8,
  },
};

type SocialKey =
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'snapchat'
  | 'spotify'
  | 'onlyfans';

const SOCIAL_FIELDS: { key: SocialKey; placeholder: string }[] = [
  { key: 'facebook', placeholder: 'Facebook username' },
  { key: 'twitter', placeholder: 'Twitter username' },
  { key: 'instagram', placeholder: 'Instagram username' },
  { key: 'youtube', placeholder: 'Youtube username' },
  { key: 'tiktok', placeholder: 'Tiktok username' },
  { key: 'snapchat', placeholder: 'Snapchat username' },
  { key: 'spotify', placeholder: 'Spotify username' },
  { key: 'onlyfans', placeholder: 'Onlyfans username' },
];

const BRAND_COLORS: Record<SocialKey, string> = {
  facebook: 'var(--color-social-facebook)',
  twitter: 'var(--color-social-twitter)',
  instagram: 'var(--color-social-instagram)',
  youtube: 'var(--color-social-youtube)',
  tiktok: 'var(--color-social-tiktok)',
  snapchat: 'var(--color-social-snapchat)',
  spotify: 'var(--color-social-spotify)',
  onlyfans: 'var(--color-social-onlyfans)',
};

const SocialLinksStep = ({ onContinue }: SocialLinksStepProps) => {
  const [values, setValues] = useState<Record<SocialKey, string>>({
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    snapchat: '',
    spotify: '',
    onlyfans: '',
  });

  const handleChange = (key: SocialKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const hasAnyValue = Object.values(values).some((v) => v.trim().length > 0);

  const renderLogo = (key: SocialKey, active: boolean) => {
    const color = active ? BRAND_COLORS[key] : 'var(--color-onboarding-background-gray-dark)';

    // Use utility function for common platforms
    const commonPlatforms = ['facebook', 'twitter', 'instagram', 'youtube', 'tiktok', 'snapchat'];
    if (commonPlatforms.includes(key)) {
      return getSocialIcon(key.charAt(0).toUpperCase() + key.slice(1), 18, color);
    }

    // Handle special cases (Spotify, OnlyFans) that aren't in the utility yet
    switch (key) {
      case 'spotify':
        return <SpotifyLogoIcon size={18} color={color} />;
      case 'onlyfans':
        return <OnlyFansLogoIcon size={18} color={color} />;
      default:
        return getSocialIcon('TikTok', 18, color);
    }
  };

  return (
    <Box sx={containerStyles}>
      <Typography sx={titleStyles}>Add your links</Typography>

      <Typography sx={descriptionStyles}>
        We&apos;ll automatically build out your profile for you.
      </Typography>

      <Box sx={formContainerStyles}>
        {SOCIAL_FIELDS.map(({ key, placeholder }) => {
          const isActive = values[key]?.trim().length > 0;

          return (
            <TextField
              key={key}
              variant="outlined"
              placeholder={placeholder}
              value={values[key]}
              onChange={(event) => handleChange(key, event.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        ...iconContainerStyles,
                        backgroundColor: isActive ? 'var(--color-white)' : 'var(--color-onboarding-background-gray)',
                        boxShadow: isActive ? 'var(--shadow-onboarding-icon)' : 'none',
                      }}
                    >
                      {renderLogo(key, isActive)}
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={getTextFieldStyles(isActive)}
            />
          );
        })}
      </Box>

      <Box sx={buttonContainerStyles}>
      <Button
          variant={hasAnyValue ? 'primary-dark' : 'primary-light'}
          fullWidth
          sx={buttonStyles}
          onClick={onContinue}
        >
          Continue
        </Button>

        <Typography component="button" onClick={onContinue} sx={skipButtonStyles}>
          Skip for Now
        </Typography>
      </Box>
    </Box>
  );
};

export default SocialLinksStep;


