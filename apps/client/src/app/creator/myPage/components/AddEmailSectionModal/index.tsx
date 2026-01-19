'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Box, OutlinedInput } from '@mui/material';
import { Typography, Button, Modal } from '@superline/design-system';
import { AddEmailSectionModalProps } from './types';
import { sharedModalStyles } from '../shared/modalStyles';

export default function AddEmailSectionModal({ open, onClose, onAdd, onUpdate, onDelete, editingSection }: AddEmailSectionModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (open) {
      if (editingSection) {
        setTitle(editingSection.title || '');
        setContent(editingSection.content || '');
      } else {
        setTitle('');
        setContent('');
      }
    }
  }, [open, editingSection]);

  const resetForm = useCallback(() => {
    setTitle('');
    setContent('');
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleAdd = useCallback(() => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (trimmedTitle && trimmedContent) {
      onAdd({
        title: trimmedTitle,
        content: trimmedContent,
      });
      handleClose();
    }
  }, [title, content, onAdd, handleClose]);

  const handleUpdate = useCallback(() => {
    if (!editingSection) return;
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (trimmedTitle && trimmedContent && onUpdate) {
      onUpdate(editingSection.id, {
        title: trimmedTitle,
        content: trimmedContent,
      });
      handleClose();
    }
  }, [title, content, editingSection, onUpdate, handleClose]);

  const handleDelete = useCallback(() => {
    if (!editingSection || !onDelete) return;
    onDelete(editingSection.id);
    handleClose();
  }, [editingSection, onDelete, handleClose]);

  const isFormValid = title.trim().length > 0 && content.trim().length > 0;
  const isEditMode = !!editingSection;

  return (
    <Modal 
      open={open} 
      onClose={handleClose} 
      title={isEditMode ? "Update Email Section" : "Add Email Section"} 
      maxWidth={480}
    >
      <Box sx={sharedModalStyles.modalContentContainerGap24}>
        <Box>
          <Typography sx={sharedModalStyles.label}>Title</Typography>
          <OutlinedInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            sx={sharedModalStyles.input}
            fullWidth
          />
        </Box>

        <Box>
          <Typography sx={sharedModalStyles.label}>Content</Typography>
          <OutlinedInput
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            sx={sharedModalStyles.input}
            fullWidth
          />
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
              sx={sharedModalStyles.primaryButton}
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

