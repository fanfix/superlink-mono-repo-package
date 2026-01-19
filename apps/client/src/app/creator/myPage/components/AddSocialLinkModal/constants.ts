export interface SocialPlatform {
  value: string;
  label: string;
  urlPrefix: string;
}

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
];

