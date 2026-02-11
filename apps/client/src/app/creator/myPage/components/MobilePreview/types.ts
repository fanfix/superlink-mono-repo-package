export interface ContentItem {
  id: string;
  title: string;
  price: string;
  imageUrl?: string;
  discount?: string;
  countdownMinutes?: string;
  countdownSeconds?: string;
  url?: string;
  isEmail?: boolean;
  /** Item-level content (e.g. for parallel section links), from API */
  content?: string;
}

export interface CustomSection {
  id: string;
  name: string;
  layout: 'list' | 'row' | 'parallel-row';
  useContentImageAsBackground: boolean;
  items: ContentItem[];
  sectionType?: 'links' | 'embeds' | 'email' | 'text' | 'unlock_content' | 'brand_kit';
  /** Section-level content (e.g. for parallel-row), saved to DB when provided */
  sectionContent?: string;
}

export interface TextSection {
  id: string;
  title: string;
  content: string;
  type?: 'email' | 'text'; // 'email' for email sections, 'text' for text sections
}

export interface BrandKitItem {
  id: string;
  thumbnailUrl?: string;
  description: string;
}

export interface Engagement {
  id: string;
  title: string;
  count: string;
}

export interface Pricing {
  id: string;
  title: string;
  price: string;
}

export interface CustomButton {
  id: string;
  buttonText: string;
  type: 'email' | 'url';
  value: string;
  isActive: boolean;
}

export interface MobilePreviewProps {
  pageName: string;
  coverImage?: string;
  profileImage?: string;
  introMessage?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
    icon?: React.ReactNode;
  }>;
  backgroundColor?: string;
  backgroundImage?: string;
  selectedFont?: string;
  selectedTextColor?: string;
  selectedLayout?: 'layout1' | 'layout2';
  contentItems?: ContentItem[];
  customSections?: CustomSection[];
  textSections?: TextSection[];
  brandKitItems?: BrandKitItem[];
  engagements?: Engagement[];
  pricing?: Pricing[];
  customButtons?: CustomButton[];
  /** Show "Like this profile? Replicate it." CTA (e.g. on public profile view) */
  showReplicateCta?: boolean;
  /** Called when user clicks "Replicate this profile" (e.g. show login/replication modals) */
  onReplicateClick?: () => void;
  /** Show "Create own page" link below CTA; when set, clicking navigates via onCreateOwnPageClick */
  showCreateOwnPageLink?: boolean;
  /** Called when user clicks "Create own page" (e.g. navigate to signup) */
  onCreateOwnPageClick?: () => void;
  /** When true (e.g. public username page), sections use compact layout (3 cols, smaller gap/size). Mypage keeps default. */
  compactSectionLayout?: boolean;
}
