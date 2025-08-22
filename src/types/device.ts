export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  location: string;
  status: DeviceStatus;
  currentConfig: DeviceConfiguration | null;
  metadata: DeviceMetadata;
  serialNumber: string;
}

export enum DeviceType {
  IPAD_PRO = 'ipad_pro',
  IPAD_AIR = 'ipad_air',
  MACBOOK_PRO = 'macbook_pro',
  IPHONE = 'iphone'
}

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  CONFIGURING = 'configuring',
  ERROR = 'error'
}

export interface DeviceConfiguration {
  id: string;
  template: string;
  appliedAt: string;
  appliedBy: string;
}

export interface DeviceMetadata {
  serialNumber: string;
  osVersion: string;
  lastSeen: string;
}