import type { BrandKitItem } from '../../MobilePreview/types';

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

export interface BrandKitSectionProps {
  brandKitItems?: BrandKitItem[];
  onAddBrandKit?: (thumbnail: File | null, description: string) => void;
  onUpdateBrandKit?: (id: string, thumbnail: File | null, description: string) => void;
  onDeleteBrandKit?: (id: string) => void;
  onReorderBrandKit?: (itemIds: string[]) => void;
  /** Nested child sections inside Brand Kit parent */
  engagements?: Engagement[];
  onAddEngagement?: (data: { title: string; count: string }) => void;
  onUpdateEngagement?: (id: string, data: { title: string; count: string }) => void;
  onDeleteEngagement?: (id: string) => void;
  onReorderEngagements?: (itemIds: string[]) => void;
  pricing?: Pricing[];
  onAddPricing?: (data: { title: string; price: string }) => void;
  onUpdatePricing?: (id: string, data: { title: string; price: string }) => void;
  onDeletePricing?: (id: string) => void;
  onReorderPricing?: (itemIds: string[]) => void;
}

