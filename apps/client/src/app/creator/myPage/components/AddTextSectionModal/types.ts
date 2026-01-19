import { BaseModalProps, TextSectionData } from '../shared/types';
import type { TextSection } from '../MobilePreview/types';

export interface AddTextSectionModalProps extends BaseModalProps {
  editingSection?: TextSection | null;
  onAdd: (data: TextSectionData) => void;
  onUpdate?: (id: string, data: TextSectionData) => void;
  onDelete?: (id: string) => void;
}

