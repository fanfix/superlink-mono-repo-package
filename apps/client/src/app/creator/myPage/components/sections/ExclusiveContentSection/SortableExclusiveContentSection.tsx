'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ExclusiveContentSection from './index';
import type { UploadContentData } from '../../UploadContentModal/types';

interface SortableExclusiveContentSectionProps {
  coverImage?: string;
  onAddContent?: (data: UploadContentData) => void;
}

export function SortableExclusiveContentSection({
  coverImage,
  onAddContent,
}: SortableExclusiveContentSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: 'exclusive-content',
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ExclusiveContentSection
        coverImage={coverImage}
        onAddContent={onAddContent}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
