'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, OutlinedInput, IconButton } from '@mui/material';
import { Typography, Button, Modal, Toggle } from '@superline/design-system';
import { Close as CloseIcon } from '@mui/icons-material';
import { AddContentModalProps } from './types';
import { styles } from './styles';

export default function AddContentModal({ open, onClose, onAdd, onDelete, sectionId, editingItem }: AddContentModalProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isEmail, setIsEmail] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    setThumbnail(null);
    setTitle('');
    setUrl('');
    setIsEmail(false);
    setDragActive(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  useEffect(() => {
    if (open) {
      if (editingItem) {
        setTitle(editingItem.title || '');
        setUrl(editingItem.url || '');
        setIsEmail(editingItem.isEmail || false);
        setThumbnail(editingItem.imageUrl || null);
      } else {
        resetForm();
      }
    }
  }, [open, editingItem, resetForm]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

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
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnail(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Reset file input if invalid file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, []);

  const handleRemoveThumbnail = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setThumbnail(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleAdd = useCallback(() => {
    if (title.trim() && url.trim() && onAdd) {
      onAdd(sectionId, {
        thumbnail: thumbnail || undefined,
        title: title.trim(),
        url: url.trim(),
        isEmail,
      });
      handleClose();
    }
  }, [sectionId, thumbnail, title, url, isEmail, onAdd, handleClose]);

  const handleDelete = useCallback(() => {
    if (editingItem && onDelete) {
      onDelete(sectionId, editingItem.id);
      handleClose();
    }
  }, [editingItem, sectionId, onDelete, handleClose]);

  const isFormValid = title.trim().length > 0 && url.trim().length > 0 && (!isEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url.trim()));
  const isEditMode = !!editingItem;

  const modalContentContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-xl)',
    overflow: 'visible',
  };

  const thumbnailUploadWrapperStyles = {
    padding: 'var(--spacing-mypage-gap-lg)',
    overflow: 'visible',
    display: 'flex',
    justifyContent: 'center',
  };

  const getThumbnailUploadAreaStyles = (thumbnail: string | null, dragActive: boolean) => ({
    ...styles.thumbnailUploadArea,
    backgroundImage: thumbnail ? `url(${thumbnail})` : 'none',
    border: dragActive ? '1px solid rgba(0, 0, 0, 0.2)' : '1px solid transparent',
    boxShadow: dragActive ? '0 0 0 2px rgba(0, 0, 0, 0.08)' : 'none',
    cursor: 'pointer',
  });

  return (
    <Modal open={open} onClose={handleClose} title={isEditMode ? "Edit Content" : "Add Content"} maxWidth={500}>
      <Box sx={modalContentContainerStyles}>
        {/* Thumbnail Upload */}
        <Box sx={thumbnailUploadWrapperStyles}>
          <Box
            sx={styles.thumbnailUploadContainer}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Box sx={getThumbnailUploadAreaStyles(thumbnail, dragActive)}>
              {!thumbnail && (
                <Typography component="h6" sx={styles.thumbnailLabel}>
                  Add <br />
                  Thumbnail
                </Typography>
              )}
              {thumbnail && (
                <IconButton
                  sx={styles.removeButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleRemoveThumbnail(e);
                  }}
                  size="small"
                >
                  <CloseIcon sx={{ fontSize: 'var(--font-size-mypage-lg)' }} />
                </IconButton>
              )}
            </Box>

            {!thumbnail && (
              <Box
                component="button"
                type="button"
                sx={styles.plusButton}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  fileInputRef.current?.click();
                }}
              >
                +
              </Box>
            )}

            {/* File input overlay - single source of truth for clicks */}
            <Box 
              sx={{
                ...styles.fileInputOverlay,
                zIndex: thumbnail ? 1 : 10, // Higher zIndex when no thumbnail to capture clicks
                pointerEvents: thumbnail ? 'none' : 'auto',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.gif"
                onChange={handleFileSelect}
                onClick={(e) => {
                  // Reset value to allow selecting the same file again
                  (e.target as HTMLInputElement).value = '';
                }}
                style={styles.hiddenFileInput}
              />
            </Box>
          </Box>
        </Box>

        {/* Title Input */}
        <Box>
          <Typography sx={styles.label}>Title</Typography>
          <OutlinedInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            sx={styles.input}
            fullWidth
          />
        </Box>

        {/* URL or Email Input */}
        <Box>
          <Typography sx={styles.label}>{isEmail ? 'Email' : 'URL'}</Typography>
          <OutlinedInput
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={isEmail ? 'example@email.com' : 'https://example.com'}
            type={isEmail ? 'email' : 'url'}
            sx={styles.input}
            fullWidth
          />
        </Box>

        {/* Email Toggle */}
        <Box sx={styles.toggleContainer}>
          <Typography sx={styles.toggleLabel}>Is the link an email?</Typography>
          <Toggle
            checked={isEmail}
            onChange={(checked) => {
              setIsEmail(checked);
              if (checked) {
                // Clear URL when switching to email
                setUrl('');
              }
            }}
            size="md"
          />
        </Box>

        {/* Add/Update/Delete Buttons */}
        <Box sx={{ display: 'flex', gap: 'var(--padding-md)', flexDirection: isEditMode ? 'column' : 'row' }}>
          {isEditMode ? (
            <>
              <Button
                variant="primary-dark"
                onClick={handleAdd}
                disabled={!isFormValid}
                sx={styles.addButton}
                fullWidth
              >
                Update
              </Button>
              <Button
                variant="primary-dark"
                onClick={handleDelete}
                sx={{
                  ...styles.addButton,
                  backgroundColor: 'var(--color-mypage-background-red)',
                  '&:hover': {
                    backgroundColor: 'var(--color-mypage-background-red-dark)',
                  },
                }}
                fullWidth
              >
                Delete
              </Button>
            </>
          ) : (
            <Button
              variant="primary-dark"
              onClick={handleAdd}
              disabled={!isFormValid}
              sx={styles.addButton}
              fullWidth
            >
              Add
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
