import { BaseModalProps } from '../shared/types';

export interface AddSocialLinkModalProps extends BaseModalProps {
  onAdd: (platform: string, url: string) => void;
}

