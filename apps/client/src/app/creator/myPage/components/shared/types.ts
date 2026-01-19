/**
 * Shared types for modal components
 */
export interface BaseModalProps {
  open: boolean;
  onClose: () => void;
}

export interface TextSectionData {
  title: string;
  content: string;
}

export interface CustomButtonData {
  buttonText: string;
  type: 'email' | 'url';
  value: string;
}

