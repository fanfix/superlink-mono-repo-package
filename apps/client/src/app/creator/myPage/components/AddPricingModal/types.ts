import type { BaseModalProps } from '../shared/types';

export interface Pricing {
  id: string;
  title: string;
  price: string;
}

export interface AddPricingModalProps extends BaseModalProps {
  onAdd?: (data: { title: string; price: string }) => void;
  onUpdate?: (id: string, data: { title: string; price: string }) => void;
  onDelete?: (id: string) => void;
  editingPricing?: Pricing | null;
}

