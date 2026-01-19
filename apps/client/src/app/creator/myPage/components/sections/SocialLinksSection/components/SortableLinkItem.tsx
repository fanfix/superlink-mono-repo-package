import React from 'react';
import { Box } from '@mui/material';
import { Typography } from '@superline/design-system';
import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SocialLink } from '../types';
import { styles } from '../styles';
import { getSocialIcon } from '../utils/getSocialIcon';

interface SortableLinkItemProps {
  link: SocialLink;
  onRemoveLink?: (id: string) => void;
  onEditLink?: (link: SocialLink) => void;
  isSortable?: boolean;
}

export function SortableLinkItem({ link, onRemoveLink, onEditLink, isSortable = true }: SortableLinkItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id,
    disabled: !isSortable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const socialIcon = link.icon || getSocialIcon(link.platform, 20, '#FFFFFF');

  const handleClick = (e: React.MouseEvent) => {
    // Don't open modal if dragging
    if (!isDragging && onEditLink) {
      onEditLink(link);
    }
  };

  return (
    <Box 
      ref={setNodeRef} 
      style={style} 
      sx={{ ...styles.linkItem(isDragging), cursor: onEditLink ? 'pointer' : 'default' }}
      onClick={handleClick}
    >
      <Box sx={styles.linkIcon(link.platform)}>
        {socialIcon}
      </Box>
      <Box sx={styles.linkInfo}>
        <Typography sx={styles.linkPlatform}>{link.platform}</Typography>
        <Typography sx={styles.linkUrl}>{link.url}</Typography>
      </Box>
      <Box {...attributes} {...listeners} sx={styles.dragHandle} onClick={(e) => e.stopPropagation()}>
        <DragIndicatorIcon sx={{ fontSize: '20px' }} />
      </Box>
    </Box>
  );
}

