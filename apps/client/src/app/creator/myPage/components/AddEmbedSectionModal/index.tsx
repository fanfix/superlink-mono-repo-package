'use client';

import React, { useState, useCallback } from 'react';
import { Box, OutlinedInput } from '@mui/material';
import { Typography, Button, Modal } from '@superline/design-system';
import { AddEmbedSectionModalProps, EmbedLayout } from './types';
import { embedModalStyles } from './styles';
import { ListIcon, RowIcon } from './components/LayoutIcons';

export default function AddEmbedSectionModal({ open, onClose, onAdd }: AddEmbedSectionModalProps) {
  const [selectedLayout, setSelectedLayout] = useState<EmbedLayout>('list');
  const [sectionName, setSectionName] = useState('');

  const resetForm = useCallback(() => {
    setSelectedLayout('list');
    setSectionName('');
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleAdd = useCallback(() => {
    const trimmedName = sectionName.trim();
    if (trimmedName) {
      onAdd(trimmedName, selectedLayout);
      handleClose();
    }
  }, [sectionName, selectedLayout, onAdd, handleClose]);

  const isFormValid = sectionName.trim().length > 0;

  return (
    <Modal open={open} onClose={handleClose} title="Add Custom Embed" maxWidth={500}>
      <Box sx={embedModalStyles.modalContentContainer}>
        <Box>
          <Box sx={embedModalStyles.layoutOptionsContainer}>
            <Box
              onClick={() => setSelectedLayout('list')}
              sx={embedModalStyles.layoutOptionCard(selectedLayout === 'list')}
            >
              <Box sx={embedModalStyles.layoutIconContainer}>
                <ListIcon size={64} />
              </Box>
              <Typography sx={embedModalStyles.layoutLabel}>List</Typography>
            </Box>

            <Box
              onClick={() => setSelectedLayout('row')}
              sx={embedModalStyles.layoutOptionCard(selectedLayout === 'row')}
            >
              <Box sx={embedModalStyles.layoutIconContainer}>
                <RowIcon size={64} />
              </Box>
              <Typography sx={embedModalStyles.layoutLabel}>Row</Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography sx={embedModalStyles.label}>Section Name</Typography>
          <OutlinedInput
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            placeholder="Section Name"
            sx={embedModalStyles.input}
            fullWidth
          />
        </Box>

        <Button
          variant="primary-dark"
          onClick={handleAdd}
          disabled={!isFormValid}
          sx={embedModalStyles.darkButton}
        >
          Add
        </Button>
      </Box>
    </Modal>
  );
}

