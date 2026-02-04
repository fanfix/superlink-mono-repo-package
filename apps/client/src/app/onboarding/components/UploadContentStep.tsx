'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, IconButton, InputAdornment, Popover, Slider } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CloseIcon from '@mui/icons-material/Close';
import Cropper, { Area } from 'react-easy-crop';
import { HexColorPicker } from 'react-colorful';
import { Button, Modal, TextField, Typography } from '@superline/design-system';
import { useAuth } from '../../../contexts/AuthContext';
import { useApiCall } from '../../../hooks/useApiCall';
import { uploadExclusiveContentApi } from '../../../api/services/uploadService';
import type { UploadExclusiveContentInput } from '../../../api/types';

interface UploadContentStepProps {
  onContinue: () => void;
}

const EMOJI_LIST = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '😴', '🔥', '💯', '💪', '👍', '👏', '🙌', '🤝', '🙏', '❤️', '💛', '💚', '💙', '💜', '🖤', '🤍', '💔', '💕', '💞', '💓', '💖', '💘', '💝', '⭐', '✨', '💫', '⚡', '🎉', '🎊'];

// Style variables
const containerStyles = {
  maxWidth: 'var(--width-onboarding-container-xs)',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  mt: '3',
};

const titleStyles = {
  fontSize: { xs: 'var(--font-size-onboarding-3xl)', md: 'var(--font-size-onboarding-5xl)' },
  fontWeight: 700,
  color: 'var(--color-onboarding-text-dark)',
};

const descriptionStyles = {
  fontSize: 'var(--font-size-onboarding-lg)',
  color: 'var(--color-onboarding-text-medium)',
  lineHeight: 1.5,
};

const getUploadBoxStyles = (hasImage: boolean) => ({
  width: '100%',
  borderRadius: 'var(--border-radius-onboarding-upload)',
  border: '1.5px dashed var(--color-onboarding-border-lightest)',
  backgroundColor: 'var(--color-onboarding-background-light)',
  padding: hasImage ? 2.5 : 4,
  cursor: hasImage ? 'default' : 'pointer',
  transition: 'all 0.2s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: hasImage ? 'var(--color-onboarding-background-light)' : 'var(--color-onboarding-background-lighter)',
    borderColor: hasImage ? 'var(--color-onboarding-border-lightest)' : 'var(--color-onboarding-border-medium)',
  },
});

const closeButtonStyles = {
  position: 'absolute',
  top: 10,
  right: 10,
  width: 'var(--height-onboarding-close-button)',
  height: 'var(--height-onboarding-close-button)',
  backgroundColor: 'var(--color-onboarding-background-overlay)',
  color: 'var(--color-white)',
  '&:hover': {
    backgroundColor: 'var(--color-onboarding-background-overlay-hover)',
  },
};

const imagePreviewContainerStyles = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: 'center',
  gap: 2,
};

const imageBoxStyles = {
  flex: 1,
  width: '100%',
  borderRadius: 'var(--border-radius-onboarding-image)',
  overflow: 'hidden',
  height: 'var(--height-onboarding-image)',
  boxShadow: 'var(--shadow-onboarding-image)',
};

const imageStyles = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const arrowBoxStyles = {
  width: 'var(--height-onboarding-arrow-box)',
  height: 'var(--height-onboarding-arrow-box)',
  borderRadius: '50%',
  border: '1px solid var(--color-onboarding-icon-border)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  color: 'var(--color-onboarding-icon-gray)',
};

const blurredImageStyles = {
  flex: 1,
  width: '100%',
  borderRadius: 'var(--border-radius-onboarding-image)',
  overflow: 'hidden',
  height: 'var(--height-onboarding-image)',
  position: 'relative',
  boxShadow: 'var(--shadow-onboarding-image)',
};

const blurredImageImgStyles = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  filter: 'blur(10px)',
  transform: 'scale(1.1)',
};

const titleOverlayStyles = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  px: 3,
};

const getTitleTextStyles = (color: string) => ({
  fontSize: 'var(--font-size-onboarding-xl)',
  fontWeight: 600,
  textAlign: 'center',
  color: color,
  textShadow: 'var(--shadow-onboarding-text)',
  letterSpacing: -0.3,
  wordBreak: 'break-word',
});

const emptyStateContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1,
};

const formContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  mt: 0.5,
};

const fieldLabelStyles = {
  fontSize: 'var(--font-size-onboarding-md)',
  fontWeight: 600,
  color: 'var(--color-onboarding-text-gray-dark)',
  mb: 0.75,
};

