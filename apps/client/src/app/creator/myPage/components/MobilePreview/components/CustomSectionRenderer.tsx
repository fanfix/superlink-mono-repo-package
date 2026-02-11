import React, { useRef } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Typography } from '@superline/design-system';
import { Email as EmailIcon, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { CustomSection } from '../types';
import { styles } from './styles';
import { LinkIconSvg } from '../../../constants/icons';
import { getPlatformFromUrl, getSocialIcon, SOCIAL_BRAND_COLORS } from '../../sections/SocialLinksSection/utils/socialIcons';
import { EmbedMaker, getEmbedPlatform } from '../../../embedPreview';

interface CustomSectionRendererProps {
  section: CustomSection;
}

const LINK_ICON_COLOR = 'var(--color-black)';

/** Resolve link icon: platform icon if URL matches a known platform, else default link/email icon (black). */
function getLinkIcon(item: { url?: string; isEmail?: boolean }, size: number) {
  if (item.isEmail) return <EmailIcon sx={{ fontSize: size, color: LINK_ICON_COLOR }} />;
  const platform = getPlatformFromUrl(item.url, item.isEmail);
  if (platform) return getSocialIcon(platform, size, LINK_ICON_COLOR);
  return <LinkIconSvg width={size} height={size} sx={{ color: LINK_ICON_COLOR }} />;
}

/** Placeholder when no thumbnail: platform colored box + icon if URL matches, else gray + link icon */
function getNoThumbnailPlaceholder(item: { url?: string; isEmail?: boolean }, iconSize: number) {
  const platform = getPlatformFromUrl(item.url, item.isEmail);
  const bgColor = platform && SOCIAL_BRAND_COLORS[platform] ? SOCIAL_BRAND_COLORS[platform] : undefined;
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor || 'var(--color-gray-200)',
        borderRadius: 'inherit',
      }}
    >
      {item.isEmail ? (
        <EmailIcon sx={{ fontSize: iconSize, color: bgColor ? '#fff' : 'var(--color-gray-500)' }} />
      ) : platform ? (
        getSocialIcon(platform, iconSize, bgColor ? '#fff' : 'var(--color-gray-500)')
      ) : (
        <LinkIconSvg width={iconSize} height={iconSize} sx={{ color: 'var(--color-gray-500)' }} />
      )}
    </Box>
  );
}

const EMBED_SLIDER_ITEM_WIDTH = 280;
const EMBED_SLIDER_GAP = 16;

