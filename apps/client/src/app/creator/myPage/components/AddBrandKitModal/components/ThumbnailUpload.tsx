import React from 'react';
import { Box, Typography } from '@mui/material';
import { AddBrandKitModalStyles } from '../styles';

interface ThumbnailUploadProps {
  previewUrl: string | null;
  dragActive: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ThumbnailUpload: React.FC<ThumbnailUploadProps> = ({
  previewUrl,
  dragActive,
  fileInputRef,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileInput,
}) => {
  return (
    <Box
      sx={AddBrandKitModalStyles.thumbnailUploadContainer}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Box
        sx={{
          ...AddBrandKitModalStyles.thumbnailUploadArea,
          backgroundImage: previewUrl ? `url(${previewUrl})` : 'none',
          border: dragActive ? '1px solid rgba(0, 0, 0, 0.2)' : '1px solid transparent',
          boxShadow: dragActive ? '0 0 0 2px rgba(0, 0, 0, 0.08)' : 'none',
        }}
      >
        {!previewUrl && (
          <Typography component="h6" sx={AddBrandKitModalStyles.thumbnailLabel}>
            Add <br />
            Thumbnail
          </Typography>
        )}
      </Box>

      <Box
        component="button"
        type="button"
        sx={AddBrandKitModalStyles.plusButton}
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
      >
        +
      </Box>

      <Box 
        sx={AddBrandKitModalStyles.fileInputOverlay}
        onClick={(e) => {
          e.stopPropagation();
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.gif"
          onChange={onFileInput}
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            cursor: 'pointer',
            opacity: 0,
            zIndex: 10,
            pointerEvents: 'auto',
          }}
        />
      </Box>
    </Box>
  );
};

