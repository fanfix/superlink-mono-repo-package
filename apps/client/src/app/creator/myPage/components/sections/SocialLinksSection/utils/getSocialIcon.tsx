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

// LinkedIn uses MaterialIcons
const LinkedInLogoIcon = ({ size = 24, color = "#0077B5" }: { size?: number; color?: string }) => (
  <MaterialIcons.LinkedIn sx={{ fontSize: size, color }} />
);

// Amazon Wishlist - Official Amazon icon
const AmazonWishlistLogoIcon = ({ size = 24, color = "#FF9900" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
    <path d="M12.75 3.75c0 1.24-1.01 2.25-2.25 2.25S8.25 4.99 8.25 3.75 9.26 1.5 10.5 1.5s2.25 1.01 2.25 2.25zm2.25 4.5h-9v1.5h9v-1.5zM8.25 10.5h6v1.5h-6v-1.5zm-1.5 3h9v1.5h-9v-1.5zm0 3h9v1.5h-9v-1.5zm10.875 1.5c-.15.75-.6 1.35-1.275 1.65-.675.3-1.5.225-2.1-.225-.375-.3-.675-.75-.75-1.275l-1.2-6c-.15-.75.3-1.425 1.05-1.575l2.25-.45c.75-.15 1.425.3 1.575 1.05l1.5 6.825z"/>
    <path d="M7.5 18.75c-.15.75-.6 1.35-1.275 1.65-.675.3-1.5.225-2.1-.225-.375-.3-.675-.75-.75-1.275l-1.2-6c-.15-.75.3-1.425 1.05-1.575l2.25-.45c.75-.15 1.425.3 1.575 1.05L7.5 18.75z"/>
  </svg>
);

// Apple Music - Official Apple Music icon
const AppleMusicLogoIcon = ({ size = 24, color = "#FA243C" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

// Spotify - Official Spotify icon
const SpotifyLogoIcon = ({ size = 24, color = "#1DB954" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

// Shopify - Official Shopify icon
const ShopifyLogoIcon = ({ size = 24, color = "#96BF48" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
    <path d="M11.8 2c-4.8 0-8.5 3.5-8.5 8.3 0 3.7 2.3 6.7 5.8 8.1l-.6 2.8c0 .3.2.5.5.6h.1c.2 0 .4-.1.5-.3l.7-3.2c.3.1.7.1 1 .1.3 0 .7 0 1-.1l.7 3.2c.1.2.3.3.5.3h.1c.3 0 .5-.3.5-.6l-.6-2.8c3.5-1.4 5.8-4.4 5.8-8.1 0-4.8-3.7-8.3-8.5-8.3zm0 15.5c-.3 0-.6 0-.9-.1l.5-2.4h.8l.5 2.4c-.3.1-.6.1-.9.1zm-4.4-7.2c-.2 1.1-.5 2.2-.7 3.3-.2-.1-.4-.2-.7-.3.3-1.1.5-2.2.8-3.2.2.1.4.1.6.2zm.6-2.6c-.2 1-.5 2-.8 2.9-.2-.1-.4-.2-.7-.2.3-1 .6-1.9.9-2.8.2 0 .4.1.6.1zm.8 5.8c.3 1 .6 2 .8 3-.2-.1-.5-.2-.7-.2-.3-1-.6-2-.8-3 .2.1.5.2.7.2zm.6-2.7c-.3 1-.6 1.9-.8 2.9-.2-.1-.4-.1-.6-.2.3-.9.6-1.9.9-2.8.2 0 .3.1.5.1zm2.3-6.3h1.7v1.5h-1.7v1.5h1.7v1.5h-1.7c0 1.5.2 2.7.5 3.6-.3.1-.5.2-.8.2-.4-1.1-.6-2.4-.6-3.8h-1.6v-1.5h1.6V7.9h-1.6V6.4h1.6V4.9h1.7v1.5zm2.5 1.8c.2 0 .5 0 .7.1.3 1 .6 1.9.9 2.9-.2-.1-.4-.1-.6-.2-.3-.9-.5-1.9-.8-2.9.2 0 .4-.1.6-.1zm.9 2.9c-.2.1-.4.1-.7.2.3-1 .5-2 .8-2.9.2.1.4.1.7.2-.3 1-.5 1.9-.8 2.7zm.6 2.6c-.2.1-.5.1-.7.2.3 1 .6 2 .8 3-.2 0-.5-.1-.7-.2-.2-1-.5-2-.8-3 .2.1.5.2.7.2zm-1.4-3.9c.3 1 .5 2.2.8 3.3-.2.1-.5.2-.7.3-.2-1.1-.5-2.2-.8-3.3.3.1.5.1.7.1z"/>
  </svg>
);

// OnlyFans - Official OnlyFans icon
const OnlyFansLogoIcon = ({ size = 24, color = "#00AFF0" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
  </svg>
);

// Fanfix - Custom gradient badge with check (matches provided asset)
const FanfixLogoIcon = ({ size = 24, color = "#111827" }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="fanfix-gradient" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="50%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#22d3ee" />
      </linearGradient>
    </defs>
    {/* Dark rounded background, like the app icon */}
    <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#111827" />
    {/* Soft gradient badge */}
    <circle cx="12" cy="12" r="7" fill="url(#fanfix-gradient)" />
    {/* Check mark */}
    <path
      d="M9 12.5L11 14.5L15 10.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Cameo - Official Cameo icon
const CameoLogoIcon = ({ size = 24, color = "#000000" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
  </svg>
);

// CashApp - Official CashApp icon
const CashAppLogoIcon = ({ size = 24, color = "#00D632" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h-2v-2h2v-2H9v-2h2V6h2v2h2v2h-2v2h2v2h-2z"/>
  </svg>
);

// Famous Birthdays - Official Famous Birthdays icon
const FamousBirthdaysLogoIcon = ({ size = 24, color = "#FF6B6B" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

// Passes - Official Passes icon
const PassesLogoIcon = ({ size = 24, color = "#6366F1" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l6.9 3.45L12 11.09 5.1 7.63 12 4.18zM4 8.82l7 3.5v7.36l-7-3.5V8.82zm9 10.86v-7.36l7-3.5v7.36l-7 3.5z"/>
  </svg>
);

// PayPal - Official PayPal icon
const PayPalLogoIcon = ({ size = 24, color = "#003087" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.396a.771.771 0 0 1 .757-.64h6.894c2.437 0 4.285.583 5.195 1.69.856 1.04 1.137 2.568.811 4.535-.01.058-.02.114-.03.17-.656 4.186-2.788 5.897-7.4 5.897h-1.588c-.367 0-.68.268-.738.632l-1.073 6.458a.641.641 0 0 1-.632.552l-.723.047a.639.639 0 0 1-.673-.55z"/>
  </svg>
);

// Threads - Official Threads icon (uses currentColor so it inverts automatically on dark backgrounds)
const ThreadsLogoIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
    <path d="M12.6 1.4c-4.6.3-8.1 3.8-8.1 8.1 0 2.2.8 4.2 2.2 5.7.2.2.2.5 0 .7-.2.2-.5.2-.7 0-1.6-1.7-2.5-3.9-2.5-6.4C3.5 4.3 7.5.3 12.4.3c4.9 0 8.9 4 8.9 8.9 0 2.5-.9 4.7-2.5 6.4-.2.2-.5.2-.7 0-.2-.2-.2-.5 0-.7 1.4-1.5 2.2-3.5 2.2-5.7 0-4.3-3.5-7.8-7.7-7.8z"/>
  </svg>
);

// Other - Generic link icon
const OtherLogoIcon = ({ size = 24, color = "#6B7280" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
    <path d="M4 12a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1H4v7zM13 20a1 1 0 0 1 1 1v-7a1 1 0 0 1-1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-7zM17.59 5.41L5.41 17.59l-1.42-1.41L16.17 4l1.42 1.41z"/>
  </svg>
);

// Pinterest
const PinterestLogoIcon = ({ size = 24, color = "#BD081C" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.05 8.97 7.35 10.6-.1-.9-.2-2.27.04-3.24.22-.94 1.42-5.98 1.42-5.98s-.36-.73-.36-1.8c0-1.68.97-2.94 2.18-2.94 1.03 0 1.53.77 1.53 1.7 0 1.03-.66 2.57-.99 4-.28 1.19.6 2.16 1.78 2.16 2.14 0 3.78-2.26 3.78-5.52 0-2.88-2.07-4.9-5.03-4.9-3.43 0-5.44 2.57-5.44 5.23 0 1.03.4 2.14.9 2.75.1.12.11.22.08.34l-.33 1.33c-.04.18-.15.22-.35.13-1.31-.61-2.13-2.52-2.13-4.06 0-3.31 2.41-6.35 6.95-6.35 3.65 0 6.48 2.6 6.48 6.07 0 3.63-2.29 6.55-5.47 6.55-1.07 0-2.08-.56-2.43-1.25l-.65 2.48c-.24.93-.89 2.09-1.33 2.8.99.31 2.04.47 3.12.47 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
  </svg>
);

// Discord
const DiscordLogoIcon = ({ size = 24, color = "#5865F2" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

// Twitch
const TwitchLogoIcon = ({ size = 24, color = "#9146FF" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm16.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
  </svg>
);

// Reddit
const RedditLogoIcon = ({ size = 24, color = "#FF4500" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

// Telegram
const TelegramLogoIcon = ({ size = 24, color = "#0088cc" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.87 8.801c-.141.625-.537.778-1.084.481l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.12l-6.87 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
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
    case 'amazonwishlist':
    case 'amazon':
      return <AmazonWishlistLogoIcon size={size} color={color} />;
    case 'applemusic':
    case 'apple music':
      return <AppleMusicLogoIcon size={size} color={color} />;
    case 'spotify':
      return <SpotifyLogoIcon size={size} color={color} />;
    case 'shopify':
      return <ShopifyLogoIcon size={size} color={color} />;
    case 'onlyfans':
    case 'only fans':
      return <OnlyFansLogoIcon size={size} color={color} />;
    case 'fanfix':
      return <FanfixLogoIcon size={size} color={color} />;
    case 'cameo':
      return <CameoLogoIcon size={size} color={color} />;
    case 'cashapp':
    case 'cash app':
      return <CashAppLogoIcon size={size} color={color} />;
    case 'famousbirthdays':
    case 'famous birthdays':
      return <FamousBirthdaysLogoIcon size={size} color={color} />;
    case 'passes':
      return <PassesLogoIcon size={size} color={color} />;
    case 'paypal':
      return <PayPalLogoIcon size={size} color={color} />;
    case 'threads':
      return <ThreadsLogoIcon size={size} color={color} />;
    case 'other':
      return <OtherLogoIcon size={size} color={color} />;
    default:
      return null;
  }
};
