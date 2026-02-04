'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Box, OutlinedInput } from '@mui/material';
import { Typography, Button, Modal } from '@superline/design-system';
import { AddEngagementModalProps } from './types';
import { sharedModalStyles } from '../shared/modalStyles';
import { AddBrandKitModalStyles } from '../AddBrandKitModal/styles';

export default function AddEngagementModal({ open, onClose, onAdd, onUpdate, onDelete, editingEngagement }: AddEngagementModalProps) {
  const [title, setTitle] = useState('');
  const [count, setCount] = useState('');

  useEffect(() => {
    if (open) {
      if (editingEngagement) {
        setTitle(editingEngagement.title || '');
        setCount(editingEngagement.count || '');
      } else {
        setTitle('');
        setCount('');
      }
    }
  }, [open, editingEngagement]);

  const resetForm = useCallback(() => {
    setTitle('');
    setCount('');
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleAdd = useCallback(() => {
    const trimmedTitle = title.trim();
    const trimmedCount = count.trim();

    if (trimmedTitle && trimmedCount && onAdd) {
      onAdd({
        title: trimmedTitle,
        count: trimmedCount,
      });
      handleClose();
    }
  }, [title, count, onAdd, handleClose]);

  const handleUpdate = useCallback(() => {
    if (!editingEngagement) return;
    const trimmedTitle = title.trim();
    const trimmedCount = count.trim();

    if (trimmedTitle && trimmedCount && onUpdate) {
      onUpdate(editingEngagement.id, {
        title: trimmedTitle,
        count: trimmedCount,
      });
      handleClose();
    }
  }, [title, count, editingEngagement, onUpdate, handleClose]);

  const handleDelete = useCallback(() => {
    if (!editingEngagement || !onDelete) return;
    onDelete(editingEngagement.id);
    handleClose();
  }, [editingEngagement, onDelete, handleClose]);

  const isFormValid = title.trim().length > 0 && count.trim().length > 0;
  const isEditMode = !!editingEngagement;

  return (
    <Modal 
      open={open} 
      onClose={handleClose} 
      title={isEditMode ? "Update Engagement" : "Add Engagement"} 
      maxWidth={480}
    >
      <Box sx={sharedModalStyles.modalContentContainerGap24}>
        <Box>
          <Typography sx={sharedModalStyles.label}>Title</Typography>
          <OutlinedInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Title'
            sx={sharedModalStyles.input}
            fullWidth
          />
          <Typography sx={sharedModalStyles.helperText}>
            e.g., "YouTube subscribers", "Instagram followers"
          </Typography>
        </Box>

        <Box>
          <Typography sx={sharedModalStyles.label}>Count</Typography>
          <OutlinedInput
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder='Count'
            sx={sharedModalStyles.input}
            fullWidth
          />
          <Typography sx={sharedModalStyles.helperText}>
            e.g., "22k", "500k"
          </Typography>
        </Box>

        <Box sx={sharedModalStyles.actionsContainer(isEditMode)}>
          {isEditMode ? (
            <>
              <Button
                variant="primary-dark"
                onClick={handleUpdate}
                disabled={!isFormValid}
                sx={sharedModalStyles.primaryButton}
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

