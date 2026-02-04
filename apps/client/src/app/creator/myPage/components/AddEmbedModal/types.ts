import type { BaseModalProps } from '../shared/types';

export interface AddEmbedModalProps extends BaseModalProps {
  onAdd: (data: { name: string; url: string; size: string; imageURL?: string }) => void;
  customSectionId: string;
}
