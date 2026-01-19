import type { BaseModalProps } from '../shared/types';

export interface Engagement {
  id: string;
  title: string;
  count: string;
}

export interface AddEngagementModalProps extends BaseModalProps {
  onAdd?: (data: { title: string; count: string }) => void;
  onUpdate?: (id: string, data: { title: string; count: string }) => void;
  onDelete?: (id: string) => void;
  editingEngagement?: Engagement | null;
}

