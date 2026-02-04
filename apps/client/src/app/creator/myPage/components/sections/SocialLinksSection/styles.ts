import { SxProps, Theme } from '@mui/material';
import { CSSProperties } from 'react';

export const styles = {
  linkItem: (isDragging: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-md)',
    padding: 'var(--padding-md)',
    border: 'none',
    borderRadius: 'var(--border-radius-md)',
    marginBottom: 'var(--padding-md)',
    backgroundColor: 'var(--color-gray-100)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    cursor: isDragging ? 'grabbing' : 'grab',
  }) as SxProps<Theme>,

  linkIcon: (platform: string) => {
    // Platform-specific background colors
    const platformLower = platform.toLowerCase();
    const isInstagram = platformLower === 'instagram';
    
    const getBackgroundStyle = () => {
      if (isInstagram) {
        return {
          background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        };
      }
      
      const colors: Record<string, string> = {
        facebook: '#1877F2',
        twitter: '#000000',
        x: '#000000',
        youtube: '#FF0000',
        tiktok: '#000000',
        linkedin: '#0077B5',
        snapchat: '#FFFC00',
        pinterest: '#BD081C',
        discord: '#5865F2',
        twitch: '#9146FF',
        reddit: '#FF4500',
        telegram: '#0088cc',
      };
      
      return {
        backgroundColor: colors[platformLower] || '#6B7280',
      };
    };

    return {
      width: '36px',
      height: '36px',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      ...getBackgroundStyle(),
      '& svg': {
        fill: '#FFFFFF !important',
        color: '#FFFFFF',
        fontSize: '20px',
        width: '20px',
        height: '20px',
      },
      '& .MuiSvgIcon-root': {
        fill: '#FFFFFF !important',
        color: '#FFFFFF',
      },
    } as SxProps<Theme>;
  },

  iconImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  } as CSSProperties,

  linkInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--padding-xs)',
  } as SxProps<Theme>,

  linkPlatform: {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-black)',
    marginBottom: '2px',
  } as SxProps<Theme>,

  linkUrl: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-gray-500)',
  } as SxProps<Theme>,

  dragHandle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    padding: '4px',
    color: 'var(--color-gray-500)',
    '&:active': {
      cursor: 'grabbing',
    },
  } as SxProps<Theme>,

  addButton: {
    width: '100%',
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
    borderRadius: 'var(--border-radius-2xl)',
    padding: 'var(--padding-md) var(--padding-xl)',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'uppercase' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--padding-xs)',
    '&:hover': {
      backgroundColor: '#1a1a1a',
    },
  } as SxProps<Theme>,
};

