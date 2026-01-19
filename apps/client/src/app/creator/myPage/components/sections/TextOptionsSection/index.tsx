'use client';

import React, { useRef } from 'react';
import { Box, Select, MenuItem, FormControl } from '@mui/material';
import { Typography } from '@superline/design-system';
import { FormatColorFill as FormatColorFillIcon, KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import fontsData from '../../../fonts.json';
import { styles } from './styles';

interface TextOptionsSectionProps {
  selectedFont?: string;
  selectedColor?: string;
  onFontChange?: (font: string) => void;
  onColorChange?: (color: string) => void;
}

export default function TextOptionsSection({
  selectedFont = 'Inter',
  selectedColor = '#000000',
  onFontChange,
  onColorChange,
}: TextOptionsSectionProps) {
  const fonts = fontsData.fonts;
  const colorPickerInputRef = useRef<HTMLInputElement>(null);
  const colorSwatchInputRef = useRef<HTMLInputElement>(null);

  const handleColorPickerClick = () => {
    colorPickerInputRef.current?.click();
  };

  const handleColorSwatchClick = () => {
    colorSwatchInputRef.current?.click();
  };

  return (
    <Box>
      <Typography sx={styles.subtitle}>Font and color</Typography>
      <Box sx={styles.optionsContainer}>
        <FormControl sx={styles.formControl}>
          <Select
            value={selectedFont}
            onChange={(e) => onFontChange?.(e.target.value)}
            sx={styles.select}
            IconComponent={KeyboardArrowDownIcon}
            displayEmpty={false}
            MenuProps={{
              PaperProps: {
                sx: styles.menuPaper,
              },
            }}
          >
            {fonts.map((font) => (
              <MenuItem key={font.value} value={font.value}>
                {font.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={styles.colorButtonsContainer}>
          <Box onClick={handleColorPickerClick} sx={styles.colorPickerButton}>
            <FormatColorFillIcon sx={styles.colorPickerIcon} />
            <input
              ref={colorPickerInputRef}
              type="color"
              value={selectedColor}
              onChange={(e) => onColorChange?.(e.target.value)}
              style={styles.hiddenColorInput}
            />
          </Box>
          <Box onClick={handleColorSwatchClick} sx={styles.colorSwatch(selectedColor)}>
            <input
              ref={colorSwatchInputRef}
              type="color"
              value={selectedColor}
              onChange={(e) => onColorChange?.(e.target.value)}
              style={styles.hiddenColorInput}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