const textFieldStyles = {
  width: '100% !important',
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'var(--color-onboarding-background-lightest) !important',
    borderRadius: 2,
    width: '100% !important',
    '& fieldset': {
      borderColor: 'var(--color-onboarding-border-light)',
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-onboarding-border-dark)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-onboarding-text-dark)',
      borderWidth: '1px',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: 'var(--spacing-onboarding-gap-lg) var(--padding-onboarding-md)',
    fontSize: 'var(--font-size-onboarding-md)',
    color: 'var(--color-onboarding-text-gray-darker)',
    '&::placeholder': {
      color: 'var(--color-onboarding-text-gray-medium)',
      opacity: 1,
    },
  },
};

const emojiPickerStyles = {
  p: 2,
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 1fr)',
  gap: 1,
  maxHeight: 'var(--height-onboarding-emoji-picker)',
  maxWidth: 'var(--width-onboarding-emoji-picker)',
  overflowY: 'auto',
};

const emojiItemStyles = {
  fontSize: 'var(--font-size-onboarding-2xl)',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'background 0.2s ease',
  borderRadius: 'var(--border-radius-onboarding-emoji)',
  '&:hover': {
    backgroundColor: 'var(--color-onboarding-background-gray-light)',
  },
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

const modalGridStyles = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  gap: 2,
};

const cropContainerStyles = {
  position: 'relative',
  width: '100%',
  height: 'var(--height-onboarding-crop)',
  borderRadius: 'var(--border-radius-onboarding-image)',
  overflow: 'hidden',
  backgroundColor: 'var(--color-onboarding-text-dark)',
};

const previewContainerStyles = {
  width: '100%',
  height: 'var(--height-onboarding-crop)',
  borderRadius: 'var(--border-radius-onboarding-image)',
  border: '1px solid var(--color-onboarding-background-gray-lighter)',
  backgroundColor: 'var(--color-onboarding-background-light)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
};

const sliderStyles = {
  color: 'var(--color-onboarding-text-dark)',
  '& .MuiSlider-thumb': {
    width: 'var(--height-onboarding-slider-thumb)',
    height: 'var(--height-onboarding-slider-thumb)',
  },
};

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, pixelCrop: Area) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Unable to get canvas context');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas.toDataURL('image/jpeg', 0.95);
};

