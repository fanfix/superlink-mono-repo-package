import React from 'react';
import { Box, Slider } from '@mui/material';
import { Typography, Button, Modal } from '@superline/design-system';
import Cropper, { Area } from 'react-easy-crop';
import { CROP_CONFIG } from './constants';
import { styles } from './styles';

interface CropModalProps {
  open: boolean;
  tempImage: string | null;
  previewImage: string | null;
  crop: { x: number; y: number };
  zoom: number;
  croppedAreaPixels: Area | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (_: Area, croppedPixels: Area) => void;
}

export const CropModal: React.FC<CropModalProps> = ({
  open,
  tempImage,
  previewImage,
  crop,
  zoom,
  croppedAreaPixels,
  isSaving,
  onClose,
  onSave,
  onCropChange,
  onZoomChange,
  onCropComplete,
}) => {
  const saveButtonStyles = {
    height: 46,
    borderRadius: '999px',
    fontWeight: 600,
  };

  const sectionTitleStyles = {
    fontSize: 13,
    fontWeight: 600,
    color: '#555',
    mb: 1,
  };

  const previewPlaceholderStyles = {
    fontSize: 13,
    color: '#9f9f9f',
  };

  const zoomSectionContainerStyles = {
    mt: 3,
    px: 1,
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Crop Image"
      subtitle="Zoom and position your image before uploading"
      maxWidth={520}
      actions={
        <Button
          variant="primary-dark"
          fullWidth
          disabled={!croppedAreaPixels || isSaving}
          onClick={onSave}
          sx={saveButtonStyles}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      }
    >
      <Box sx={styles.cropContainer}>
        <Box>
          <Typography sx={sectionTitleStyles}>Crop</Typography>
          <Box sx={styles.cropArea}>
            {tempImage && (
              <Cropper
                image={tempImage}
                crop={crop}
                zoom={zoom}
                aspect={CROP_CONFIG.ASPECT_RATIO}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropComplete}
              />
            )}
          </Box>
        </Box>

        <Box>
          <Typography sx={sectionTitleStyles}>Preview</Typography>
          <Box sx={styles.previewArea}>
            {previewImage ? (
              <Box component="img" src={previewImage} alt="Preview" sx={styles.previewImage} />
            ) : (
              <Typography sx={previewPlaceholderStyles}>No file chosen</Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={zoomSectionContainerStyles}>
        <Typography sx={sectionTitleStyles}>Zoom</Typography>
        <Slider
          value={zoom}
          min={CROP_CONFIG.ZOOM_MIN}
          max={CROP_CONFIG.ZOOM_MAX}
          step={CROP_CONFIG.ZOOM_STEP}
          onChange={(_, value) => onZoomChange(value as number)}
          sx={styles.zoomSlider}
        />
      </Box>
    </Modal>
  );
};

