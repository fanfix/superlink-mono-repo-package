import React from 'react';
import { ListLayoutIcon, RowLayoutIcon } from '../../../constants/layoutIcons';

export interface IconProps {
  size?: number;
}

export const ListIcon: React.FC<IconProps> = ({ size = 64 }) => (
  <ListLayoutIcon size={size} />
);

export const RowIcon: React.FC<IconProps> = ({ size = 64 }) => (
  <RowLayoutIcon size={size} />
);
