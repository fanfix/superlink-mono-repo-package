'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Select, MenuItem, FormControl, OutlinedInput } from '@mui/material';
import { Typography, Button, Modal } from '@superline/design-system';
import { KeyboardArrowDown } from '@mui/icons-material';
import { AddSocialLinkModalProps } from './types';
import { SOCIAL_MEDIA_PLATFORMS, EMAIL_REGEX } from './constants';
import { socialLinkModalStyles } from './styles';

export default function AddSocialLinkModal({ open, onClose, onAdd }: AddSocialLinkModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [urlSuffix, setUrlSuffix] = useState('');
  const [fullUrl, setFullUrl] = useState('');
  const [emailError, setEmailError] = useState('');

  const selectedPlatformData = SOCIAL_MEDIA_PLATFORMS.find((p) => p.value === selectedPlatform);
  const isFullUrl = selectedPlatformData?.fullUrl === true;
  const isEmail = selectedPlatformData?.inputType === 'email';

  useEffect(() => {
    if (!selectedPlatformData) {
      setFullUrl('');
      return;
    }
    if (isEmail) {
      const trimmed = urlSuffix.trim();
      setFullUrl(trimmed ? `mailto:${trimmed}` : '');
    } else if (isFullUrl) {
      setFullUrl(urlSuffix.trim());
    } else {
      setFullUrl(selectedPlatformData.urlPrefix + urlSuffix);
    }
  }, [selectedPlatform, urlSuffix, selectedPlatformData, isFullUrl, isEmail]);

  const resetForm = useCallback(() => {
    setSelectedPlatform('');
    setUrlSuffix('');
    setFullUrl('');
    setEmailError('');
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handlePlatformChange = useCallback((platform: string) => {
    setSelectedPlatform(platform);
    setUrlSuffix('');
    setEmailError('');
  }, []);

  const validateEmail = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (!EMAIL_REGEX.test(trimmed)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  }, []);

  const handleAdd = useCallback(() => {
    if (!selectedPlatform) return;
    if (isEmail) {
      if (!validateEmail(urlSuffix)) return;
    } else if (!urlSuffix.trim().length) return;
    if (fullUrl) {
      onAdd(selectedPlatform, fullUrl);
      handleClose();
    }
  }, [selectedPlatform, fullUrl, urlSuffix, isEmail, validateEmail, onAdd, handleClose]);

  const prefixLength = isFullUrl || isEmail ? 0 : (selectedPlatformData?.urlPrefix.length || 0);
  const isFormValid =
    selectedPlatform &&
    urlSuffix.trim().length > 0 &&
    (isEmail ? EMAIL_REGEX.test(urlSuffix.trim()) : true);

  const fieldLabel = isEmail ? 'Email' : isFullUrl ? 'Full URL' : 'URL';
  const placeholder = isEmail
    ? 'your@email.com'
    : isFullUrl
      ? 'Paste full link'
      : selectedPlatform
        ? 'username'
        : 'Select platform first';

  return (
    <Modal open={open} onClose={handleClose} title="Add Social Link" maxWidth={500}>
      <Box sx={socialLinkModalStyles.modalContentContainer}>
        <Box>
          <Typography sx={socialLinkModalStyles.label}>Select Platform</Typography>
          <FormControl fullWidth>
            <Select
              value={selectedPlatform}
              onChange={(e) => handlePlatformChange(e.target.value)}
              displayEmpty
              sx={socialLinkModalStyles.select}
              IconComponent={KeyboardArrowDown}
              MenuProps={{
                PaperProps: {
                  sx: { maxHeight: 300 },
                },
              }}
            >
              <MenuItem value="" disabled>
                <em>Select Platform</em>
              </MenuItem>
              {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
                <MenuItem key={platform.value} value={platform.value}>
                  {platform.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Typography sx={socialLinkModalStyles.label}>{fieldLabel}</Typography>
          <Box sx={socialLinkModalStyles.urlInputWrapper}>
            {selectedPlatformData && !isFullUrl && !isEmail && selectedPlatformData.urlPrefix && (
              <Typography sx={socialLinkModalStyles.urlPrefix}>{selectedPlatformData.urlPrefix}</Typography>
            )}
            <OutlinedInput
              type={isEmail ? 'email' : 'text'}
              value={urlSuffix}
              onChange={(e) => {
                setUrlSuffix(e.target.value);
                if (isEmail) setEmailError('');
              }}
              onBlur={() => isEmail && urlSuffix.trim() && validateEmail(urlSuffix)}
              placeholder={placeholder}
              disabled={!selectedPlatform}
              error={!!emailError}
              sx={socialLinkModalStyles.urlInput(prefixLength)}
            />
          </Box>
          {emailError && (
            <Typography sx={{ fontSize: 12, color: '#DC2626', mt: 0.5 }}>{emailError}</Typography>
          )}
        </Box>

        <Button
          variant="primary-dark"
          onClick={handleAdd}
          disabled={!isFormValid}
          sx={socialLinkModalStyles.darkButton}
        >
          Add
        </Button>
      </Box>
    </Modal>
  );
}

