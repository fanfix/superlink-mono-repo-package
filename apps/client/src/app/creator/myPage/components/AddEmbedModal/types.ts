import type { BaseModalProps } from '../shared/types';

export interface AddEmbedModalProps extends BaseModalProps {
  onAdd: (data: { name: string; url: string; size: string; imageURL?: string }) => void;
  /** When set, modal is in edit mode; on submit call onUpdate instead of onAdd */
  editingItem?: { id: string; title: string; url?: string; size?: string } | null;
  onUpdate?: (sectionId: string, linkId: string, data: { name: string; url: string; size: string; imageURL?: string }) => void;
  customSectionId: string;
}
