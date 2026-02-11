import React from 'react';
import { ListLayoutIcon, RowLayoutIcon, ParallelRowLayoutIcon } from '../../../../constants/layoutIcons';

const sizeMap = { default: 80, modal: 64 };

export interface IconProps {
  size?: number;
}

export const ListIcon: React.FC<IconProps> = ({ size = sizeMap.modal }) => (
  <ListLayoutIcon size={size} />
);

export const RowIcon: React.FC<IconProps> = ({ size = sizeMap.modal }) => (
  <RowLayoutIcon size={size} />
);

export const ParallelRowIcon: React.FC<IconProps> = ({ size = sizeMap.modal }) => (
  <ParallelRowLayoutIcon size={size} />
);
