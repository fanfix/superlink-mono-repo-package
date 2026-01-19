import { BaseModalProps } from '../shared/types';
import type { BrandKitItem } from '../MobilePreview/types';

export interface AddBrandKitModalProps extends BaseModalProps {
  editingItem?: BrandKitItem | null;
  onAdd: (thumbnail: File | null, description: string) => void;
  onDelete?: () => void;
}

