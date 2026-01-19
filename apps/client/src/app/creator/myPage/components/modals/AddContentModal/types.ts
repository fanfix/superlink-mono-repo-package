import { BaseModalProps } from '../../shared/types';
import type { ContentItem } from '../../MobilePreview/types';

export interface AddContentData {
  thumbnail?: string;
  title: string;
  url: string;
  isEmail: boolean;
}

export interface AddContentModalProps extends BaseModalProps {
  sectionId: string;
  editingItem?: ContentItem | null;
  onAdd: (sectionId: string, data: AddContentData) => void;
  onDelete?: (sectionId: string, itemId: string) => void;
}