const UploadContentStep = ({ onContinue }: UploadContentStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser, userState } = useAuth();
  const bioId = currentUser?.bio?.id || userState?.bio?.id || null;
  const { execute: uploadExclusiveContent, loading: uploading } = useApiCall(uploadExclusiveContentApi);
  const [serverError, setServerError] = useState<string>('');

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [titleColor, setTitleColor] = useState('#ff7d3c');

  const [emojiAnchor, setEmojiAnchor] = useState<HTMLButtonElement | null>(null);
  const [colorAnchor, setColorAnchor] = useState<HTMLButtonElement | null>(null);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSavingCrop, setIsSavingCrop] = useState(false);

  const openEmojiPicker = (event: React.MouseEvent<HTMLButtonElement>) => {
    setEmojiAnchor(event.currentTarget);
  };

  const handleEmojiSelect = (emoji: string) => {
    setTitle((prev) => prev + emoji);
    setEmojiAnchor(null);
  };

  const closeEmojiPicker = () => setEmojiAnchor(null);

  const openColorPicker = (event: React.MouseEvent<HTMLButtonElement>) => {
    setColorAnchor(event.currentTarget);
  };

  const closeColorPicker = () => setColorAnchor(null);

  const resetCropState = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setPreviewImage(null);
  };

  const handleFileSelection = (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setTempImage(reader.result as string);
      resetCropState();
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(event.target.files?.[0] ?? null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    handleFileSelection(file ?? null);
  };

  const handleCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  useEffect(() => {
    if (!tempImage || !croppedAreaPixels) {
      setPreviewImage(null);
      return;
    }

    let isActive = true;

    getCroppedImg(tempImage, croppedAreaPixels)
      .then((dataUrl) => {
        if (isActive) {
          setPreviewImage(dataUrl);
        }
      })
      .catch(() => {
        if (isActive) {
          setPreviewImage(null);
        }
      });

    return () => {
      isActive = false;
    };
  }, [croppedAreaPixels, tempImage]);

  const handleCropSave = async () => {
    if (!tempImage || !croppedAreaPixels) {
      return;
    }
    try {
      setIsSavingCrop(true);
      const cropped = await getCroppedImg(tempImage, croppedAreaPixels);
      setUploadedImage(cropped);
      setCropModalOpen(false);
      setTempImage(null);
    } finally {
      setIsSavingCrop(false);
    }
  };

  const handleCropClose = () => {
    setCropModalOpen(false);
    setTempImage(null);
    resetCropState();
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const previewTitle = useMemo(() => title.trim() || 'James David', [title]);

  const isFormValid = Boolean(uploadedImage && title.trim().length > 0);

  const dataUrlToFile = useCallback((dataUrl: string, filename: string): File => {
    const [meta, b64] = dataUrl.split(',');
    const mime = meta?.match(/data:(.*?);base64/)?.[1] || 'image/jpeg';
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new File([bytes], filename, { type: mime });
  }, []);

  const handleContinue = useCallback(async () => {
    // Skip if user didn't add content
    if (!isFormValid) {
      onContinue();
      return;
    }

    if (!bioId) {
      setServerError('Profile is not ready yet. Please try again in a moment.');
      return;
    }

    try {
      setServerError('');

      const file = dataUrlToFile(uploadedImage as string, `exclusive-${Date.now()}.jpg`);

      const countdownStart =
        minutes.trim() && seconds.trim()
          ? parseInt(minutes, 10) * 60 + parseInt(seconds, 10)
          : undefined;

      const percentDiscount = discount.trim() ? parseFloat(discount) : undefined;
      const priceDollars = price.trim() ? parseFloat(price) : 0;
      const priceCents = Math.round(priceDollars * 100);

      const fakePriceCents =
        percentDiscount !== undefined && percentDiscount > 0
          ? Math.round((priceDollars / (1 - percentDiscount / 100)) * 100)
          : undefined;

      const cropWidth = Math.round(croppedAreaPixels?.width ?? 100);
      const cropHeight = Math.round(croppedAreaPixels?.height ?? 100);
      const cropX = Math.round(croppedAreaPixels?.x ?? 0);
      const cropY = Math.round(croppedAreaPixels?.y ?? 0);

      const input: UploadExclusiveContentInput = {
        file,
        price: priceCents,
        fakePrice: fakePriceCents,
        title: title.trim(),
        titleColor,
        cropWidth,
        cropHeight,
        cropX,
        cropY,
        icon: undefined,
        countdownStart,
        percentDiscount,
        description: title.trim(),
      };

      await uploadExclusiveContent(bioId, input);
      onContinue();
    } catch (err: any) {
      setServerError(err?.message || 'Failed to upload content. Please try again.');
    }
  }, [
    bioId,
    croppedAreaPixels?.height,
    croppedAreaPixels?.width,
    croppedAreaPixels?.x,
    croppedAreaPixels?.y,
    dataUrlToFile,
    discount,
    minutes,
    onContinue,
    price,
    seconds,
    title,
    titleColor,
    uploadExclusiveContent,
    uploadedImage,
    isFormValid,
  ]);

  return (
    <Box sx={containerStyles}>
      <Typography sx={titleStyles}>Upload your content.</Typography>

      <Typography sx={descriptionStyles}>
        We&apos;ll automatically build out your profile for you.
      </Typography>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />

      <Box
        onClick={() => !uploadedImage && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        sx={getUploadBoxStyles(!!uploadedImage)}
      >
        {uploadedImage ? (
          <>
            <IconButton
              onClick={(event) => {
                event.stopPropagation();
                handleRemoveImage();
              }}
              sx={closeButtonStyles}
            >
              <CloseIcon sx={{ fontSize: 'var(--width-onboarding-icon-small)' }} />
            </IconButton>
            <Box sx={imagePreviewContainerStyles}>
              <Box sx={imageBoxStyles}>
                <Box component="img" src={uploadedImage} alt="Original upload" sx={imageStyles} />
              </Box>
              <Box sx={arrowBoxStyles}>→</Box>
              <Box sx={blurredImageStyles}>
                <Box component="img" src={uploadedImage} alt="Blurred preview" sx={blurredImageImgStyles} />
                <Box sx={titleOverlayStyles}>
                  <Typography sx={getTitleTextStyles(titleColor)}>{previewTitle}</Typography>
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={emptyStateContainerStyles}>
            <DownloadIcon sx={{ fontSize: 26, color: 'var(--color-onboarding-text-gray-darkest)', mb: 0.5 }} />
            <Typography sx={{ fontSize: 'var(--font-size-onboarding-md)', fontWeight: 500, color: 'var(--color-onboarding-text-gray-dark)' }}>
              Drag and drop your content here.
            </Typography>
            <Typography sx={{ fontSize: 'var(--font-size-onboarding-sm)', color: 'var(--color-onboarding-text-gray-medium)' }}>Max. image size 1gb</Typography>
          </Box>
        )}
      </Box>

      <Box sx={formContainerStyles}>
        <Box>
          <Typography sx={fieldLabelStyles}>Title</Typography>
          <TextField
            variant="outlined"
            placeholder="Enter your title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={openColorPicker}
                    sx={{ mr: 0.5 }}
                  >
                    <FormatColorFillIcon sx={{ fontSize: 'var(--width-onboarding-icon-small)', color: 'var(--color-onboarding-text-gray-medium)' }} />
                  </IconButton>
                  <IconButton edge="end" size="small" onClick={openEmojiPicker}>
                    <EmojiEmotionsIcon sx={{ fontSize: 'var(--width-onboarding-icon-small)', color: 'var(--color-onboarding-text-gray-medium)' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={textFieldStyles}
          />

          <Popover
            open={Boolean(emojiAnchor)}
            anchorEl={emojiAnchor}
            onClose={closeEmojiPicker}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={emojiPickerStyles}>
              {EMOJI_LIST.map((emoji) => (
                <Box key={emoji} onClick={() => handleEmojiSelect(emoji)} sx={emojiItemStyles}>
                  {emoji}
                </Box>
              ))}
            </Box>
          </Popover>

          <Popover
            open={Boolean(colorAnchor)}
            anchorEl={colorAnchor}
            onClose={closeColorPicker}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <Box sx={{ p: 2 }}>
              <HexColorPicker color={titleColor} onChange={setTitleColor} />
            </Box>
          </Popover>
        </Box>

        <Box>
          <Typography sx={fieldLabelStyles}>Price</Typography>
          <TextField
            variant="outlined"
            placeholder="Enter price"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            sx={textFieldStyles}
          />
        </Box>

        <Box>
          <Typography sx={fieldLabelStyles}>Discount</Typography>
          <TextField
            variant="outlined"
            placeholder="0 to 99% off"
            value={discount}
            onChange={(event) => setDiscount(event.target.value)}
            sx={textFieldStyles}
          />
        </Box>

        <Box sx={{ mt: 0.5 }}>
          <Typography sx={{ ...fieldLabelStyles, mb: 1 }}>Countdown (59m 59s max)</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 140 }}>
              <Typography sx={{ fontSize: 'var(--font-size-onboarding-sm)', color: 'var(--color-onboarding-text-gray-light)', mb: 0.5 }}>Minutes</Typography>
              <TextField
                variant="outlined"
                placeholder="Minutes"
                value={minutes}
                onChange={(event) => setMinutes(event.target.value)}
                sx={textFieldStyles}
                inputProps={{ inputMode: 'numeric' }}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 140 }}>
              <Typography sx={{ fontSize: 13, color: '#888', mb: 0.5 }}>Seconds</Typography>
              <TextField
                variant="outlined"
                placeholder="Seconds"
                value={seconds}
                onChange={(event) => setSeconds(event.target.value)}
                sx={textFieldStyles}
                inputProps={{ inputMode: 'numeric' }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 2, width: '100%' }}>
        {serverError && (
          <Typography
            sx={{
              fontSize: 'var(--font-size-onboarding-sm)',
              color: '#dc2626',
              mb: 1.5,
            }}
          >
            {serverError}
          </Typography>
        )}
        <Box sx={{ mt: 3 }}>
          <Button
            variant={isFormValid ? 'primary-dark' : 'primary-light'}
            fullWidth
            sx={buttonStyles}
            onClick={handleContinue}
            loading={uploading}
            disabled={uploading}
          >
            Continue
          </Button>
        </Box>
        <Typography
          component="button"
          onClick={() => {
            if (uploading) return;
            onContinue();
          }}
          sx={{
            ...skipButtonStyles,
            opacity: uploading ? 0.5 : 1,
            cursor: uploading ? 'not-allowed' : 'pointer',
          }}
        >
          Skip for Now
        </Typography>
      </Box>

      <Modal
        open={cropModalOpen}
        onClose={handleCropClose}
        title="Crop Image"
        subtitle="Zoom and position your image before uploading"
        maxWidth={520}
        actions={
          <Button
            variant="primary-dark"
            fullWidth
            disabled={!croppedAreaPixels || isSavingCrop}
            onClick={handleCropSave}
            sx={{ height: 'var(--height-onboarding-button-large)', borderRadius: 'var(--border-radius-onboarding-input)', fontWeight: 600 }}
          >
            {isSavingCrop ? 'Saving…' : 'Save'}
          </Button>
        }
      >
        <Box sx={modalGridStyles}>
          <Box>
            <Typography sx={{ fontSize: 'var(--font-size-onboarding-sm)', fontWeight: 600, color: 'var(--color-onboarding-text-gray-dark)', mb: 1 }}>Crop</Typography>
            <Box sx={cropContainerStyles}>
              {tempImage && (
                <Cropper
                  image={tempImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={3 / 4}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              )}
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#555', mb: 1 }}>Preview</Typography>
            <Box sx={previewContainerStyles}>
              {previewImage ? (
                <Box component="img" src={previewImage} alt="Preview" sx={imageStyles} />
              ) : (
                <Typography sx={{ fontSize: 'var(--font-size-onboarding-sm)', color: 'var(--color-onboarding-text-gray-lighter)' }}>No file chosen</Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#555', mb: 1 }}>Zoom</Typography>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.01}
            onChange={(_, value) => setZoom(value as number)}
            sx={sliderStyles}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default UploadContentStep;
