import { BaseModalProps, CustomButtonData } from '../shared/types';

export interface AddCustomButtonModalProps extends BaseModalProps {
  onAdd: (data: CustomButtonData) => void;
  onUpdate?: (id: string, data: CustomButtonData) => void;
  onDelete?: (id: string) => void;
  editingButton?: {
    id: string;
    buttonText: string;
    type: 'email' | 'url';
    value: string;
  } | null;
}

