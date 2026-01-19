'use client';

import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Typography } from '@superline/design-system';
import { Edit as EditIcon, Delete as DeleteIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ContentItem } from '../../../MobilePreview/types';

interface SortableContentItemProps {
  item: ContentItem;
  sectionId: string;
  onEdit?: (sectionId: string, item: ContentItem) => void;
  onDelete?: (sectionId: string, itemId: string) => void;
  isSortable?: boolean;
  styles: {
    card: any;
    thumbnail: any;
    thumbnailPlaceholder: any;
    content: any;
    title: any;
    url: any;
    dragHandle: any;
  };
}

export function SortableContentItem({
  item,
  sectionId,
  onEdit,
  onDelete,
  isSortable = true,
  styles: itemStyles,
}: SortableContentItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: !isSortable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const actionsContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-xs)',
    flexShrink: 0,
  };

  const actionButtonStyles = {
    color: 'var(--color-gray-500)',
    padding: '4px',
  };

  return (
    <Box ref={setNodeRef} style={style} sx={itemStyles.card}>
      {/* Thumbnail */}
      {item.imageUrl ? (
        <Box component="img" src={item.imageUrl} alt={item.title} sx={itemStyles.thumbnail} />
      ) : (
        <Box sx={itemStyles.thumbnailPlaceholder} />
      )}

      {/* Title and URL */}
      <Box sx={itemStyles.content}>
        <Typography sx={itemStyles.title}>{item.title}</Typography>
        <Typography sx={itemStyles.url}>{item.url || 'No URL'}</Typography>
      </Box>

      {/* Actions */}
      <Box sx={actionsContainerStyles}>
        <IconButton
          size="small"
          onClick={() => onEdit?.(sectionId, item)}
          sx={actionButtonStyles}
        >
          <EditIcon sx={{ fontSize: '18px' }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete?.(sectionId, item.id)}
          sx={actionButtonStyles}
        >
          <DeleteIcon sx={{ fontSize: '18px' }} />
        </IconButton>
        <Box {...attributes} {...listeners} sx={itemStyles.dragHandle}>
          <MoreVertIcon sx={{ fontSize: '20px', color: 'var(--color-gray-500)' }} />
        </Box>
      </Box>
    </Box>
  );
}
