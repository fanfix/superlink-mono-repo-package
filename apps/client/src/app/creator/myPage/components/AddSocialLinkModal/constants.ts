export interface SocialPlatform {
  value: string;
  label: string;
  urlPrefix: string;
  /** When true, user enters full URL in one field (no prefix + username). */
  fullUrl?: boolean;
  /** When 'email', show email input with validation and store as mailto:... */
  inputType?: 'url' | 'email';
}

/** Simple email validation regex */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SOCIAL_MEDIA_PLATFORMS: SocialPlatform[] = [
  { value: 'Instagram', label: 'Instagram', urlPrefix: 'https://www.instagram.com/' },
  { value: 'Facebook', label: 'Facebook', urlPrefix: 'https://www.facebook.com/' },
  { value: 'Twitter', label: 'Twitter/X', urlPrefix: 'https://twitter.com/' },
  { value: 'YouTube', label: 'YouTube', urlPrefix: 'https://www.youtube.com/@' },
  { value: 'TikTok', label: 'TikTok', urlPrefix: 'https://www.tiktok.com/@' },
  { value: 'LinkedIn', label: 'LinkedIn', urlPrefix: 'https://www.linkedin.com/in/' },
  { value: 'Snapchat', label: 'Snapchat', urlPrefix: 'https://www.snapchat.com/add/' },
  { value: 'Pinterest', label: 'Pinterest', urlPrefix: 'https://www.pinterest.com/' },
  { value: 'Discord', label: 'Discord', urlPrefix: 'https://discord.gg/' },
  { value: 'Twitch', label: 'Twitch', urlPrefix: 'https://www.twitch.tv/' },
  { value: 'Reddit', label: 'Reddit', urlPrefix: 'https://www.reddit.com/user/' },
  { value: 'Telegram', label: 'Telegram', urlPrefix: 'https://t.me/' },
  { value: 'Email', label: 'Email', urlPrefix: 'mailto:', inputType: 'email' },
  { value: 'AmazonWishlist', label: 'Amazon Wishlist', urlPrefix: '', fullUrl: true },
  { value: 'AppleMusic', label: 'Apple Music', urlPrefix: '', fullUrl: true },
  { value: 'Spotify', label: 'Spotify', urlPrefix: 'https://open.spotify.com/' },
  { value: 'OnlyFans', label: 'OnlyFans', urlPrefix: 'https://onlyfans.com/' },
  { value: 'Fanfix', label: 'Fanfix', urlPrefix: 'https://fanfix.io/' },
  { value: 'Cameo', label: 'Cameo', urlPrefix: 'https://www.cameo.com/' },
  { value: 'CashApp', label: 'CashApp', urlPrefix: 'https://cash.app/$' },
  { value: 'FamousBirthdays', label: 'Famous Birthdays', urlPrefix: '', fullUrl: true },
  { value: 'Threads', label: 'Threads', urlPrefix: 'https://www.threads.net/@' },
  { value: 'Other', label: 'Other', urlPrefix: '' },
];
