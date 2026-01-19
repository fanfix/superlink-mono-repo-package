'use client';

import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Image as ImageIcon, Close as CloseIcon } from '@mui/icons-material';
import { styles } from './styles';

interface BackgroundImageSectionProps {
  backgroundImage?: string;
  onImageChange?: (fileOrUrl: File | string) => void;
}

export default function BackgroundImageSection({
  backgroundImage,
  onImageChange,
}: BackgroundImageSectionProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Pass File object directly to parent - it will handle upload
      onImageChange?.(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Pass empty string to remove image
    onImageChange?.('');
  };

  return (
    <Box sx={styles.container}>
      {backgroundImage ? (
        <Box sx={styles.imageContainer}>
          <Box component="img" src={backgroundImage} alt="Background" sx={styles.image} />
          <IconButton sx={styles.removeButton} onClick={handleRemoveImage} size="small">
            <CloseIcon sx={{ fontSize: '18px' }} />
          </IconButton>
        </Box>
      ) : (
        <Box component="label" sx={styles.imageUploadContainer}>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          <ImageIcon sx={{ fontSize: '24px', color: 'var(--color-gray-400)' }} />
        </Box>
      )}
    </Box>
  );
}

