import { BaseModalProps } from '../shared/types';

export interface EditSocialLinkModalProps extends BaseModalProps {
  link: {
    id: string;
    platform: string;
    url: string;
  } | null;
  onUpdate: (id: string, platform: string, url: string, username?: string) => void;
  onDelete: (id: string) => void;
}

