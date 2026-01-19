'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Box, OutlinedInput } from '@mui/material';
import { Typography, Button, Modal, Toggle } from '@superline/design-system';
import { AddCustomButtonModalProps } from './types';
import { sharedModalStyles } from '../shared/modalStyles';

export default function AddCustomButtonModal({ open, onClose, onAdd, onUpdate, onDelete, editingButton }: AddCustomButtonModalProps) {
  const [buttonText, setButtonText] = useState('');
  const [isEmail, setIsEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');


  const resetForm = useCallback(() => {
    setButtonText('');
    setIsEmail(false);
    setEmail('');
    setUrl('');
  }, []);

  // Load editing button data when modal opens or editingButton changes
  useEffect(() => {
    if (editingButton) {
      setButtonText(editingButton.buttonText);
      setIsEmail(editingButton.type === 'email');
      if (editingButton.type === 'email') {
        setEmail(editingButton.value);
        setUrl('');
      } else {
        setUrl(editingButton.value);
        setEmail('');
      }
    } else if (open) {
      // Only reset if modal is opening fresh (not editing)
      resetForm();
    }
  }, [editingButton, open, resetForm]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleAdd = useCallback(() => {
    const trimmedButtonText = buttonText.trim();
    const trimmedValue = isEmail ? email.trim() : url.trim();

    if (trimmedButtonText && trimmedValue) {
      if (editingButton && onUpdate) {
        onUpdate(editingButton.id, {
          buttonText: trimmedButtonText,
          type: isEmail ? 'email' : 'url',
          value: trimmedValue,
        });
      } else {
        onAdd({
          buttonText: trimmedButtonText,
          type: isEmail ? 'email' : 'url',
          value: trimmedValue,
        });
      }
      handleClose();
    }
  }, [buttonText, email, url, isEmail, onAdd, onUpdate, editingButton, handleClose]);

  const handleDelete = useCallback(() => {
    if (editingButton && onDelete) {
      onDelete(editingButton.id);
      handleClose();
    }
  }, [editingButton, onDelete, handleClose]);

  const isFormValid = buttonText.trim().length > 0 && (isEmail ? email.trim().length > 0 : url.trim().length > 0);
  const isEditMode = !!editingButton;

  return (
    <Modal open={open} onClose={handleClose} title={isEditMode ? "Edit Custom Button" : "Add Custom Button"} maxWidth={500}>
      <Box sx={sharedModalStyles.modalContentContainer}>
        <Box>
          <Typography sx={sharedModalStyles.label}>Button title</Typography>
          <OutlinedInput
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            placeholder="Button title"
            sx={sharedModalStyles.input}
            fullWidth
          />
        </Box>

        <Box>
          <OutlinedInput
            type={isEmail ? 'email' : 'url'}
            value={isEmail ? email : url}
            onChange={(e) => (isEmail ? setEmail(e.target.value) : setUrl(e.target.value))}
            placeholder={isEmail ? 'example@email.com' : 'https://example.com'}
            sx={sharedModalStyles.input}
            fullWidth
          />
        </Box>

        <Box sx={sharedModalStyles.toggleContainer}>
          <Typography sx={sharedModalStyles.toggleLabel}>
            Is the link an email?
          </Typography>
          <Toggle checked={isEmail} onChange={(checked) => setIsEmail(checked)} size="md" />
        </Box>

        {isEditMode ? (
          <Box sx={sharedModalStyles.actionsContainer(true)}>
            <Button
              variant="primary-dark"
              onClick={handleAdd}
              disabled={!isFormValid}
              sx={sharedModalStyles.darkButton}
              fullWidth
            >
              Update
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              sx={sharedModalStyles.deleteButtonOutline}
              fullWidth
            >
              Delete
            </Button>
          </Box>
        ) : (
          <Button
            variant="primary-dark"
            onClick={handleAdd}
            disabled={!isFormValid}
            sx={sharedModalStyles.darkButton}
            fullWidth
          >
            Add
          </Button>
        )}
      </Box>
    </Modal>
  );
}

