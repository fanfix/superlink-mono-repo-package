import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import { Typography } from '@superline/design-system';
import { ArrowForward } from '@mui/icons-material';
import { ContentItem } from '../types';
import { styles } from './styles';
import { CountdownTimer } from './CountdownTimer';

interface ExclusiveContentSliderProps {
  items: ContentItem[];
  coverImage?: string;
}

export function ExclusiveContentSlider({ items, coverImage }: ExclusiveContentSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Ensure scroll starts at the beginning (first card visible) - only on initial load
  // Don't reset scroll when items are added (preserves user's scroll position)
  const [hasInitialized, setHasInitialized] = useState(false);
  useEffect(() => {
    if (!hasInitialized && scrollRef.current && items.length > 0) {
      scrollRef.current.scrollLeft = 0;
      setHasInitialized(true);
    }
  }, [items.length, hasInitialized]); // Only depend on items.length, not items array itself

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !scrollRef.current) return;
      e.preventDefault();
      const x = e.pageX - (scrollRef.current.offsetLeft || 0);
      const walk = (x - startX) * 2;
      scrollRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  if (items.length === 0) return null;

  return (
    <Box
      ref={scrollRef}
      sx={styles.exclusiveContentSection}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {items.map((item) => (
        <Box key={item.id} sx={styles.unlockCard}>
          <Box sx={styles.unlockHeader}>
            <Box sx={styles.unlockLeft}>
              <Typography sx={styles.unlockTitle}>Unlock - ${item.price}</Typography>
              <Box sx={styles.unlockDateContainer}>
                <Box sx={styles.greenDot} />
                <Typography sx={styles.unlockDate}>Updated a week ago</Typography>
              </Box>
            </Box>
            <Box sx={styles.linkButton}>
              <ArrowForward sx={{ fontSize: '16px' }} />
              <Typography>link</Typography>
            </Box>
          </Box>

          <Box sx={styles.blurredContentContainer}>
            {item.imageUrl ? (
              <>
                <Box component="img" src={item.imageUrl} alt={item.title} sx={styles.blurredCoverImage} />
                <Box sx={styles.blurredOverlay} />
              </>
            ) : coverImage ? (
              <>
                <Box component="img" src={coverImage} alt="Cover" sx={styles.blurredCoverImage} />
                <Box sx={styles.blurredOverlay} />
              </>
            ) : (
              <Box sx={styles.blurredPlaceholder} />
            )}
            <Box sx={styles.blurredContentText}>
              <Typography sx={styles.blurredTitle}>{item.title || 'undefined'}</Typography>
              <Typography sx={styles.blurredSubtitle}>Creator</Typography>
              {item.countdownMinutes && item.countdownSeconds && (
                <CountdownTimer
                  initialMinutes={item.countdownMinutes}
                  initialSeconds={item.countdownSeconds}
                />
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

