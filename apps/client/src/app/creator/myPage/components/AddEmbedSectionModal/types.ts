import { BaseModalProps } from '../shared/types';

export type EmbedLayout = 'list' | 'row';

export interface AddEmbedSectionModalProps extends BaseModalProps {
  onAdd: (sectionName: string, layout: EmbedLayout) => void;
}

