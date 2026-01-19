import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Typography } from '@superline/design-system';
import { Link as LinkIcon, Email as EmailIcon } from '@mui/icons-material';
import { CustomSection } from '../types';
import { styles } from './styles';

interface CustomSectionRendererProps {
  section: CustomSection;
}

export function CustomSectionRenderer({ section }: CustomSectionRendererProps) {
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
    position: 'relative',
    width: '100%',
    height: '100%',
  };

  const renderLayout = () => {
    switch (section.layout) {
      case 'list':
        return (
          <Box sx={styles.customSectionList}>
            {section.items.map((item) => (
              <Box key={item.id} sx={styles.customSectionListItem}>
                {item.imageUrl ? (
                  <Box sx={listImageContainerStyles}>
                    <Box component="img" src={item.imageUrl} alt={item.title} sx={styles.customSectionListImage} />
                    <Typography sx={styles.customSectionListTitleOverlay}>{item.title}</Typography>
                    {item.url && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLinkClick(item);
                        }}
                        size="small"
                        sx={styles.customSectionListLinkIcon}
                      >
                        {item.isEmail ? (
                          <EmailIcon sx={{ fontSize: '18px', color: 'var(--color-black)' }} />
                        ) : (
                          <LinkIcon sx={{ fontSize: '18px', color: 'var(--color-black)' }} />
                        )}
                      </IconButton>
                    )}
                  </Box>
                ) : (
                  <Box sx={styles.customSectionListItemFallback}>
                    <Box sx={styles.customSectionListIcon}>
                      {item.isEmail ? (
                        <EmailIcon sx={styles.emailIconGray} />
                      ) : (
                        <LinkIcon sx={styles.linkIconGray} />
                      )}
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
                        onClick={() => handleLinkClick(item)}
                        size="small"
                        sx={styles.customSectionRowLinkIcon}
                      >
                        {item.isEmail ? (
                          <EmailIcon sx={{ fontSize: '18px', color: 'var(--color-black)' }} />
                        ) : (
                          <LinkIcon sx={{ fontSize: '18px', color: 'var(--color-black)' }} />
                        )}
                      </IconButton>
                    )}
                  </Box>
                ) : (
                  <Typography sx={styles.customSectionRowTitle}>{item.title}</Typography>
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
                      <Box sx={styles.customSectionParallelImagePlaceholder} />
                    )}
                    <Box sx={styles.customSectionParallelIcon}>
                      {item.isEmail ? (
                        <EmailIcon sx={styles.emailIconSmall} />
                      ) : (
                        <LinkIcon sx={styles.linkIconSmall} />
                      )}
                    </Box>
                  </Box>
                  <Box sx={styles.customSectionParallelContent}>
                    <Typography sx={styles.customSectionParallelTitle}>{item.title}</Typography>
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

  return (
    <Box sx={styles.customSection}>
      <Typography sx={styles.customSectionName}>{section.name}</Typography>
      {renderLayout()}
    </Box>
  );
}

