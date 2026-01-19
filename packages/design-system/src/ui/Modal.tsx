import React from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

export interface ModalProps extends Omit<DialogProps, 'open' | 'onClose' | 'maxWidth'> {
  /**
   * Controls whether the modal is displayed.
   */
  open: boolean;
  /**
   * Callback fired when the modal requests to be closed.
   */
  onClose: () => void;
  /**
   * Title text displayed at the top of the modal.
   */
  title?: string;
  /**
   * Optional supporting text displayed below the title.
   */
  subtitle?: string;
  /**
   * Optional footer content, typically buttons.
   */
  actions?: React.ReactNode;
  /**
   * Maximum width of the modal surface.
   * @default 520
   */
  maxWidth?: number | string;
  /**
   * Shows or hides the close button in the header.
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Allows style overrides on the Paper element.
   */
  sx?: SxProps<Theme>;
  /**
   * Allows style overrides for the content section.
   */
  contentSx?: SxProps<Theme>;
  /**
   * Allows style overrides for the header.
   */
  headerSx?: SxProps<Theme>;
  /**
   * Allows style overrides for the footer/actions wrapper.
   */
  actionsSx?: SxProps<Theme>;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = 520,
  showCloseButton = true,
  sx,
  contentSx,
  headerSx,
  actionsSx,
  ...dialogProps
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      {...dialogProps}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 3,
          width: '100%',
          maxWidth,
          boxShadow: '0px 15px 40px rgba(17, 17, 17, 0.15)',
          backgroundColor: '#fff',
          ...sx,
        },
      }}
    >
      {(title || showCloseButton) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: subtitle ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: 2,
            mb: subtitle ? 1.5 : 0.5,
            ...headerSx,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {title && (
              <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 700, color: '#111' }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography sx={{ fontSize: 14, color: '#6f6f6f' }}>{subtitle}</Typography>
            )}
          </Box>
          {showCloseButton && (
            <IconButton
              onClick={onClose}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}

      <DialogContent
        sx={{
          px: 0,
          pt: subtitle || title ? 0 : 1,
          pb: actions ? 1 : 0,
          ...contentSx,
        }}
      >
        {children}
      </DialogContent>

      {actions && (
        <DialogActions
          sx={{
            px: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            ...actionsSx,
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

