import type { ReactNode } from 'react';

/**
 * Social Link Type Definition
 * Represents a social media platform link with icon
 */
export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: ReactNode;
}

/**
 * Page Layout Options
 */
export type PageLayout = 'layout1' | 'layout2';

/**
 * Default values for page state
 */
export const DEFAULT_PAGE_STATE = {
  pageUrl: 'mmuaz007',
  pageName: 'mmuaz007',
  introMessage: '',
  selectedFont: 'Inter',
  selectedTextColor: '#000000',
  selectedLayout: 'layout1' as PageLayout,
  backgroundColor: '#FFFFFF',
  coverImage: '',
  profileImage: '',
  backgroundImage: '',
} as const;
