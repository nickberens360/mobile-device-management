export interface ConfigurationHistory {
  id: string;
  deviceId: string;
  templateId: string;
  templateName: string;
  appliedAt: string;
  appliedBy: string;
  status: 'success' | 'failed' | 'partial';
  affectedDevices: number;
  rollbackAvailable: boolean;
}