import { Device, DeviceType, DeviceStatus } from '@/types/device';

export const mockDevices: Device[] = [
  {
    id: 'dev-1',
    name: 'iPad-Prod-001',
    type: DeviceType.IPAD_PRO,
    location: 'loc-1',
    status: DeviceStatus.ONLINE,
    currentConfig: {
      template: 'tpl-1',
      appliedAt: '2024-01-15T10:30:00Z',
      appliedBy: 'john.doe@nbcuni.com'
    },
    metadata: {
      serialNumber: 'ABC123',
      osVersion: '17.2',
      lastSeen: '2024-01-15T14:22:00Z'
    }
  },
  {
    id: 'dev-2',
    name: 'iPad-Prod-002',
    type: DeviceType.IPAD_PRO,
    location: 'loc-1',
    status: DeviceStatus.ONLINE,
    currentConfig: {
      template: 'tpl-1',
      appliedAt: '2024-01-15T10:30:00Z',
      appliedBy: 'john.doe@nbcuni.com'
    },
    metadata: {
      serialNumber: 'ABC124',
      osVersion: '17.2',
      lastSeen: '2024-01-15T14:20:00Z'
    }
  },
  {
    id: 'dev-3',
    name: 'MacBook-Edit-001',
    type: DeviceType.MACBOOK_PRO,
    location: 'loc-1',
    status: DeviceStatus.OFFLINE,
    currentConfig: null,
    metadata: {
      serialNumber: 'MBP001',
      osVersion: '14.2',
      lastSeen: '2024-01-14T18:45:00Z'
    }
  },
  {
    id: 'dev-4',
    name: 'iPhone-Staff-001',
    type: DeviceType.IPHONE,
    location: 'loc-2',
    status: DeviceStatus.ONLINE,
    currentConfig: {
      template: 'tpl-2',
      appliedAt: '2024-01-10T09:00:00Z',
      appliedBy: 'jane.smith@nbcuni.com'
    },
    metadata: {
      serialNumber: 'IPH001',
      osVersion: '17.2.1',
      lastSeen: '2024-01-15T14:30:00Z'
    }
  },
  {
    id: 'dev-5',
    name: 'iPad-Park-001',
    type: DeviceType.IPAD_AIR,
    location: 'loc-2',
    status: DeviceStatus.CONFIGURING,
    currentConfig: null,
    metadata: {
      serialNumber: 'IPA001',
      osVersion: '17.1',
      lastSeen: '2024-01-15T14:31:00Z'
    }
  },
  {
    id: 'dev-6',
    name: 'MacBook-Corp-001',
    type: DeviceType.MACBOOK_PRO,
    location: 'loc-3',
    status: DeviceStatus.ONLINE,
    currentConfig: {
      template: 'tpl-3',
      appliedAt: '2024-01-05T11:00:00Z',
      appliedBy: 'admin@nbcuni.com'
    },
    metadata: {
      serialNumber: 'MBC001',
      osVersion: '14.2.1',
      lastSeen: '2024-01-15T14:25:00Z'
    }
  },
  {
    id: 'dev-7',
    name: 'iPad-Corp-001',
    type: DeviceType.IPAD_PRO,
    location: 'loc-3',
    status: DeviceStatus.ERROR,
    currentConfig: {
      template: 'tpl-3',
      appliedAt: '2024-01-05T11:00:00Z',
      appliedBy: 'admin@nbcuni.com'
    },
    metadata: {
      serialNumber: 'IPC001',
      osVersion: '17.0',
      lastSeen: '2024-01-15T10:00:00Z'
    }
  }
];