'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Select, MenuItem, FormControl, OutlinedInput } from '@mui/material';
import { Typography, Button, Modal } from '@superline/design-system';
import { KeyboardArrowDown, Delete as DeleteIcon } from '@mui/icons-material';
import { EditSocialLinkModalProps } from './types';
import { SOCIAL_MEDIA_PLATFORMS } from '../AddSocialLinkModal/constants';
import { socialLinkModalStyles } from '../AddSocialLinkModal/styles';

export default function EditSocialLinkModal({ open, onClose, link, onUpdate, onDelete }: EditSocialLinkModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [urlSuffix, setUrlSuffix] = useState('');
  const [fullUrl, setFullUrl] = useState('');

  const selectedPlatformData = SOCIAL_MEDIA_PLATFORMS.find((p) => p.value === selectedPlatform);

  // Load link data when modal opens
  useEffect(() => {
    if (link && open) {
      setSelectedPlatform(link.platform);
      // Extract URL suffix from full URL
      const platformData = SOCIAL_MEDIA_PLATFORMS.find((p) => p.value === link.platform);
      if (platformData && link.url.startsWith(platformData.urlPrefix)) {
        setUrlSuffix(link.url.replace(platformData.urlPrefix, ''));
      } else {
        setUrlSuffix(link.url);
      }
    } else if (!open) {
      resetForm();
    }
  }, [link, open]);

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
    // Keep URL suffix if switching platforms
  }, []);

  const handleUpdate = useCallback(() => {
    if (link && selectedPlatform && fullUrl) {
      // Extract username from URL if possible
      const username = urlSuffix.trim();
      onUpdate(link.id, selectedPlatform, fullUrl, username);
      handleClose();
    }
  }, [link, selectedPlatform, fullUrl, urlSuffix, onUpdate, handleClose]);

  const handleDelete = useCallback(() => {
    if (link) {
      onDelete(link.id);
      handleClose();
    }
  }, [link, onDelete, handleClose]);

  const isFormValid = selectedPlatform && urlSuffix.trim().length > 0;
  const prefixLength = selectedPlatformData?.urlPrefix.length || 0;

  if (!link) return null;

  return (
    <Modal open={open} onClose={handleClose} title="Edit Social Link" maxWidth={500}>
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

        <Box sx={{ display: 'flex', gap: 'var(--padding-md)', flexDirection: 'column' }}>
          <Button
            variant="primary-dark"
            onClick={handleUpdate}
            disabled={!isFormValid}
            sx={socialLinkModalStyles.darkButton}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            onClick={handleDelete}
            sx={{
              ...socialLinkModalStyles.darkButton,
              borderColor: '#DC2626',
              color: '#DC2626',
              '&:hover': {
                borderColor: '#DC2626',
                backgroundColor: '#FEE2E2',
              },
            }}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

