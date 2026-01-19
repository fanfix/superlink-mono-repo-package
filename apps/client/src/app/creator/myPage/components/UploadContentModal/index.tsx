'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Box, OutlinedInput } from '@mui/material';
import { Typography, Button, Modal } from '@superline/design-system';
import { UploadContentModalProps, UploadContentData } from './types';
import { DEFAULT_TITLE_COLOR, DEFAULT_PREVIEW_TITLE, COUNTDOWN_LIMITS } from './constants';
import { styles } from './styles';
import { getCroppedImg, dataURLtoFile } from './utils';
import { ImagePreview } from './ImagePreview';
import { TitleInput } from './TitleInput';
import { CropModal } from './CropModal';
import type { Area } from 'react-easy-crop';

export default function UploadContentModal({ open, onClose, onAdd, onUpdate, onDelete, editingContent }: UploadContentModalProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [showDiscount, setShowDiscount] = useState(false);
  const [discount, setDiscount] = useState('');
  const [countdownMinutes, setCountdownMinutes] = useState('0');
  const [countdownSeconds, setCountdownSeconds] = useState('0');
  const [titleColor, setTitleColor] = useState(DEFAULT_TITLE_COLOR);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // File and image state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Crop state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [savedCropValues, setSavedCropValues] = useState<{ width: number; height: number; x: number; y: number } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSavingCrop, setIsSavingCrop] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  // Load editing content data when modal opens
  useEffect(() => {
    if (editingContent) {
      setTitle(editingContent.title);
      setPrice(editingContent.price);
      setShowDiscount(!!editingContent.discount);
      setDiscount(editingContent.discount || '');
      setCountdownMinutes(editingContent.countdownMinutes || '0');
      setCountdownSeconds(editingContent.countdownSeconds || '0');
      if (editingContent.imageUrl) {
        setImagePreviewUrl(editingContent.imageUrl);
        setSelectedFile(null); // We don't have the original file, so set to null
      }
    } else if (open) {
      // Reset form when opening fresh (not editing)
      resetForm();
    }
  }, [editingContent, open]);

  // Computed values
  const previewTitle = useMemo(() => title.trim() || DEFAULT_PREVIEW_TITLE, [title]);
  const isEditMode = !!editingContent;
  const isFormValid = title.trim().length > 0 && price.trim().length > 0 && (selectedFile !== null || imagePreviewUrl !== null || isEditMode);

  // Reset crop state
  const resetCropState = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setPreviewImage(null);
  }, []);

  // Handle file selection and open crop modal
  const handleFileSelection = useCallback((file: File | null) => {
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
  }, [resetCropState]);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, [handleFileSelection]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelection(e.target.files[0]);
    }
  }, [handleFileSelection]);

  // Crop handlers
  const handleCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropSave = useCallback(async () => {
    if (!tempImage || !croppedAreaPixels) return;

    try {
      setIsSavingCrop(true);
      const cropped = await getCroppedImg(tempImage, croppedAreaPixels);
      const file = dataURLtoFile(cropped, 'cropped-image.jpg');
      setSelectedFile(file);
      setImagePreviewUrl(cropped);
      // Save crop values for API call
      setSavedCropValues({
        width: croppedAreaPixels.width,
        height: croppedAreaPixels.height,
        x: croppedAreaPixels.x,
        y: croppedAreaPixels.y,
      });
      setCropModalOpen(false);
      setTempImage(null);
      resetCropState();
    } finally {
      setIsSavingCrop(false);
    }
  }, [tempImage, croppedAreaPixels, resetCropState]);

  const handleCropClose = useCallback(() => {
    setCropModalOpen(false);
    setTempImage(null);
    resetCropState();
  }, [resetCropState]);

  // Generate preview image when crop area changes
  useEffect(() => {
    if (!tempImage || !croppedAreaPixels) {
      setPreviewImage(null);
      return;
    }

    let isActive = true;
    getCroppedImg(tempImage, croppedAreaPixels)
      .then((dataUrl) => {
        if (isActive) setPreviewImage(dataUrl);
      })
      .catch(() => {
        if (isActive) setPreviewImage(null);
      });

    return () => {
      isActive = false;
    };
  }, [croppedAreaPixels, tempImage]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showEmojiPicker && !target.closest('[data-emoji-picker]')) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Form handlers
  const handleRemoveImage = useCallback(() => {
    setSelectedFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const resetForm = useCallback(() => {
    setTitle('');
    setPrice('');
    setShowDiscount(false);
    setDiscount('');
    setCountdownMinutes('0');
    setCountdownSeconds('0');
    setSelectedFile(null);
    setShowEmojiPicker(false);
    setCropModalOpen(false);
    setTempImage(null);
    setImagePreviewUrl(null);
    resetCropState();
  }, [resetCropState]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleAdd = useCallback(() => {
    if (!isFormValid) return;

    const data: UploadContentData = {
      title: title.trim(),
      price: price.trim(),
      file: selectedFile || undefined,
      discount: showDiscount ? discount : undefined,
      countdownMinutes: showDiscount ? countdownMinutes : undefined,
      countdownSeconds: showDiscount ? countdownSeconds : undefined,
      cropWidth: savedCropValues?.width || 100,
      cropHeight: savedCropValues?.height || 100,
      cropX: savedCropValues?.x || 0,
      cropY: savedCropValues?.y || 0,
      titleColor: titleColor,
      icon: '🔥', // Default icon
    };

    if (editingContent && onUpdate) {
      onUpdate(editingContent.id, data);
    } else {
      onAdd(data);
    }
    handleClose();
  }, [title, price, selectedFile, showDiscount, discount, countdownMinutes, countdownSeconds, savedCropValues, titleColor, isFormValid, onAdd, onUpdate, editingContent, handleClose]);

  const handleDelete = useCallback(() => {
    if (editingContent && onDelete) {
      onDelete(editingContent.id);
      handleClose();
    }
  }, [editingContent, onDelete, handleClose]);

  const handleEmojiClick = useCallback((emojiData: { emoji: string }) => {
    setTitle((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  }, []);

  const validateCountdown = useCallback((value: string, max: number) => {
    return value === '' || (parseInt(value) >= 0 && parseInt(value) <= max);
  }, []);

  const editModeActionsContainerStyles = {
    display: 'flex',
    gap: 'var(--padding-md)',
    flexDirection: 'column',
    width: '100%',
  };

  const deleteButtonStyles = {
    ...styles.addButton,
    backgroundColor: 'transparent',
    color: '#DC2626',
    border: '1px solid #DC2626',
    '&:hover': {
      backgroundColor: '#FEE2E2',
    },
  };

  const modalContentContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-xl)',
  };

  const countdownInputsContainerStyles = {
    display: 'flex',
    gap: 'var(--padding-md)',
  };

  const countdownLabelStyles = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-gray-600)',
    marginBottom: 'var(--padding-xs)',
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title={isEditMode ? "Edit Content" : "Upload Content"}
        maxWidth={520}
        showCloseButton={true}
        actions={
          isEditMode ? (
            <Box sx={editModeActionsContainerStyles}>
              <Button variant="primary-dark" onClick={handleAdd} disabled={!isFormValid} sx={styles.addButton} fullWidth>
                Update
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                sx={deleteButtonStyles}
                fullWidth
              >
                Delete
              </Button>
            </Box>
          ) : (
            <Button variant="primary-dark" onClick={handleAdd} disabled={!isFormValid} sx={styles.addButton} fullWidth>
              Add media
            </Button>
          )
        }
      >
        <Box sx={modalContentContainerStyles}>
          {/* Image Upload Area */}
          <Box
            sx={styles.dragDropArea(!!imagePreviewUrl)}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            <ImagePreview
              imageUrl={imagePreviewUrl}
              title={previewTitle}
              titleColor={titleColor}
              onRemove={handleRemoveImage}
              onSelectFile={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
            />
          </Box>

          {/* Title Input */}
          <TitleInput
            value={title}
            color={titleColor}
            showEmojiPicker={showEmojiPicker}
            colorPickerRef={colorPickerRef}
            onChange={setTitle}
            onColorChange={setTitleColor}
            onEmojiClick={handleEmojiClick}
            onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
          />

          {/* Price Input */}
          <Box>
            <Typography sx={styles.label}>Price</Typography>
            <OutlinedInput
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="$0.51 or more"
              sx={styles.input}
              fullWidth
            />
          </Box>

          {/* Discount Toggle */}
          <Box>
            <Typography component="span" onClick={() => setShowDiscount(!showDiscount)} sx={styles.discountLink}>
              {showDiscount ? '- Hide Discount Options' : '+ Show Discount Options'}
            </Typography>
          </Box>

          {/* Discount Fields */}
          {showDiscount && (
            <>
              <Box>
                <Typography sx={styles.label}>% Discount</Typography>
                <OutlinedInput
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0 to 99% off"
                  sx={styles.input}
                  fullWidth
                />
              </Box>

              <Box>
                <Typography sx={styles.label}>Countdown (59m 59s max)</Typography>
                <Box sx={countdownInputsContainerStyles}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={countdownLabelStyles}>Minutes</Typography>
                    <OutlinedInput
                      value={countdownMinutes}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (validateCountdown(val, COUNTDOWN_LIMITS.MINUTES_MAX)) {
                          setCountdownMinutes(val);
                        }
                      }}
                      placeholder="0"
                      sx={styles.countdownInput}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={countdownLabelStyles}>Seconds</Typography>
                    <OutlinedInput
                      value={countdownSeconds}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (validateCountdown(val, COUNTDOWN_LIMITS.SECONDS_MAX)) {
                          setCountdownSeconds(val);
                        }
                      }}
                      placeholder="0"
                      sx={styles.countdownInput}
                      fullWidth
                    />
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Crop Modal */}
      <CropModal
        open={cropModalOpen}
        tempImage={tempImage}
        previewImage={previewImage}
        crop={crop}
        zoom={zoom}
        croppedAreaPixels={croppedAreaPixels}
        isSaving={isSavingCrop}
        onClose={handleCropClose}
        onSave={handleCropSave}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
      />
    </>
  );
}

