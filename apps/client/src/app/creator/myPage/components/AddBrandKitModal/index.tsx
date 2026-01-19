'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { Typography, Button, Modal } from '@superline/design-system';
import { AddBrandKitModalProps } from './types';
import { AddBrandKitModalStyles } from './styles';
import { sharedModalStyles } from '../shared/modalStyles';
import { ThumbnailUpload } from './components/ThumbnailUpload';

export default function AddBrandKitModal({ open, onClose, onAdd, onDelete, editingItem }: AddBrandKitModalProps) {
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

  useEffect(() => {
    if (open) {
      if (editingItem) {
        setDescription(editingItem.description || '');
        setPreviewUrl(editingItem.thumbnailUrl || null);
        setSelectedFile(null);
      } else {
        setDescription('');
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    }
  }, [open, editingItem]);

  useEffect(() => {
    if (open) {
      const resetInput = () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      // Try multiple times to ensure it works
      requestAnimationFrame(() => {
        resetInput();
        setTimeout(resetInput, 10);
      });
    }
  }, [open]);

  useEffect(() => {
    // Only create object URL if selectedFile is a new file (not editing)
    if (!selectedFile) {
      // Keep existing previewUrl if editing
      if (!editingItem) {
        setPreviewUrl(null);
      }
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile, editingItem]);

  const resetForm = useCallback(() => {
    setDescription('');
    setSelectedFile(null);
    setPreviewUrl(null);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleAdd = useCallback(() => {
    onAdd(selectedFile, description.trim());
    handleClose();
  }, [selectedFile, description, onAdd, handleClose]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete();
    }
    handleClose();
  }, [onDelete, handleClose]);

  const isEditMode = !!editingItem;
  const isFormValid = description.trim().length > 0;

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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 0);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file immediately before any async operations
      setSelectedFile(file);
    }
    // Reset input value after a small delay to allow selecting the same file again
    // This must happen after the onChange event fully processes
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 100);
  }, []);

  return (
    <Modal 
      open={open} 
      onClose={handleClose} 
      title={isEditMode ? "Update Brand Kit" : "Add Brand Kit"} 
      maxWidth={520}
    >
      <Box sx={AddBrandKitModalStyles.modalContentContainer}>
        <Box sx={AddBrandKitModalStyles.thumbnailWrapper}>
          <ThumbnailUpload
            previewUrl={previewUrl}
            dragActive={dragActive}
            fileInputRef={fileInputRef}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onFileInput={handleFileInput}
          />
        </Box>

        <Box>
          <Typography sx={AddBrandKitModalStyles.label}>Description</Typography>
          <Box
            component="textarea"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Description"
            sx={AddBrandKitModalStyles.descriptionInput}
            rows={4}
          />
        </Box>

        <Box sx={sharedModalStyles.actionsContainer(isEditMode)}>
          {isEditMode ? (
            <>
              <Button 
                variant="primary-dark" 
                onClick={handleAdd} 
                disabled={!isFormValid}
                sx={AddBrandKitModalStyles.addButton}
                fullWidth
              >
                Update
              </Button>
              <Button
                variant="primary-dark"
                onClick={handleDelete}
                sx={sharedModalStyles.deleteButton}
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
              sx={AddBrandKitModalStyles.addButton}
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

