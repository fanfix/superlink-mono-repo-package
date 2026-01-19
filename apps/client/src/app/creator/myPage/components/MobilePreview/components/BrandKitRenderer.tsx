import React from 'react';
import { Box } from '@mui/material';
import { Typography } from '@superline/design-system';
import { BrandKitItem, Engagement, Pricing } from '../types';
import { styles } from './styles';

interface BrandKitRendererProps {
  items: BrandKitItem[];
  engagements?: Engagement[];
  pricing?: Pricing[];
  pageName?: string;
}

export function BrandKitRenderer({ items, engagements = [], pricing = [], pageName }: BrandKitRendererProps) {
  if (items.length === 0) return null;

  return (
    <Box sx={styles.brandKitSection}>
      {items.map((item) => (
        <Box key={item.id} sx={styles.brandKitItemContainer}>
          <Box sx={styles.brandKitHeader}>
            {item.thumbnailUrl && (
              <Box component="img" src={item.thumbnailUrl} alt="Brand Kit" sx={styles.brandKitLogo} />
            )}
            {pageName && (
              <Typography sx={styles.brandKitTitle}>{`${pageName}'s Brand Kit`}</Typography>
            )}
          </Box>
          <Typography sx={styles.brandKitDescription}>{item.description}</Typography>
          {engagements.length > 0 && (
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
          )}
          {pricing.length > 0 && (
            <>
              <Box sx={styles.pricingDivider} />
              <Typography sx={styles.pricingHeading}>Pricing & Packages</Typography>
              <Box sx={styles.pricingList}>
                {pricing.map((pricingItem) => (
                  <Box key={pricingItem.id} sx={styles.pricingItem}>
                    <Typography sx={styles.pricingBullet}>•</Typography>
                    <Typography sx={styles.pricingTitle}>{pricingItem.title}</Typography>
                    <Typography sx={styles.pricingPrice}>{pricingItem.price}</Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      ))}
    </Box>
  );
}

