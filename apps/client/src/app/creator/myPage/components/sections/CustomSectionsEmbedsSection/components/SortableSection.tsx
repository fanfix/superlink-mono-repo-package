'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box } from '@mui/material';

interface SortableSectionProps {
  id: string;
  children: (props: { dragHandleAttributes: any; dragHandleListeners: any }) => React.ReactNode;
}

export function SortableSection({ id, children }: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box ref={setNodeRef} style={style}>
      {children({ dragHandleAttributes: attributes, dragHandleListeners: listeners })}
    </Box>
  );
}
