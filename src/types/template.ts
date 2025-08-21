import type { DeviceType } from './device';

export interface ConfigurationTemplate {
  id: string;
  name: string;
  description: string;
  deviceTypes: DeviceType[];
  settings: TemplateSettings;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface TemplateSettings {
  network: NetworkSettings;
  vpn: VPNSettings;
  apps: AppSettings;
  security: SecuritySettings;
}

export interface NetworkSettings {
  ssid: string;
  security: 'WPA2' | 'WPA3';
  vlan: number;
}

export interface VPNSettings {
  enabled: boolean;
  server?: string;
}

export interface AppSettings {
  required: string[];
  blocked: string[];
}

export interface SecuritySettings {
  passcode: 'required' | 'optional' | 'disabled';
  encryption: boolean;
  remoteWipe: boolean;
}