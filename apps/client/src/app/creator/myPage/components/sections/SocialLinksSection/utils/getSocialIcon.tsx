import React from 'react';
import {
  InstagramLogoIcon,
  FacebookLogoIcon,
  TwitterLogoIcon,
  YouTubeLogoIcon,
  TikTokLogoIcon,
  SnapchatLogoIcon,
  MaterialIcons,
} from '@superline/design-system';

// Temporary: Import new icons directly until they're exported from design-system
// LinkedIn uses MaterialIcons
const LinkedInLogoIcon = ({ size = 24, color = "#0077B5" }: { size?: number; color?: string }) => (
  <MaterialIcons.LinkedIn sx={{ fontSize: size, color }} />
);

// Custom SVG icons
const PinterestLogoIcon = ({ size = 24, color = "#BD081C" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.05 8.97 7.35 10.6-.1-.9-.2-2.27.04-3.24.22-.94 1.42-5.98 1.42-5.98s-.36-.73-.36-1.8c0-1.68.97-2.94 2.18-2.94 1.03 0 1.53.77 1.53 1.7 0 1.03-.66 2.57-.99 4-.28 1.19.6 2.16 1.78 2.16 2.14 0 3.78-2.26 3.78-5.52 0-2.88-2.07-4.9-5.03-4.9-3.43 0-5.44 2.57-5.44 5.23 0 1.03.4 2.14.9 2.75.1.12.11.22.08.34l-.33 1.33c-.04.18-.15.22-.35.13-1.31-.61-2.13-2.52-2.13-4.06 0-3.31 2.41-6.35 6.95-6.35 3.65 0 6.48 2.6 6.48 6.07 0 3.63-2.29 6.55-5.47 6.55-1.07 0-2.08-.56-2.43-1.25l-.65 2.48c-.24.93-.89 2.09-1.33 2.8.99.31 2.04.47 3.12.47 5.52 0 10-4.48 10-10S17.52 2 12 2z" fill={color} />
  </svg>
);

const DiscordLogoIcon = ({ size = 24, color = "#5865F2" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" fill={color} />
  </svg>
);

const TwitchLogoIcon = ({ size = 24, color = "#9146FF" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm16.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" fill={color} />
  </svg>
);

const RedditLogoIcon = ({ size = 24, color = "#FF4500" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" fill={color} />
  </svg>
);

const TelegramLogoIcon = ({ size = 24, color = "#0088cc" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.87 8.801c-.141.625-.537.778-1.084.481l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.12l-6.87 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" fill={color} />
  </svg>
);

export const getSocialIcon = (platform: string, size: number = 20, color: string = 'currentColor'): React.ReactNode => {
  const platformLower = platform.toLowerCase();
  
  switch (platformLower) {
    case 'instagram':
      return <InstagramLogoIcon size={size} color={color} />;
    case 'facebook':
      return <FacebookLogoIcon size={size} color={color} />;
    case 'twitter':
    case 'x':
      return <TwitterLogoIcon size={size} color={color} />;
    case 'youtube':
      return <YouTubeLogoIcon size={size} color={color} />;
    case 'tiktok':
      return <TikTokLogoIcon size={size} color={color} />;
    case 'linkedin':
      return <LinkedInLogoIcon size={size} color={color} />;
    case 'snapchat':
      return <SnapchatLogoIcon size={size} color={color} />;
    case 'pinterest':
      return <PinterestLogoIcon size={size} color={color} />;
    case 'discord':
      return <DiscordLogoIcon size={size} color={color} />;
    case 'twitch':
      return <TwitchLogoIcon size={size} color={color} />;
    case 'reddit':
      return <RedditLogoIcon size={size} color={color} />;
    case 'telegram':
      return <TelegramLogoIcon size={size} color={color} />;
    default:
      return null;
  }
};

