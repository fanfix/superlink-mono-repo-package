import React from 'react';
import { Box } from '@mui/material';
import { Typography } from '@superline/design-system';
import { Engagement } from '../types';
import { styles } from './styles';

interface EngagementsRendererProps {
  engagements: Engagement[];
  brandKitName?: string;
}

export function EngagementsRenderer({ engagements, brandKitName }: EngagementsRendererProps) {
  if (engagements.length === 0) return null;

  return (
    <Box sx={styles.brandKitSection}>
      {brandKitName && (
        <Typography sx={styles.brandKitTitle}>{`${brandKitName}'s Brand Kit`}</Typography>
      )}
      <Box sx={styles.engagementsContainer}>
        {engagements.map((engagement) => (
          <Box key={engagement.id} sx={styles.engagementItem}>
            <Box sx={styles.engagementCountBadge}>
              <Typography sx={styles.engagementCountText}>{engagement.count}</Typography>
            </Box>
            <Typography sx={styles.engagementTitleText}>{engagement.title}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

