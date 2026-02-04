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
  { value: 'AmazonWishlist', label: 'Amazon Wishlist', urlPrefix: 'https://www.amazon.com/hz/wishlist/ls/' },
  { value: 'AppleMusic', label: 'Apple Music', urlPrefix: 'https://music.apple.com/' },
  { value: 'Spotify', label: 'Spotify', urlPrefix: 'https://open.spotify.com/' },
  { value: 'Shopify', label: 'Shopify', urlPrefix: 'https://' },
  { value: 'OnlyFans', label: 'OnlyFans', urlPrefix: 'https://onlyfans.com/' },
  { value: 'Fanfix', label: 'Fanfix', urlPrefix: 'https://fanfix.io/' },
  { value: 'Cameo', label: 'Cameo', urlPrefix: 'https://www.cameo.com/' },
  { value: 'CashApp', label: 'CashApp', urlPrefix: 'https://cash.app/$' },
  { value: 'FamousBirthdays', label: 'Famous Birthdays', urlPrefix: 'https://www.famousbirthdays.com/' },
  { value: 'Passes', label: 'Passes', urlPrefix: 'https://passes.com/' },
  { value: 'PayPal', label: 'PayPal', urlPrefix: 'https://paypal.me/' },
  { value: 'Threads', label: 'Threads', urlPrefix: 'https://www.threads.net/@' },
  { value: 'Other', label: 'Other', urlPrefix: '' },
];
