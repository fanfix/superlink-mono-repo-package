'use client';

import React, { useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import { FormatColorFill } from '@mui/icons-material';
import { styles } from './styles';

interface BackgroundColorSectionProps {
  selectedColor?: string;
  onColorChange?: (color: string) => void;
}

const COLOR_OPTIONS = [
  '#FFFFFF', '#000000', '#E3F2FD', '#1976D2',
  '#9C27B0', '#E91E63', '#FF9800', '#FFEB3B',
  '#C8E6C9', '#4CAF50', '#00BCD4', '#9E9E9E',
] as const;

export default function BackgroundColorSection({
  selectedColor = '#FFFFFF',
  onColorChange,
}: BackgroundColorSectionProps) {
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const handleColorPickerClick = () => {
    colorPickerRef.current?.click();
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange?.(e.target.value);
  };

  return (
    <Box sx={styles.colorsContainer}>
      {COLOR_OPTIONS.map((color) => (
        <Box
          key={color}
          sx={styles.colorSwatch(color, selectedColor === color)}
          onClick={() => onColorChange?.(color)}
        />
      ))}
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <input
          ref={colorPickerRef}
          type="color"
          value={selectedColor}
          onChange={handleColorPickerChange}
          style={styles.colorPickerInput}
        />
        <IconButton onClick={handleColorPickerClick} sx={styles.colorPickerButton} size="small">
          <FormatColorFill sx={{ fontSize: '16px', color: 'var(--color-gray-700)' }} />
        </IconButton>
      </Box>
    </Box>
  );
}

