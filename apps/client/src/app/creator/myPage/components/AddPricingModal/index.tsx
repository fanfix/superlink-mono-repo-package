'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Box, OutlinedInput } from '@mui/material';
import { Typography, Button, Modal } from '@superline/design-system';
import { AddPricingModalProps } from './types';
import { sharedModalStyles } from '../shared/modalStyles';
import { AddBrandKitModalStyles } from '../AddBrandKitModal/styles';

export default function AddPricingModal({ open, onClose, onAdd, onUpdate, onDelete, editingPricing }: AddPricingModalProps) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (open) {
      if (editingPricing) {
        setTitle(editingPricing.title || '');
        setPrice(editingPricing.price || '');
      } else {
        setTitle('');
        setPrice('');
      }
    }
  }, [open, editingPricing]);

  const resetForm = useCallback(() => {
    setTitle('');
    setPrice('');
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleAdd = useCallback(() => {
    const trimmedTitle = title.trim();
    const trimmedPrice = price.trim();

    if (trimmedTitle && trimmedPrice && onAdd) {
      onAdd({
        title: trimmedTitle,
        price: trimmedPrice,
      });
      handleClose();
    }
  }, [title, price, onAdd, handleClose]);

  const handleUpdate = useCallback(() => {
    if (!editingPricing) return;
    const trimmedTitle = title.trim();
    const trimmedPrice = price.trim();

    if (trimmedTitle && trimmedPrice && onUpdate) {
      onUpdate(editingPricing.id, {
        title: trimmedTitle,
        price: trimmedPrice,
      });
      handleClose();
    }
  }, [title, price, editingPricing, onUpdate, handleClose]);

  const handleDelete = useCallback(() => {
    if (!editingPricing || !onDelete) return;
    onDelete(editingPricing.id);
    handleClose();
  }, [editingPricing, onDelete, handleClose]);

  const isFormValid = title.trim().length > 0 && price.trim().length > 0;
  const isEditMode = !!editingPricing;

  return (
    <Modal 
      open={open} 
      onClose={handleClose} 
      title={isEditMode ? "Update Pricing" : "Add Pricing"} 
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
            e.g., "Dedicated Youtube Video", "Dedicated TikTok Video"
          </Typography>
        </Box>

        <Box>
          <Typography sx={sharedModalStyles.label}>Price</Typography>
          <OutlinedInput
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder='Price'
            sx={sharedModalStyles.input}
            fullWidth
          />
          <Typography sx={sharedModalStyles.helperText}>
            e.g., "$20", "$500"
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

