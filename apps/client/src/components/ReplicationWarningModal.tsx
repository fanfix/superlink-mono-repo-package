'use client';

import React from 'react';
import { Dialog, DialogContent, IconButton, Box } from '@mui/material';
import { Typography, Button } from '@superline/design-system';
import CloseIcon from '@mui/icons-material/Close';

interface ReplicationWarningModalProps {
  open: boolean;
  onClose: () => void;
}

export function ReplicationWarningModal({ open, onClose }: ReplicationWarningModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 'var(--border-radius-lg)',
          padding: 0,
          maxWidth: '90vw',
          width: 400,
          boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
        },
      }}
      slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.4)' } } }}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: 'var(--color-black)',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            pt: 5,
            px: 3,
            pb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: 'var(--font-size-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-black)',
              lineHeight: 1.5,
              mb: 3,
              maxWidth: 320,
            }}
          >
            The profile replication feature is only available for new users. Since you are
            currently logged in, this action could overwrite existing profiles. If you need
            assistance, please contact support.
          </Typography>
          <Button
            variant="primary-dark"
            onClick={onClose}
            sx={{
              height: 48,
              minWidth: 200,
              borderRadius: 'var(--border-radius-md)',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Okay
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
