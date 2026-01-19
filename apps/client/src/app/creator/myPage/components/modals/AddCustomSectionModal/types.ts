import { BaseModalProps } from '../../shared/types';
import type { CustomSection } from '../../MobilePreview/types';

export type CustomSectionLayout = 'list' | 'row' | 'parallel-row';

export interface AddCustomSectionModalProps extends BaseModalProps {
  editingSection?: CustomSection | null;
  onAdd: (sectionName: string, layout: CustomSectionLayout, useContentImageAsBackground: boolean) => void;
  onUpdate?: (id: string, sectionName: string, layout: CustomSectionLayout, useContentImageAsBackground: boolean) => void;
  onDelete?: (id: string) => void;
}

