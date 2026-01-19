import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Typography } from '@superline/design-system';
import { Close as CloseIcon, ArrowDownward } from '@mui/icons-material';
import { styles } from './styles';

interface ImagePreviewProps {
  imageUrl: string | null;
  title: string;
  titleColor: string;
  onRemove: () => void;
  onSelectFile: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  title,
  titleColor,
  onRemove,
  onSelectFile,
}) => {
  const emptyStateIconStyles = {
    fontSize: 26,
    color: '#333',
    mb: 0.5,
  };

  const emptyStateTitleStyles = {
    fontSize: 14,
    fontWeight: 500,
    color: '#555',
  };

  const emptyStateSubtitleStyles = {
    fontSize: 13,
    color: '#999',
  };
  if (imageUrl) {
    return (
      <>
        <IconButton 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }} 
          sx={styles.removeImageButton}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Box 
          sx={styles.previewContainer} 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelectFile();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
        >
          <Box sx={styles.previewImageBox}>
            <Box component="img" src={imageUrl} alt="Original upload" sx={styles.previewImage} />
          </Box>
          <Box sx={styles.arrowIndicator}>→</Box>
          <Box sx={styles.blurredPreviewBox}>
            <Box component="img" src={imageUrl} alt="Blurred preview" sx={styles.blurredPreviewImage} />
            <Box sx={styles.titleOverlay}>
              <Typography sx={styles.titleText(titleColor)}>{title}</Typography>
            </Box>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <Box 
      sx={styles.emptyState} 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelectFile();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      <ArrowDownward sx={emptyStateIconStyles} />
      <Typography sx={emptyStateTitleStyles}>Drag and drop your content here.</Typography>
      <Typography sx={emptyStateSubtitleStyles}>Max. image size 1gb</Typography>
    </Box>
  );
};

