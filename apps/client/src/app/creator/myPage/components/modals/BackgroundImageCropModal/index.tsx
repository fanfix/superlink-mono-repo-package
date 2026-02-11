'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Slider } from '@mui/material';
import { Typography, Button, Modal } from '@superline/design-system';
import Cropper, { Area } from 'react-easy-crop';
import { getCroppedImg, dataURLtoFile } from '../../UploadContentModal/utils';

export type BackgroundAppearance = 'light' | 'dark';

export interface BackgroundImageCropResult {
  file: File;
  opacity: number;
  blur: number;
  appearance: BackgroundAppearance;
}

interface BackgroundImageCropModalProps {
  open: boolean;
  imageFile: File | null;
  onClose: () => void;
  onSave: (result: BackgroundImageCropResult) => void;
  title?: string;
}

const OPACITY_MIN = 10;
const OPACITY_MAX = 100;
const BLUR_MIN = 0;
const BLUR_MAX = 20;

export default function BackgroundImageCropModal({
  open,
  imageFile,
  onClose,
  onSave,
  title = 'Crop Image',
}: BackgroundImageCropModalProps) {
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(70);
  const [blur, setBlur] = useState(0);
  const [appearance, setAppearance] = useState<BackgroundAppearance>('light');
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
        setPreviewImageUrl(null);
        setOpacity(70);
        setBlur(0);
        setAppearance('light');
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile, open]);

  // Generate cropped image URL when crop area changes (for preview)
  useEffect(() => {
    if (tempImage && croppedAreaPixels) {
      getCroppedImg(tempImage, croppedAreaPixels)
        .then((url) => setPreviewImageUrl(url))
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
      const file = dataURLtoFile(cropped, imageFile?.name || 'background-image.jpg');
      onSave({ file, opacity, blur, appearance });
      onClose();
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  }, [tempImage, croppedAreaPixels, imageFile, opacity, blur, appearance, onSave, onClose]);

  const handleClose = useCallback(() => {
    setTempImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setPreviewImageUrl(null);
    setOpacity(70);
    setBlur(0);
    setAppearance('light');
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
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

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

  const sliderSectionStyles = { mt: 2, px: 1 };

  // Circular Appearance options: Light (white blur) / Dark (black blur)
  const appearanceCircleStyles = (active: boolean) => ({
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: '2px solid rgba(0,0,0,0.2)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: active ? '2px solid var(--color-black)' : 'none',
    outlineOffset: 2,
  });

  // Preview layer: cropped image with opacity + blur (backgroundSize always cover)
  const previewLayerSx = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: previewImageUrl ? `url(${previewImageUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: opacity / 100,
    filter: blur > 0 ? `blur(${blur}px)` : 'none',
    zIndex: 0,
  };

  // Overlay for light (white blur) / dark (black blur) in preview
  const previewOverlaySx = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: appearance === 'light' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    zIndex: 1,
    pointerEvents: 'none' as const,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      subtitle="Crop, zoom, opacity, blur and appearance (light = white blur, dark = black blur)"
      maxWidth={560}
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
          <Typography sx={sectionTitleStyles}>CROP</Typography>
          <Box sx={cropAreaStyles}>
            {tempImage && (
              <Cropper
                image={tempImage}
                crop={crop}
                zoom={zoom}
                aspect={undefined}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            )}
          </Box>
        </Box>

        <Box>
          <Typography sx={sectionTitleStyles}>PREVIEW</Typography>
          <Box sx={previewAreaStyles}>
            {previewImageUrl ? (
              <>
                <Box sx={previewLayerSx} />
                <Box sx={previewOverlaySx} />
              </>
            ) : (
              <Typography sx={previewPlaceholderStyles}>Crop to see preview</Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={sliderSectionStyles}>
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

      <Box sx={sliderSectionStyles}>
        <Typography sx={sectionTitleStyles}>Opacity</Typography>
        <Slider
          value={opacity}
          min={OPACITY_MIN}
          max={OPACITY_MAX}
          step={1}
          onChange={(_, value) => setOpacity(value as number)}
          sx={sliderThumbVisibleStyles}
        />
      </Box>

      <Box sx={sliderSectionStyles}>
        <Typography sx={sectionTitleStyles}>Blur</Typography>
        <Slider
          value={blur}
          min={BLUR_MIN}
          max={BLUR_MAX}
          step={1}
          onChange={(_, value) => setBlur(value as number)}
          sx={sliderThumbVisibleStyles}
        />
      </Box>

      <Box sx={{ ...sliderSectionStyles, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography sx={sectionTitleStyles}>Appearance</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 0.5, alignItems: 'center' }}>
          <Box
            component="button"
            type="button"
            onClick={() => setAppearance('light')}
            sx={{
              ...appearanceCircleStyles(appearance === 'light'),
              backgroundColor: '#fff',
              border: '2px solid rgba(0,0,0,0.25)',
              p: 0,
            }}
            aria-label="Light (white blur)"
          />
          <Box
            component="button"
            type="button"
            onClick={() => setAppearance('dark')}
            sx={{
              ...appearanceCircleStyles(appearance === 'dark'),
              backgroundColor: '#1a1a1a',
              border: '2px solid rgba(0,0,0,0.25)',
              p: 0,
              position: 'relative' as const,
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '60%',
                height: 2,
                background: 'rgba(255,255,255,0.4)',
                transform: 'translate(-50%, -50%) rotate(-45deg)',
              },
            }}
            aria-label="Dark (black blur)"
          />
        </Box>
      </Box>
    </Modal>
  );
}
