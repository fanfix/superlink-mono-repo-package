export interface CustomButton {
  id: string;
  buttonText: string;
  type: 'email' | 'url';
  value: string;
  isActive: boolean;
}

export interface CustomButtonsSectionProps {
  buttons?: CustomButton[];
  onAddButton?: (data: { buttonText: string; type: 'email' | 'url'; value: string }) => void;
  onUpdateButton?: (id: string, data: { buttonText: string; type: 'email' | 'url'; value: string }) => void;
  onDeleteButton?: (id: string) => void;
  onReorder?: (buttons: CustomButton[]) => void;
  onToggleActive?: (id: string) => void;
}
