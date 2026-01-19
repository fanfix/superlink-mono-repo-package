'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BrandKitSection from './index';
import type { BrandKitSectionProps } from './types';

export function SortableBrandKitSection(props: BrandKitSectionProps) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: 'brand-kit',
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <BrandKitSection {...props} />
    </div>
  );
}
