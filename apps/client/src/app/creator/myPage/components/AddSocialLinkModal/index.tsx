'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Select, MenuItem, FormControl, OutlinedInput } from '@mui/material';
import { Typography, Button, Modal } from '@superline/design-system';
import { KeyboardArrowDown } from '@mui/icons-material';
import { AddSocialLinkModalProps } from './types';
import { SOCIAL_MEDIA_PLATFORMS } from './constants';
import { socialLinkModalStyles } from './styles';

export default function AddSocialLinkModal({ open, onClose, onAdd }: AddSocialLinkModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [urlSuffix, setUrlSuffix] = useState('');
  const [fullUrl, setFullUrl] = useState('');

  const selectedPlatformData = SOCIAL_MEDIA_PLATFORMS.find((p) => p.value === selectedPlatform);

  useEffect(() => {
    if (selectedPlatformData) {
      setFullUrl(selectedPlatformData.urlPrefix + urlSuffix);
    } else {
      setFullUrl('');
    }
  }, [selectedPlatform, urlSuffix, selectedPlatformData]);

  const resetForm = useCallback(() => {
    setSelectedPlatform('');
    setUrlSuffix('');
    setFullUrl('');
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handlePlatformChange = useCallback((platform: string) => {
    setSelectedPlatform(platform);
    setUrlSuffix('');
  }, []);

  const handleAdd = useCallback(() => {
    if (selectedPlatform && fullUrl) {
      onAdd(selectedPlatform, fullUrl);
      handleClose();
    }
  }, [selectedPlatform, fullUrl, onAdd, handleClose]);

  const isFormValid = selectedPlatform && urlSuffix.trim().length > 0;
  const prefixLength = selectedPlatformData?.urlPrefix.length || 0;

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
          <Typography sx={socialLinkModalStyles.label}>URL</Typography>
          <Box sx={socialLinkModalStyles.urlInputWrapper}>
            {selectedPlatformData && (
              <Typography sx={socialLinkModalStyles.urlPrefix}>{selectedPlatformData.urlPrefix}</Typography>
            )}
            <OutlinedInput
              value={urlSuffix}
              onChange={(e) => setUrlSuffix(e.target.value)}
              placeholder={selectedPlatform ? 'username' : 'Select platform first'}
              disabled={!selectedPlatform}
              sx={socialLinkModalStyles.urlInput(prefixLength)}
            />
          </Box>
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

