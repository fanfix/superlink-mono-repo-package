export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: React.ReactNode;
  isDropdown?: boolean;
}

export interface SocialLinksSectionProps {
  links?: SocialLink[];
  onAddLink?: (platform: string, url: string, isDropdown?: boolean) => void;
  onRemoveLink?: (id: string) => void;
  onUpdateLink?: (id: string, platform: string, url: string, username?: string, isDropdown?: boolean) => void;
  onReorder?: (newLinks: SocialLink[]) => void;
}

