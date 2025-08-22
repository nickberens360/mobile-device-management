import type { DeviceType } from './device';

export type { DeviceType };

export interface ConfigurationTemplate {
  id: string;
  name: string;
  description: string;
  deviceTypes: DeviceType[];
  settings: TemplateSettings;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  version?: string;
}

export interface TemplateSettings {
  network: NetworkSettings;
  vpn?: VPNSettings;
  apps?: AppSettings;
  applications?: string[];
  security: SecuritySettings;
}

export interface NetworkSettings {
  ssid: string;
  security?: 'WPA2' | 'WPA3';
  securityType?: string;
  vlan?: number;
  autoConnect?: boolean;
  hidden?: boolean;
}

export interface VPNSettings {
  enabled: boolean;
  server?: string;
  protocol?: string;
}

export interface AppSettings {
  required: string[];
  blocked: string[];
}

export interface SecuritySettings {
  passcode?: 'required' | 'optional' | 'disabled';
  encryption: boolean;
  remoteWipe: boolean;
}