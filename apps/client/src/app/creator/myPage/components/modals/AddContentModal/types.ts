import { BaseModalProps } from '../../shared/types';
import type { ContentItem } from '../../MobilePreview/types';

export interface AddContentData {
  thumbnail?: string;
  title: string;
  url: string;
  isEmail: boolean;
  /** Shown and sent when adding/editing item in a parallel section */
  content?: string;
}

export interface AddContentModalProps extends BaseModalProps {
  sectionId: string;
  /** When 'parallel-row', show extra Content input and pass in onAdd data */
  sectionLayout?: 'list' | 'row' | 'parallel-row';
  editingItem?: ContentItem | null;
  onAdd: (sectionId: string, data: AddContentData) => void;
  onDelete?: (sectionId: string, itemId: string) => void;
}
