const platforms: Record<string, string> = {
  youtube: "YouTube",
  spotify: "Spotify",
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "Twitter",
  twitch: "Twitch",
  tiktok: "TikTok",
};

export const getEmbedPlatform = (embedLink: string): string | null => {
  if (!embedLink) return null;
  
  if (embedLink.includes("youtu.be")) {
    return "YouTube";
  }

  const regex = /(https?:\/\/)?(www\.)?(?<platform>youtube|spotify|instagram|facebook|twitter|twitch|tiktok)\.com/;
  const match = embedLink.match(regex);
  if (match && match.groups) {
    return platforms[match.groups.platform] || null;
  }
  
  return null;
};

export const embedSizes: Record<string, string[]> = {
  Instagram: ["Small", "Medium", "Large"],
  YouTube: ["Small", "Large"],
  Spotify: ["Small", "Large"],
  Facebook: [],
  Twitter: [],
  TikTok: [],
  RSS: [],
};

export const titleCharLimit = 50;
