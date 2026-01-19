import { BaseModalProps, TextSectionData } from '../shared/types';
import type { TextSection } from '../MobilePreview/types';

export interface AddEmailSectionModalProps extends BaseModalProps {
  editingSection?: TextSection | null;
  onAdd: (data: TextSectionData) => void;
  onUpdate?: (id: string, data: TextSectionData) => void;
  onDelete?: (id: string) => void;
}

