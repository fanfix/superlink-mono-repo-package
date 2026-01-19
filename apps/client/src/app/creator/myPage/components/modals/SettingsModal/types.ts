import { BaseModalProps } from '../../shared/types';

export type SettingsTab = 'my-account' | 'monetization' | 'tipping-history' | 'manage-access' | 'email-support' | 'signout';

export interface SettingsModalProps extends BaseModalProps {}

export interface SettingsTabItem {
  id: SettingsTab;
  label: string;
}

