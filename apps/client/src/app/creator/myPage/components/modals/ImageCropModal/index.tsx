'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Slider } from '@mui/material';
import { Typography, Button, Modal } from '@superline/design-system';
import Cropper, { Area } from 'react-easy-crop';
import { getCroppedImg, dataURLtoFile } from '../../UploadContentModal/utils';

interface ImageCropModalProps {
  open: boolean;
  imageFile: File | null;
  aspectRatio?: number; // Optional aspect ratio (default: free crop)
  onClose: () => void;
  onSave: (croppedFile: File) => void;
  title?: string;
}

export default function ImageCropModal({
  open,
  imageFile,
  aspectRatio,
  onClose,
  onSave,
  title = 'Crop Image',
}: ImageCropModalProps) {
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load image when file changes
  useEffect(() => {
    if (imageFile && open) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        setPreviewImage(null);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile, open]);

  // Generate preview when crop area changes
  useEffect(() => {
    if (tempImage && croppedAreaPixels) {
      getCroppedImg(tempImage, croppedAreaPixels)
        .then((cropped) => {
          setPreviewImage(cropped);
        })
        .catch(() => undefined);
    }
  }, [tempImage, croppedAreaPixels]);

  const handleCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = useCallback(async () => {
    if (!tempImage || !croppedAreaPixels) return;

    try {
      setIsSaving(true);
      const cropped = await getCroppedImg(tempImage, croppedAreaPixels);
      const file = dataURLtoFile(cropped, imageFile?.name || 'cropped-image.jpg');
      onSave(file);
      onClose();
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  }, [tempImage, croppedAreaPixels, imageFile, onSave, onClose]);

  const handleClose = useCallback(() => {
    setTempImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setPreviewImage(null);
    onClose();
  }, [onClose]);

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

  const cropContainerStyles = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 3,
    mb: 3,
  };

  const cropAreaStyles = {
    position: 'relative' as const,
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const previewAreaStyles = {
    position: 'relative' as const,
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const previewImageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'contain' as const,
  };

  // Slider thumb clearly visible: white dot with dark border (no blend with track)
  const sliderThumbVisibleStyles = {
    mt: 2,
    color: '#181818',
    '& .MuiSlider-thumb': {
      width: 20,
      height: 20,
      backgroundColor: '#fff',
      border: '2px solid #181818',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      '&:hover, &.Mui-focusVisible': {
        boxShadow: '0 0 0 4px rgba(24,24,24,0.2)',
      },
    },
    '& .MuiSlider-rail': {
      opacity: 0.4,
    },
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      subtitle="Zoom and position your image before uploading"
      maxWidth={520}
      actions={
        <Button
          variant="primary-dark"
          fullWidth
          disabled={!croppedAreaPixels || isSaving}
          onClick={handleSave}
          sx={saveButtonStyles}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      }
    >
      <Box sx={cropContainerStyles}>
        <Box>
          <Typography sx={sectionTitleStyles}>Crop</Typography>
          <Box sx={cropAreaStyles}>
            {tempImage && (
              <Cropper
                image={tempImage}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            )}
          </Box>
        </Box>

        <Box>
          <Typography sx={sectionTitleStyles}>Preview</Typography>
          <Box sx={previewAreaStyles}>
            {previewImage ? (
              <Box component="img" src={previewImage} alt="Preview" sx={previewImageStyles} />
            ) : (
              <Typography sx={previewPlaceholderStyles}>No preview available</Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={zoomSectionContainerStyles}>
        <Typography sx={sectionTitleStyles}>Zoom</Typography>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.01}
          onChange={(_, value) => setZoom(value as number)}
          sx={sliderThumbVisibleStyles}
        />
      </Box>
    </Modal>
  );
}

