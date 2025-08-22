import { Device, DeviceType, DeviceStatus } from '@/types/device';

export const mockDevices: Device[] = [
  {
    id: 'dev-1',
    name: 'iPad-Prod-001',
    type: DeviceType.IPAD_PRO,
    location: 'loc-1',
    status: DeviceStatus.ONLINE,
    serialNumber: 'ABC123',
    currentConfig: {
      id: 'cfg-1',
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
    serialNumber: 'ABC124',
    currentConfig: {
      id: 'cfg-2',
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
    serialNumber: 'MBP001',
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
    serialNumber: 'IPH001',
    currentConfig: {
      id: 'cfg-3',
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
    serialNumber: 'IPA001',
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
    serialNumber: 'MBC001',
    currentConfig: {
      id: 'cfg-4',
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
    serialNumber: 'IPC001',
    currentConfig: {
      id: 'cfg-5',
      template: 'tpl-3',
      appliedAt: '2024-01-05T11:00:00Z',
      appliedBy: 'admin@nbcuni.com'
    },
    metadata: {
      serialNumber: 'IPC001',
      osVersion: '17.0',
      lastSeen: '2024-01-15T10:00:00Z'
    }
  },
  // Universal Studios Hollywood devices (loc-4)
  {
    id: 'dev-8',
    name: 'iPhone-Park-001',
    type: DeviceType.IPHONE,
    location: 'loc-4',
    status: DeviceStatus.ONLINE,
    serialNumber: 'IPH002',
    currentConfig: {
      id: 'cfg-6',
      template: 'tpl-2',
      appliedAt: '2024-01-12T08:00:00Z',
      appliedBy: 'park.admin@nbcuni.com'
    },
    metadata: {
      serialNumber: 'IPH002',
      osVersion: '17.2.1',
      lastSeen: '2024-01-15T14:35:00Z'
    }
  },
  {
    id: 'dev-9',
    name: 'iPad-Park-002',
    type: DeviceType.IPAD_AIR,
    location: 'loc-4',
    status: DeviceStatus.ONLINE,
    serialNumber: 'IPA002',
    currentConfig: {
      id: 'cfg-7',
      template: 'tpl-2',
      appliedAt: '2024-01-12T08:00:00Z',
      appliedBy: 'park.admin@nbcuni.com'
    },
    metadata: {
      serialNumber: 'IPA002',
      osVersion: '17.1.2',
      lastSeen: '2024-01-15T14:33:00Z'
    }
  },
  {
    id: 'dev-10',
    name: 'iPad-Attraction-001',
    type: DeviceType.IPAD_PRO,
    location: 'loc-4',
    status: DeviceStatus.CONFIGURING,
    serialNumber: 'IPA003',
    currentConfig: null,
    metadata: {
      serialNumber: 'IPA003',
      osVersion: '17.2',
      lastSeen: '2024-01-15T14:00:00Z'
    }
  },
  // NBC Sports Production Center devices (loc-5)
  {
    id: 'dev-11',
    name: 'MacBook-Broadcast-001',
    type: DeviceType.MACBOOK_PRO,
    location: 'loc-5',
    status: DeviceStatus.ONLINE,
    serialNumber: 'MBB001',
    currentConfig: {
      id: 'cfg-8',
      template: 'tpl-4',
      appliedAt: '2024-01-08T07:00:00Z',
      appliedBy: 'broadcast.admin@nbcuni.com'
    },
    metadata: {
      serialNumber: 'MBB001',
      osVersion: '14.2.1',
      lastSeen: '2024-01-15T14:40:00Z'
    }
  },
  {
    id: 'dev-12',
    name: 'iPad-Media-001',
    type: DeviceType.IPAD_PRO,
    location: 'loc-5',
    status: DeviceStatus.ONLINE,
    serialNumber: 'IPM001',
    currentConfig: {
      id: 'cfg-9',
      template: 'tpl-4',
      appliedAt: '2024-01-08T07:00:00Z',
      appliedBy: 'broadcast.admin@nbcuni.com'
    },
    metadata: {
      serialNumber: 'IPM001',
      osVersion: '17.2',
      lastSeen: '2024-01-15T14:38:00Z'
    }
  },
  {
    id: 'dev-13',
    name: 'iPhone-Media-001',
    type: DeviceType.IPHONE,
    location: 'loc-5',
    status: DeviceStatus.OFFLINE,
    serialNumber: 'IPM002',
    currentConfig: null,
    metadata: {
      serialNumber: 'IPM002',
      osVersion: '17.1.1',
      lastSeen: '2024-01-14T16:20:00Z'
    }
  },
  // Additional devices for better demo coverage
  {
    id: 'dev-14',
    name: 'iPad-Prod-003',
    type: DeviceType.IPAD_AIR,
    location: 'loc-1',
    status: DeviceStatus.ONLINE,
    serialNumber: 'IPA004',
    currentConfig: {
      id: 'cfg-10',
      template: 'tpl-1',
      appliedAt: '2024-01-15T10:30:00Z',
      appliedBy: 'john.doe@nbcuni.com'
    },
    metadata: {
      serialNumber: 'IPA004',
      osVersion: '17.2',
      lastSeen: '2024-01-15T14:28:00Z'
    }
  },
  {
    id: 'dev-15',
    name: 'iPhone-Corp-001',
    type: DeviceType.IPHONE,
    location: 'loc-3',
    status: DeviceStatus.ONLINE,
    serialNumber: 'IPC002',
    currentConfig: {
      id: 'cfg-11',
      template: 'tpl-3',
      appliedAt: '2024-01-05T11:00:00Z',
      appliedBy: 'admin@nbcuni.com'
    },
    metadata: {
      serialNumber: 'IPC002',
      osVersion: '17.2.1',
      lastSeen: '2024-01-15T14:42:00Z'
    }
  }
];