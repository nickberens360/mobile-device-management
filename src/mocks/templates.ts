import { ConfigurationTemplate } from '@/types/template';
import { DeviceType } from '@/types/device';

export const mockTemplates: ConfigurationTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Film Production - Crew Devices',
    description: 'Standard configuration for crew devices on film sets',
    deviceTypes: [DeviceType.IPAD_PRO, DeviceType.IPAD_AIR],
    settings: {
      network: {
        ssid: 'PROD_WIFI',
        security: 'WPA3',
        vlan: 100
      },
      vpn: {
        enabled: true,
        server: 'vpn.nbcuni.com'
      },
      apps: {
        required: ['NBC Production Suite', 'Slack', 'Microsoft Teams'],
        blocked: ['TikTok', 'Facebook', 'Instagram']
      },
      security: {
        passcode: 'required',
        encryption: true,
        remoteWipe: true
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T12:00:00Z',
    createdBy: 'admin@nbcuni.com'
  },
  {
    id: 'tpl-2',
    name: 'Theme Park - Staff Devices',
    description: 'Configuration for theme park staff mobile devices',
    deviceTypes: [DeviceType.IPHONE, DeviceType.IPAD_AIR],
    settings: {
      network: {
        ssid: 'STAFF_WIFI',
        security: 'WPA3',
        vlan: 200
      },
      vpn: {
        enabled: false
      },
      apps: {
        required: ['Universal Parks App', 'Staff Portal', 'Emergency Alert'],
        blocked: ['Gaming Apps']
      },
      security: {
        passcode: 'required',
        encryption: true,
        remoteWipe: true
      }
    },
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-08T10:00:00Z',
    createdBy: 'park.admin@nbcuni.com'
  },
  {
    id: 'tpl-3',
    name: 'Corporate - Office Devices',
    description: 'Standard corporate office device configuration',
    deviceTypes: [DeviceType.MACBOOK_PRO, DeviceType.IPAD_PRO],
    settings: {
      network: {
        ssid: 'CORP_WIFI',
        security: 'WPA3',
        vlan: 50
      },
      vpn: {
        enabled: true,
        server: 'corporate-vpn.nbcuni.com'
      },
      apps: {
        required: ['Microsoft Office', 'Zoom', 'Slack', 'NBC Apps'],
        blocked: []
      },
      security: {
        passcode: 'required',
        encryption: true,
        remoteWipe: true
      }
    },
    createdAt: '2023-12-15T00:00:00Z',
    updatedAt: '2024-01-05T14:00:00Z',
    createdBy: 'it.admin@nbcuni.com'
  },
  {
    id: 'tpl-4',
    name: 'Press Event - Media Devices',
    description: 'Configuration for press and media event devices',
    deviceTypes: [DeviceType.IPAD_PRO, DeviceType.IPHONE],
    settings: {
      network: {
        ssid: 'MEDIA_WIFI',
        security: 'WPA2',
        vlan: 300
      },
      vpn: {
        enabled: false
      },
      apps: {
        required: ['NBC Press Kit', 'Media Portal'],
        blocked: []
      },
      security: {
        passcode: 'optional',
        encryption: false,
        remoteWipe: false
      }
    },
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-12T16:00:00Z',
    createdBy: 'media.admin@nbcuni.com'
  },
  {
    id: 'tpl-5',
    name: 'Broadcast Production - MacBook Setup',
    description: 'Specialized configuration for broadcast and live production MacBooks',
    deviceTypes: [DeviceType.MACBOOK_PRO],
    settings: {
      network: {
        ssid: 'BROADCAST_NET',
        security: 'WPA3',
        vlan: 400
      },
      vpn: {
        enabled: true,
        server: 'broadcast-vpn.nbcuni.com'
      },
      apps: {
        required: ['Final Cut Pro', 'Adobe Creative Suite', 'Slack', 'NBC Broadcast Tools'],
        blocked: ['Social Media Apps', 'Gaming Apps']
      },
      security: {
        passcode: 'required',
        encryption: true,
        remoteWipe: true
      }
    },
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-14T09:00:00Z',
    createdBy: 'broadcast.admin@nbcuni.com'
  },
  {
    id: 'tpl-6',
    name: 'Mobile Guest Services',
    description: 'Configuration for guest-facing mobile devices in theme parks',
    deviceTypes: [DeviceType.IPHONE, DeviceType.IPAD_AIR],
    settings: {
      network: {
        ssid: 'GUEST_SERVICES',
        security: 'WPA2',
        vlan: 500
      },
      vpn: {
        enabled: false
      },
      apps: {
        required: ['Universal App', 'Guest Services Portal', 'Translation App'],
        blocked: ['Personal Apps']
      },
      security: {
        passcode: 'optional',
        encryption: false,
        remoteWipe: true
      }
    },
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-13T11:00:00Z',
    createdBy: 'guest.services@nbcuni.com'
  },
  {
    id: 'tpl-7',
    name: 'Executive Mobile Setup',
    description: 'High-security configuration for executive and management devices',
    deviceTypes: [DeviceType.IPHONE, DeviceType.IPAD_PRO, DeviceType.MACBOOK_PRO],
    settings: {
      network: {
        ssid: 'EXECUTIVE_NET',
        security: 'WPA3',
        vlan: 10
      },
      vpn: {
        enabled: true,
        server: 'executive-vpn.nbcuni.com'
      },
      apps: {
        required: ['Microsoft Office', 'Zoom', 'Slack', 'NBC Executive Dashboard'],
        blocked: []
      },
      security: {
        passcode: 'required',
        encryption: true,
        remoteWipe: true
      }
    },
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-11T15:00:00Z',
    createdBy: 'exec.admin@nbcuni.com'
  }
];