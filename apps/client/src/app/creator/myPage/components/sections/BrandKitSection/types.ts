import type { BrandKitItem } from '../../MobilePreview/types';

export interface BrandKitSectionProps {
  brandKitItems?: BrandKitItem[];
  onAddBrandKit?: (thumbnail: File | null, description: string) => void;
  onUpdateBrandKit?: (id: string, thumbnail: File | null, description: string) => void;
  onDeleteBrandKit?: (id: string) => void;
  onReorderBrandKit?: (itemIds: string[]) => void;
}

