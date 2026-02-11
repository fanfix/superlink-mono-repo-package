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
  textColor?: string;
  /** When true, section uses dark card background + white text. */
  isDarkBg?: boolean;
  /** When true (black page bg), section uses gray background + black text. */
  isBlackBg?: boolean;
}

export function BrandKitRenderer({ items, engagements = [], pricing = [], pageName, isDarkBg = false, isBlackBg = false }: BrandKitRendererProps) {
  if (items.length === 0) return null;

  return (
    <Box sx={styles.brandKitSectionThemed(isDarkBg, isBlackBg)}>
      {items.map((item) => (
        <Box key={item.id} sx={styles.brandKitItemContainerThemed(isDarkBg, isBlackBg)}>
          <Box sx={styles.brandKitHeader}>
            {item.thumbnailUrl && (
              <Box component="img" src={item.thumbnailUrl} alt="Brand Kit" sx={styles.brandKitLogo} />
            )}
            {pageName && (
              <Typography sx={[styles.brandKitTitle, { color: 'inherit' }]}>{`${pageName}'s Brand Kit`}</Typography>
            )}
          </Box>
          <Typography sx={[styles.brandKitDescription, { color: 'inherit' }]}>{item.description}</Typography>
          {engagements.length > 0 && (
            <Box sx={styles.engagementsContainer}>
              {engagements.map((engagement) => (
                <Box key={engagement.id} sx={styles.engagementItem}>
                  <Box sx={styles.engagementCountBadge}>
                    <Typography sx={[styles.engagementCountText, { color: 'inherit' }]}>{engagement.count}</Typography>
                  </Box>
                  <Typography sx={[styles.engagementTitleText, { color: 'inherit' }]}>{engagement.title}</Typography>
                </Box>
              ))}
            </Box>
          )}
          {pricing.length > 0 && (
            <>
              <Box sx={styles.pricingDivider} />
              <Typography sx={[styles.pricingHeading, { color: 'inherit' }]}>Pricing & Packages</Typography>
              <Box sx={styles.pricingList}>
                {pricing.map((pricingItem) => (
                  <Box key={pricingItem.id} sx={styles.pricingItem}>
                    <Typography sx={[styles.pricingBullet, { color: 'inherit' }]}>•</Typography>
                    <Typography sx={[styles.pricingTitle, { color: 'inherit' }]}>{pricingItem.title}</Typography>
                    <Typography sx={[styles.pricingPrice, { color: 'inherit' }]}>{pricingItem.price}</Typography>
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