export function CustomSectionRenderer({ section }: CustomSectionRendererProps) {
  const embedSliderRef = useRef<HTMLDivElement>(null);

  const handleLinkClick = (item: { url?: string; isEmail?: boolean }) => {
    if (!item.url) return;
    
    if (item.isEmail) {
      window.location.href = `mailto:${item.url}`;
    } else {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const listImageContainerStyles = {
    position: 'relative',
    width: '100%',
    aspectRatio: '16/9',
    borderRadius: 'var(--border-radius-md)',
    overflow: 'hidden',
  };

  const rowImageContainerStyles = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
  };

  const renderLayout = () => {
    switch (section.layout) {
      case 'list':
        return (
          <Box sx={styles.customSectionList}>
            {section.items.map((item) => (
              <Box key={item.id} sx={styles.customSectionListItem} onClick={() => item.url && handleLinkClick(item)} role={item.url ? 'link' : undefined}>
                {item.imageUrl ? (
                  <>
                    <Box sx={styles.customSectionListImageWrap}>
                      <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                        <Box component="img" src={item.imageUrl} alt={item.title} sx={styles.customSectionListImage} />
                        {item.url && (
                          <IconButton
                            onClick={(e) => { e.stopPropagation(); handleLinkClick(item); }}
                            size="small"
                            sx={styles.customSectionListLinkIcon}
                          >
                            {getLinkIcon(item, 18)}
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    <Box sx={styles.customSectionListContent}>
                      <Typography sx={styles.customSectionItemTitle}>{item.title}</Typography>
                    </Box>
                  </>
                ) : (
                  <Box sx={styles.customSectionListItemFallback}>
                    <Box sx={{ ...styles.customSectionListIcon, overflow: 'hidden', borderRadius: 'var(--border-radius-md)' }}>
                      {getNoThumbnailPlaceholder(item, 32)}
                    </Box>
                    <Box sx={styles.customSectionItemContent}>
                      <Typography sx={styles.customSectionItemTitle}>{item.title}</Typography>
                      {item.url ? (
                        <Typography sx={styles.customSectionItemPrice}>{item.url}</Typography>
                      ) : item.price ? (
                        <Typography sx={styles.customSectionItemPrice}>${item.price}</Typography>
                      ) : null}
                    </Box>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        );

      case 'row':
        return (
          <Box sx={styles.customSectionRow}>
            {section.items.map((item) => (
              <Box key={item.id} sx={styles.customSectionRowItem}>
                {item.imageUrl ? (
                  <Box sx={rowImageContainerStyles}>
                    <Box component="img" src={item.imageUrl} alt={item.title} sx={styles.customSectionRowImage} />
                    <Typography sx={styles.customSectionRowTitleOverlay}>{item.title}</Typography>
                    {item.url && (
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); handleLinkClick(item); }}
                        size="small"
                        sx={styles.customSectionRowLinkIcon}
                      >
                        {getLinkIcon(item, 18)}
                      </IconButton>
                    )}
                  </Box>
                ) : (
                  <Box sx={rowImageContainerStyles}>
                    {getNoThumbnailPlaceholder(item, 40)}
                    <Typography sx={styles.customSectionRowTitleOverlay}>{item.title}</Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        );

      case 'parallel-row':
        return (
          <Box sx={styles.customSectionParallel}>
            {section.items.map((item) => (
              <Tooltip
                key={item.id}
                title={
                  <Box>
                    <Box sx={styles.tooltipTitle}>{item.title}</Box>
                    {item.url && <Box>{item.url}</Box>}
                    {!item.url && item.price && <Box>${item.price}</Box>}
                  </Box>
                }
                arrow
                placement="top"
              >
                <Box 
                  sx={styles.customSectionParallelItem}
                  onClick={() => item.url && handleLinkClick(item)}
                >
                  <Box sx={styles.parallelImageContainer}>
                    {item.imageUrl ? (
                      <Box component="img" src={item.imageUrl} alt={item.title} sx={styles.customSectionParallelImage} />
                    ) : (
                      <Box sx={{ ...styles.customSectionParallelImagePlaceholder, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {getNoThumbnailPlaceholder(item, 28)}
                      </Box>
                    )}
                    <Box sx={styles.customSectionParallelIcon}>
                      {getLinkIcon(item, 16)}
                    </Box>
                  </Box>
                  <Box sx={styles.customSectionParallelContent}>
                    <Typography sx={styles.customSectionParallelTitle}>{item.title}</Typography>
                    {item.content?.trim() ? (
                      <Typography sx={{ ...styles.customSectionParallelUrl, whiteSpace: 'normal' }}>{item.content.trim()}</Typography>
                    ) : null}
                    {item.url ? (
                      <Typography sx={styles.customSectionParallelUrl}>{item.url}</Typography>
                    ) : item.price ? (
                      <Typography sx={styles.customSectionParallelUrl}>${item.price}</Typography>
                    ) : null}
                  </Box>
                </Box>
              </Tooltip>
            ))}
          </Box>
        );

      default:
        return null;
    }
  };

  // Embed sections: list = Spotify-style stacked; row = slider with nav buttons
  if (section.sectionType === 'embeds' && section.items.length > 0) {
    const embedItems = section.items.filter((item) => item.url && getEmbedPlatform(item.url));
    if (embedItems.length === 0) return null;

    if (section.layout === 'list' || section.layout === 'parallel-row') {
      return (
        <Box sx={styles.customSection}>
          <Typography sx={styles.customSectionName}>{section.name}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {embedItems.map((item) => {
              const name = getEmbedPlatform(item.url!) || 'YouTube';
              return (
                <Box key={item.id} sx={{ width: '100%', borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
                  <EmbedMaker url={item.url!} name={name} size="large" />
                </Box>
              );
            })}
          </Box>
        </Box>
      );
    }

    if (section.layout === 'row') {
      const scroll = (dir: 'left' | 'right') => {
        const el = embedSliderRef.current;
        if (!el) return;
        const step = EMBED_SLIDER_ITEM_WIDTH + EMBED_SLIDER_GAP;
        el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
      };
      return (
        <Box sx={styles.customSection}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={styles.customSectionName}>{section.name}</Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={() => scroll('left')} sx={{ bgcolor: 'var(--color-gray-100)' }}>
                <ChevronLeft />
              </IconButton>
              <IconButton size="small" onClick={() => scroll('right')} sx={{ bgcolor: 'var(--color-gray-100)' }}>
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>
          <Box
            ref={embedSliderRef}
            sx={{
              display: 'flex',
              gap: EMBED_SLIDER_GAP,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {embedItems.map((item) => {
              const name = getEmbedPlatform(item.url!) || 'YouTube';
              return (
                <Box
                  key={item.id}
                  sx={{
                    minWidth: EMBED_SLIDER_ITEM_WIDTH,
                    flexShrink: 0,
                    borderRadius: 'var(--border-radius-md)',
                    overflow: 'hidden',
                  }}
                >
                  <EmbedMaker url={item.url!} name={name} size="small" />
                </Box>
              );
            })}
          </Box>
        </Box>
      );
    }
  }

  return (
    <Box sx={styles.customSection}>
      <Typography sx={styles.customSectionName}>{section.name}</Typography>
      {renderLayout()}
    </Box>
  );
}

