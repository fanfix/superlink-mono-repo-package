export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: React.ReactNode;
}

export interface SocialLinksSectionProps {
  links?: SocialLink[];
  onAddLink?: (platform: string, url: string) => void;
  onRemoveLink?: (id: string) => void;
  onUpdateLink?: (id: string, platform: string, url: string, username?: string) => void;
  onReorder?: (newLinks: SocialLink[]) => void;
}

