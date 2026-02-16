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
  /** When true (e.g. public username page), use compact grid (3 cols, smaller gap/size). */
  compactLayout?: boolean;
  /** Text color for section heading (auto from page background). */
  textColor?: string;
  /** When true, cards (list, parallel) use dark background + white text. */
  isDarkBg?: boolean;
  /** When true (black page bg), section cards use gray background + black text. */
  isBlackBg?: boolean;
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

const EMBED_SLIDER_GAP = 4;
/** Username page 2-cards view: smaller gap so both cards fit fully */
const EMBED_SLIDER_GAP_COMPACT = 2;

const defaultTextColor = 'var(--color-black)';

const cardTextInherit = { color: 'inherit' as const };

export function CustomSectionRenderer({ section, compactLayout, textColor = defaultTextColor, isDarkBg = false, isBlackBg = false }: CustomSectionRendererProps) {
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
              <Box key={item.id} sx={styles.customSectionListItemThemed(isDarkBg, isBlackBg)} onClick={() => item.url && handleLinkClick(item)} role={item.url ? 'link' : undefined}>
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
                      <Typography sx={[styles.customSectionItemTitle, cardTextInherit]}>{item.title}</Typography>
                    </Box>
                  </>
                ) : (
                  <Box sx={styles.customSectionListItemFallbackThemed(isDarkBg, isBlackBg)}>
                    <Box sx={{ ...styles.customSectionListIcon, overflow: 'hidden', borderRadius: 'var(--border-radius-md)' }}>
                      {getNoThumbnailPlaceholder(item, 32)}
                    </Box>
                    <Box sx={styles.customSectionItemContent}>
                      <Typography sx={[styles.customSectionItemTitle, cardTextInherit]}>{item.title}</Typography>
                      {item.url ? (
                        <Typography sx={[styles.customSectionItemPrice, cardTextInherit]}>{item.url}</Typography>
                      ) : item.price ? (
                        <Typography sx={[styles.customSectionItemPrice, cardTextInherit]}>${item.price}</Typography>
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
          <Box sx={compactLayout ? styles.customSectionRowCompact : styles.customSectionRow}>
            {section.items.map((item) => (
              <Box key={item.id} sx={[styles.customSectionRowItem, compactLayout && styles.customSectionRowItemCompact]}>
                {item.imageUrl ? (
                  <Box sx={rowImageContainerStyles}>
                    <Box component="img" src={item.imageUrl} alt={item.title} sx={styles.customSectionRowImage} />
                    <Typography sx={[styles.customSectionRowTitleOverlay, { color: textColor }]}>{item.title}</Typography>
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
                    <Typography sx={[styles.customSectionRowTitleOverlay, { color: textColor }]}>{item.title}</Typography>
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
                  sx={styles.customSectionParallelItemThemed(isDarkBg, isBlackBg)}
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
                    <Typography sx={[styles.customSectionParallelTitle, cardTextInherit]}>{item.title}</Typography>
                    {item.content?.trim() ? (
                      <Typography sx={{ ...styles.customSectionParallelUrl, whiteSpace: 'normal', ...cardTextInherit, opacity: 0.9 }}>{item.content.trim()}</Typography>
                    ) : null}
                    {item.url ? (
                      <Typography sx={[styles.customSectionParallelUrl, cardTextInherit]}>{item.url}</Typography>
                    ) : item.price ? (
                      <Typography sx={[styles.customSectionParallelUrl, cardTextInherit]}>${item.price}</Typography>
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

  // Embed sections: show embed items with EmbedMaker, non-embed items as link cards (sectionType + isEmbed so creator & public match)
  if ((section.sectionType === 'embeds' || section.isEmbed === true) && section.items.length > 0) {
    const embedItems = section.items.filter((item) => item.url && getEmbedPlatform(item.url));
    const nonEmbedItems = section.items.filter((item) => !item.url || !getEmbedPlatform(item.url));

    if (section.layout === 'list' || section.layout === 'parallel-row') {
      return (
        <Box sx={[styles.customSection, { color: textColor }]}>
          <Typography sx={[styles.customSectionName, { color: textColor }]}>{section.name}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {embedItems.map((item) => {
              const name = getEmbedPlatform(item.url!) || 'YouTube';
              const embedSize = (item.size === 'small' || item.size === 'large' ? item.size : 'large') as 'small' | 'large';
              return (
                <Box key={item.id} sx={{ width: '100%', borderRadius: 'var(--border-radius-md)', overflow: 'visible', '& iframe': { display: 'block', borderRadius: 'var(--border-radius-md)' } }}>
                  <EmbedMaker url={item.url!} name={name} size={embedSize} />
                </Box>
              );
            })}
            {nonEmbedItems.length > 0 && section.layout === 'parallel-row' && (
              <Box sx={styles.customSectionParallel}>
                {nonEmbedItems.map((item) => (
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
                      sx={styles.customSectionParallelItemThemed(isDarkBg, isBlackBg)}
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
                        <Typography sx={[styles.customSectionParallelTitle, cardTextInherit]}>{item.title}</Typography>
                        {item.content?.trim() ? (
                          <Typography sx={{ ...styles.customSectionParallelUrl, whiteSpace: 'normal', ...cardTextInherit, opacity: 0.9 }}>{item.content.trim()}</Typography>
                        ) : null}
                        {item.url ? (
                          <Typography sx={[styles.customSectionParallelUrl, cardTextInherit]}>{item.url}</Typography>
                        ) : item.price ? (
                          <Typography sx={[styles.customSectionParallelUrl, cardTextInherit]}>${item.price}</Typography>
                        ) : null}
                      </Box>
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            )}
            {nonEmbedItems.length > 0 && section.layout === 'list' && (
              <Box sx={styles.customSectionList}>
                {nonEmbedItems.map((item) => (
                  <Box key={item.id} sx={styles.customSectionListItemThemed(isDarkBg, isBlackBg)} onClick={() => item.url && handleLinkClick(item)} role={item.url ? 'link' : undefined}>
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
                          <Typography sx={[styles.customSectionItemTitle, cardTextInherit]}>{item.title}</Typography>
                        </Box>
                      </>
                    ) : (
                      <Box sx={styles.customSectionListItemFallbackThemed(isDarkBg, isBlackBg)}>
                        <Box sx={{ ...styles.customSectionListIcon, overflow: 'hidden', borderRadius: 'var(--border-radius-md)' }}>
                          {getNoThumbnailPlaceholder(item, 32)}
                        </Box>
                        <Box sx={styles.customSectionItemContent}>
                          <Typography sx={[styles.customSectionItemTitle, cardTextInherit]}>{item.title}</Typography>
                          {item.url ? (
                            <Typography sx={[styles.customSectionItemPrice, cardTextInherit]}>{item.url}</Typography>
                          ) : item.price ? (
                            <Typography sx={[styles.customSectionItemPrice, cardTextInherit]}>${item.price}</Typography>
                          ) : null}
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      );
    }

    if (section.layout === 'row' && embedItems.length > 0) {
      const sectionNameSx = [styles.customSectionName, { color: textColor }];
      // Username (public) page: 2 cards per view (compactLayout), small gap so both fit. Creator: 1 card per view.
      const cardsPerView = compactLayout ? 2 : 1;
      const gap = compactLayout ? EMBED_SLIDER_GAP_COMPACT : EMBED_SLIDER_GAP;
      const cardWidthPercent = cardsPerView === 2 ? `calc(50% - ${gap / 2}px)` : '100%';
      const scrollTo = (dir: 'left' | 'right') => {
        const el = embedSliderRef.current;
        if (!el) return;
        const cardWidth = (el.clientWidth - gap * (cardsPerView - 1)) / cardsPerView;
        const step = cardWidth + gap;
        const currentIndex = Math.round(el.scrollLeft / step);
        const nextIndex = dir === 'right' ? Math.min(currentIndex + 1, embedItems.length - 1) : Math.max(currentIndex - 1, 0);
        el.scrollTo({ left: nextIndex * step, behavior: 'smooth' });
      };
      return (
        <Box sx={[styles.customSection, { color: textColor }]}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={sectionNameSx}>{section.name}</Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={() => scrollTo('left')} sx={{ bgcolor: 'var(--color-gray-100)' }}>
                <ChevronLeft />
              </IconButton>
              <IconButton size="small" onClick={() => scrollTo('right')} sx={{ bgcolor: 'var(--color-gray-100)' }}>
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>
          <Box
            ref={embedSliderRef}
            sx={{
              display: 'flex',
              gap,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth',
              scrollSnapType: 'x mandatory',
              width: '100%',
              maxWidth: '100%',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {embedItems.map((item) => {
              const name = getEmbedPlatform(item.url!) || 'YouTube';
              const embedSize = (item.size === 'small' || item.size === 'large' ? item.size : 'small') as 'small' | 'large';
              return (
                <Box
                  key={item.id}
                  sx={{
                    flex: `0 0 ${cardWidthPercent}`,
                    minWidth: cardWidthPercent,
                    width: cardWidthPercent,
                    boxSizing: 'border-box',
                    borderRadius: 'var(--border-radius-md)',
                    overflow: 'visible',
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    display: 'flex',
                    flexDirection: 'column',
                    '& iframe': { display: 'block', borderRadius: 'var(--border-radius-md)', maxWidth: '100%' },
                  }}
                >
                  <EmbedMaker url={item.url!} name={name} size={embedSize} />
                </Box>
              );
            })}
          </Box>
          {nonEmbedItems.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Box sx={styles.customSectionParallel}>
                {nonEmbedItems.map((item) => (
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
                      sx={styles.customSectionParallelItemThemed(isDarkBg, isBlackBg)}
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
                        <Typography sx={[styles.customSectionParallelTitle, cardTextInherit]}>{item.title}</Typography>
                        {item.content?.trim() ? (
                          <Typography sx={{ ...styles.customSectionParallelUrl, whiteSpace: 'normal', ...cardTextInherit, opacity: 0.9 }}>{item.content.trim()}</Typography>
                        ) : null}
                        {item.url ? (
                          <Typography sx={[styles.customSectionParallelUrl, cardTextInherit]}>{item.url}</Typography>
                        ) : item.price ? (
                          <Typography sx={[styles.customSectionParallelUrl, cardTextInherit]}>${item.price}</Typography>
                        ) : null}
                      </Box>
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      );
    }

    if (embedItems.length === 0 && nonEmbedItems.length > 0 && section.layout === 'row') {
      return (
        <Box sx={[styles.customSection, { color: textColor }]}>
          <Typography sx={[styles.customSectionName, { color: textColor }]}>{section.name}</Typography>
          <Box sx={styles.customSectionParallel}>
            {nonEmbedItems.map((item) => (
              <Tooltip key={item.id} title={<Box><Box sx={styles.tooltipTitle}>{item.title}</Box>{item.url && <Box>{item.url}</Box>}</Box>} arrow placement="top">
                <Box sx={styles.customSectionParallelItemThemed(isDarkBg, isBlackBg)} onClick={() => item.url && handleLinkClick(item)}>
                  <Box sx={styles.parallelImageContainer}>
                    {item.imageUrl ? (
                      <Box component="img" src={item.imageUrl} alt={item.title} sx={styles.customSectionParallelImage} />
                    ) : (
                      <Box sx={{ ...styles.customSectionParallelImagePlaceholder, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {getNoThumbnailPlaceholder(item, 28)}
                      </Box>
                    )}
                    <Box sx={styles.customSectionParallelIcon}>{getLinkIcon(item, 16)}</Box>
                  </Box>
                  <Box sx={styles.customSectionParallelContent}>
                    <Typography sx={[styles.customSectionParallelTitle, cardTextInherit]}>{item.title}</Typography>
                    {item.content?.trim() ? <Typography sx={{ ...styles.customSectionParallelUrl, whiteSpace: 'normal', ...cardTextInherit, opacity: 0.9 }}>{item.content.trim()}</Typography> : null}
                    {item.url ? <Typography sx={[styles.customSectionParallelUrl, cardTextInherit]}>{item.url}</Typography> : item.price ? <Typography sx={[styles.customSectionParallelUrl, cardTextInherit]}>${item.price}</Typography> : null}
                  </Box>
                </Box>
              </Tooltip>
            ))}
          </Box>
        </Box>
      );
    }
  }

  return (
    <Box sx={[styles.customSection, { color: textColor }]}>
      <Typography sx={[styles.customSectionName, { color: textColor }]}>{section.name}</Typography>
      {renderLayout()}
    </Box>
  );
}

