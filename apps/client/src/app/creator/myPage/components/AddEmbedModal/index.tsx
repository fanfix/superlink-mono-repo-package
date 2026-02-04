'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Box, OutlinedInput, FormControl, Select, MenuItem, Radio, RadioGroup, FormControlLabel, Typography, CircularProgress } from '@mui/material';
import { Modal, Button } from '@superline/design-system';
import { AddEmbedModalProps } from './types';
import { embedModalStyles } from './styles';
import { useRssFeed } from '../../../../../hooks/useRssFeed';
import { getEmbedPlatform, embedSizes, titleCharLimit } from '../../../../../utils/embedHelpers';
import { useDebounce } from '../../../../../utils/debounce';
import { EmbedMaker } from '../../../../../components/EmbedMaker';

export default function AddEmbedModal({ open, onClose, onAdd, customSectionId }: AddEmbedModalProps) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [size, setSize] = useState('small');
  const [imageURL, setImageURL] = useState('');
  const [rssTitle, setRssTitle] = useState('');
  const [rssLimit, setRssLimit] = useState('3');
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const { fetchRssFeed, loading: rssLoading } = useRssFeed();
  const lastProcessedUrlRef = useRef<string>('');

  const debouncedUrl = useDebounce(url, 300);

  useEffect(() => {
    const detectPlatform = async (urlValue: string) => {
      if (!urlValue || !urlValue.trim()) {
        setName('');
        setDetecting(false);
        lastProcessedUrlRef.current = '';
        return;
      }

      const trimmedUrl = urlValue.trim();
      
      // Prevent duplicate processing of same URL
      if (lastProcessedUrlRef.current === trimmedUrl) {
        return;
      }

      lastProcessedUrlRef.current = trimmedUrl;
      setDetecting(true);
      
      try {
        // First try RSS feed detection
        const rssFeed = await fetchRssFeed(trimmedUrl);
        if (rssFeed && rssFeed.length > 0) {
          setName('RSS');
          setDetecting(false);
          return;
        }
        
        // If not RSS, try platform detection
        const platform = getEmbedPlatform(trimmedUrl);
        if (platform) {
          setName(platform);
        } else {
          setName('');
        }
      } catch (error) {
        // Fallback to platform detection even on error
        const platform = getEmbedPlatform(trimmedUrl);
        if (platform) {
          setName(platform);
        } else {
          setName('');
        }
      } finally {
        setDetecting(false);
      }
    };

    if (debouncedUrl && debouncedUrl.trim()) {
      detectPlatform(debouncedUrl);
    } else {
      setName('');
      setDetecting(false);
      lastProcessedUrlRef.current = '';
    }
  }, [debouncedUrl, fetchRssFeed]);

  const getUrl = useCallback((nameValue: string, urlValue: string) => {
    if (nameValue === 'RSS') {
      try {
        const urlObj = new URL(urlValue);
        urlObj.searchParams.set('limit', rssLimit);
        urlObj.searchParams.set('title', rssTitle);
        return urlObj.toString();
      } catch {
        return urlValue;
      }
    }
    return urlValue;
  }, [rssLimit, rssTitle]);

  const handleClose = useCallback(() => {
    setUrl('');
    setName('');
    setSize('small');
    setImageURL('');
    setRssTitle('');
    setRssLimit('3');
    setLoading(false);
    onClose();
  }, [onClose]);

  const handleAdd = useCallback(async () => {
    if (!url || !name || (name === 'RSS' && !rssTitle)) {
      return;
    }

    setLoading(true);
    try {
      const finalUrl = getUrl(name, url);
      onAdd({
        name: name.trim(),
        url: finalUrl,
        size,
        imageURL: imageURL || undefined,
      });
      handleClose();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [url, name, size, imageURL, rssTitle, rssLimit, getUrl, onAdd, handleClose]);

  const isFormValid = url && name && (name !== 'RSS' || rssTitle);
  const availableSizes = name ? (embedSizes[name] || []) : [];
  const isLoading = detecting || rssLoading;

  return (
    <Modal open={open} onClose={handleClose} title="Add Embed" maxWidth={600}>
      <Box sx={embedModalStyles.modalContentContainer}>
        <Box>
          <Typography sx={embedModalStyles.label}>Website URL</Typography>
          <OutlinedInput
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setName('');
            }}
            placeholder="https://example.com/"
            sx={embedModalStyles.input}
            fullWidth
          />
        </Box>

        {isLoading && (
          <Box sx={embedModalStyles.previewContainer}>
            <CircularProgress size={24} />
          </Box>
        )}

        {name === 'RSS' && !isLoading && (
          <>
            <Box>
              <Typography sx={embedModalStyles.label}>RSS Title</Typography>
              <OutlinedInput
                value={rssTitle}
                onChange={(e) => setRssTitle(e.target.value)}
                placeholder="RSS Feed Title"
                inputProps={{ maxLength: titleCharLimit }}
                required
                sx={embedModalStyles.input}
                fullWidth
              />
            </Box>
            <Box>
              <Typography sx={embedModalStyles.label}>Feed Limit</Typography>
              <FormControl fullWidth>
                <Select
                  value={rssLimit}
                  onChange={(e) => setRssLimit(e.target.value)}
                  sx={embedModalStyles.input}
                >
                  {['1', '2', '3', '4', '5'].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </>
        )}

        {name && !isLoading && availableSizes.length > 0 && (
          <Box sx={embedModalStyles.sizeOptionsContainer}>
            <Typography sx={{ fontSize: 'var(--font-size-md-1)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--padding-sm)' }}>
              Size
            </Typography>
            <RadioGroup
              value={size}
              onChange={(e) => setSize(e.target.value)}
              row
            >
              {availableSizes.map((sizeOption) => (
                <FormControlLabel
                  key={sizeOption}
                  value={sizeOption.toLowerCase()}
                  control={<Radio />}
                  label={sizeOption}
                />
              ))}
            </RadioGroup>
          </Box>
        )}

        {name && !isLoading && url && (
          <Box sx={embedModalStyles.previewContainer}>
            <EmbedMaker
              name={name}
              url={url}
              size={size}
              _rssLimit={rssLimit}
              _rssTitle={rssTitle}
            />
          </Box>
        )}

        <Box sx={embedModalStyles.actionsContainer}>
          <Button variant="primary-light" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            variant="primary-dark" 
            onClick={handleAdd} 
            disabled={!isFormValid || loading || isLoading} 
            loading={loading}
            sx={embedModalStyles.darkButton}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
