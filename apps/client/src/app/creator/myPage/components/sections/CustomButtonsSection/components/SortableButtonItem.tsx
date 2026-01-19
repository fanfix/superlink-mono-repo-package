'use client';

import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Typography } from '@superline/design-system';
import { DragIndicator as DragIndicatorIcon, Star as StarIcon, StarBorder as StarBorderIcon } from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CustomButton } from '../types';
import { styles } from '../styles';

interface SortableButtonItemProps {
  button: CustomButton;
  onToggleActive?: (id: string) => void;
  onEdit?: (button: { id: string; buttonText: string; type: 'email' | 'url'; value: string }) => void;
  isSortable?: boolean;
}

export function SortableButtonItem({ button, onToggleActive, onEdit, isSortable = true }: SortableButtonItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: button.id,
    disabled: !isSortable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'pointer',
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleActive?.(button.id);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.({
      id: button.id,
      buttonText: button.buttonText,
      type: button.type,
      value: button.value,
    });
  };

  return (
    <Box 
      ref={setNodeRef} 
      style={style} 
      sx={styles.buttonItem(isDragging)}
      onClick={handleButtonClick}
    >
      <Box sx={styles.buttonContent}>
        <Typography sx={styles.buttonTitle}>{button.buttonText}</Typography>
        <Typography sx={styles.buttonValue}>
          {button.type === 'email' ? button.value : button.value}
        </Typography>
      </Box>
      <Box sx={styles.buttonActions}>
        <IconButton
          onClick={handleStarClick}
          sx={styles.starButton}
          size="small"
          aria-label={button.isActive ? 'Deactivate button' : 'Activate button'}
        >
          {button.isActive ? (
            <StarIcon sx={{ color: '#FFD700', fontSize: '20px' }} />
          ) : (
            <StarBorderIcon sx={{ color: 'var(--color-gray-400)', fontSize: '20px' }} />
          )}
        </IconButton>
        <Box {...attributes} {...listeners} sx={styles.dragHandle}>
          <DragIndicatorIcon sx={{ fontSize: '20px', color: 'var(--color-gray-400)' }} />
        </Box>
      </Box>
    </Box>
  );
}
