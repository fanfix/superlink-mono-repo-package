'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Box, OutlinedInput } from '@mui/material';
import { Typography, Button, Modal, Toggle } from '@superline/design-system';
import { AddCustomSectionModalProps, CustomSectionLayout } from './types';
import { customSectionModalStyles } from './styles';
import { ListIcon, RowIcon, ParallelRowIcon } from './components/LayoutIcons';

export default function AddCustomSectionModal({ open, onClose, onAdd, onUpdate, onDelete, editingSection }: AddCustomSectionModalProps) {
  const [selectedLayout, setSelectedLayout] = useState<CustomSectionLayout>('list');
  const [sectionName, setSectionName] = useState('');
  const [useContentImageAsBackground, setUseContentImageAsBackground] = useState(false);

  // Update form when editingSection changes
  useEffect(() => {
    if (editingSection) {
      setSectionName(editingSection.name);
      setSelectedLayout(editingSection.layout);
      setUseContentImageAsBackground(editingSection.useContentImageAsBackground);
    } else {
      setSelectedLayout('list');
      setSectionName('');
      setUseContentImageAsBackground(false);
    }
  }, [editingSection]);

  const resetForm = useCallback(() => {
    setSelectedLayout('list');
    setSectionName('');
    setUseContentImageAsBackground(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleAdd = useCallback(() => {
    const trimmedName = sectionName.trim();
    if (trimmedName && onAdd) {
      onAdd(trimmedName, selectedLayout, useContentImageAsBackground);
      handleClose();
    }
  }, [sectionName, selectedLayout, useContentImageAsBackground, onAdd, handleClose]);

  const handleUpdate = useCallback(() => {
    const trimmedName = sectionName.trim();
    if (trimmedName && editingSection && onUpdate) {
      onUpdate(editingSection.id, trimmedName, selectedLayout, useContentImageAsBackground);
      handleClose();
    }
  }, [sectionName, selectedLayout, useContentImageAsBackground, editingSection, onUpdate, handleClose]);

  const handleDelete = useCallback(() => {
    if (editingSection && onDelete) {
      onDelete(editingSection.id);
      handleClose();
    }
  }, [editingSection, onDelete, handleClose]);

  const isFormValid = sectionName.trim().length > 0;
  const isEditMode = !!editingSection;

  return (
    <Modal open={open} onClose={handleClose} title={isEditMode ? "Update Custom Section" : "Add Custom Section"} maxWidth={500}>
      <Box sx={customSectionModalStyles.modalContentContainer}>
        <Box>
          <Box sx={customSectionModalStyles.layoutOptionsContainer}>
            <Box
              onClick={() => setSelectedLayout('list')}
              sx={customSectionModalStyles.layoutOptionCard(selectedLayout === 'list')}
            >
              <Box sx={customSectionModalStyles.layoutIconContainer}>
                <ListIcon size={64} />
              </Box>
              <Typography sx={customSectionModalStyles.layoutLabel}>List</Typography>
            </Box>

            <Box
              onClick={() => setSelectedLayout('row')}
              sx={customSectionModalStyles.layoutOptionCard(selectedLayout === 'row')}
            >
              <Box sx={customSectionModalStyles.layoutIconContainer}>
                <RowIcon size={64} />
              </Box>
              <Typography sx={customSectionModalStyles.layoutLabel}>Row</Typography>
            </Box>

            <Box
              onClick={() => setSelectedLayout('parallel-row')}
              sx={customSectionModalStyles.layoutOptionCard(selectedLayout === 'parallel-row')}
            >
              <Box sx={customSectionModalStyles.layoutIconContainer}>
                <ParallelRowIcon size={64} />
              </Box>
              <Typography sx={customSectionModalStyles.layoutLabel}>Parallel Row</Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography sx={customSectionModalStyles.label}>Section Name</Typography>
          <OutlinedInput
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            placeholder="Section Name"
            sx={customSectionModalStyles.input}
            fullWidth
          />
        </Box>

        <Box sx={customSectionModalStyles.toggleContainer}>
          <Typography sx={customSectionModalStyles.toggleLabel}>
            Use content image as background image
          </Typography>
          <Toggle
            checked={useContentImageAsBackground}
            onChange={(checked) => setUseContentImageAsBackground(checked)}
            size="md"
          />
        </Box>

        <Box sx={customSectionModalStyles.actionsContainer(isEditMode)}>
          {isEditMode ? (
            <>
              <Button
                variant="primary-dark"
                onClick={handleUpdate}
                disabled={!isFormValid}
                sx={customSectionModalStyles.darkButton}
              >
                Update
              </Button>
              <Button
                variant="primary-dark"
                onClick={handleDelete}
                sx={customSectionModalStyles.deleteButton}
              >
                Delete
              </Button>
            </>
          ) : (
            <Button
              variant="primary-dark"
              onClick={handleAdd}
              disabled={!isFormValid}
              sx={customSectionModalStyles.darkButton}
            >
              Add
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
}

