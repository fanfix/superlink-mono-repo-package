export interface UploadContentData {
  title: string;
  price: string;
  file?: File;
  discount?: string;
  countdownMinutes?: string;
  countdownSeconds?: string;
  cropWidth?: number;
  cropHeight?: number;
  cropX?: number;
  cropY?: number;
  titleColor?: string;
  icon?: string;
}

export interface UploadContentModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: UploadContentData) => void;
  onUpdate?: (id: string, data: UploadContentData) => void;
  onDelete?: (id: string) => void;
  editingContent?: {
    id: string;
    title: string;
    price: string;
    imageUrl?: string;
    discount?: string;
    countdownMinutes?: string;
    countdownSeconds?: string;
  } | null;
}

