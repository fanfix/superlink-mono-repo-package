'use client';

import React from 'react';
import { Box } from '@mui/material';
import { styles } from './styles';

export type PageLayout = 'layout1' | 'layout2';

interface PageLayoutSectionProps {
  selectedLayout?: PageLayout;
  onLayoutChange?: (layout: PageLayout) => void;
}

/**
 * PageLayoutSection Component
 * Allows user to select between two layout options:
 * - Layout 1: Profile image centered with name below
 * - Layout 2: Profile image left with name on right
 */
export default function PageLayoutSection({
  selectedLayout = 'layout1',
  onLayoutChange,
}: PageLayoutSectionProps) {
  const handleLayout1Click = () => {
    onLayoutChange?.('layout1');
  };

  const handleLayout2Click = () => {
    onLayoutChange?.('layout2');
  };

  const isLayout1Selected = selectedLayout === 'layout1';
  const isLayout2Selected = selectedLayout === 'layout2';

  return (
    <Box sx={styles.layoutsContainer}>
      <Box 
        onClick={handleLayout1Click}
        sx={styles.selectionBox(isLayout1Selected)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleLayout1Click();
          }
        }}
        aria-label="Select Layout 1 - Profile image centered with name below"
        aria-pressed={isLayout1Selected}
      >
        <img 
          src="/assets/Client/layout1.svg" 
          alt="Layout 1: Profile image centered, name below" 
          style={styles.layoutImage} 
        />
      </Box>
      <Box 
        onClick={handleLayout2Click}
        sx={styles.selectionBox(isLayout2Selected)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleLayout2Click();
          }
        }}
        aria-label="Select Layout 2 - Profile image left with name on right"
        aria-pressed={isLayout2Selected}
      >
        <img 
          src="/assets/Client/layout2.svg" 
          alt="Layout 2: Profile image left, name right" 
          style={styles.layoutImage} 
        />
      </Box>
    </Box>
  );
}

