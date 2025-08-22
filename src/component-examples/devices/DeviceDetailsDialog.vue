<template>
  <ExampleComponentUsage
    :prop-items="propItems"
    :event-items="eventItems"
    :slot-items="slotItems"
    description="A dialog component for viewing detailed device information including status, configuration, and management actions."
  >
    <div>
      <v-btn @click="openDialog" color="primary">
        Open Device Details
      </v-btn>
      <DeviceDetailsDialog
        :device="selectedDevice"
        :model-value="showDialog"
        @update:model-value="showDialog = $event"
        @device-updated="handleDeviceUpdated"
        @dialog-closed="closeDialog"
      />
    </div>
    <template #[`item.actions`]="{item}">
      <v-select
        v-if="item.name === 'device'"
        v-model="selectedDeviceId"
        :items="deviceOptions"
        density="compact"
        hide-details
        @update:model-value="updateSelectedDevice"
      />
      <v-switch
        v-if="item.name === 'modelValue'"
        v-model="showDialog"
        density="compact"
        hide-details
      />
    </template>
  </ExampleComponentUsage>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DeviceDetailsDialog from '@/components/devices/DeviceDetailsDialog.vue';
import type { Device } from '@/types/device';
import { DeviceType, DeviceStatus } from '@/types/device';

const showDialog = ref(false);
const selectedDeviceId = ref('dev-1');

const mockDevices: Device[] = [
  {
    id: 'dev-1',
    name: 'iPad Pro - Stage 12-01',
    type: DeviceType.IPAD_PRO,
    status: DeviceStatus.ONLINE,
    location: 'loc-1',
    serialNumber: 'ABC123456789',
    lastSeen: new Date().toISOString(),
    metadata: {
      serialNumber: 'ABC123456789',
      osVersion: 'iOS 17.1',
      lastSeen: new Date().toISOString()
    },
    currentConfig: {
      id: 'config-1',
      template: 'tpl-1',
      appliedAt: new Date(Date.now() - 7200000).toISOString(),
      appliedBy: 'admin@nbcuni.com'
    }
  },
  {
    id: 'dev-2',
    name: 'MacBook Pro - Edit Bay 1',
    type: DeviceType.MACBOOK_PRO,
    status: DeviceStatus.ERROR,
    location: 'loc-2',
    serialNumber: 'DEF987654321',
    lastSeen: new Date(Date.now() - 1800000).toISOString(),
    metadata: {
      serialNumber: 'DEF987654321',
      osVersion: 'macOS 14.1',
      lastSeen: new Date(Date.now() - 1800000).toISOString()
    },
    currentConfig: null
  },
  {
    id: 'dev-3',
    name: 'iPhone - Security Team',
    type: DeviceType.IPHONE,
    status: DeviceStatus.OFFLINE,
    location: 'loc-1',
    serialNumber: 'GHI456789123',
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
    metadata: {
      serialNumber: 'GHI456789123',
      osVersion: 'iOS 17.0',
      lastSeen: new Date(Date.now() - 3600000).toISOString()
    },
    currentConfig: null
  }
];

const selectedDevice = computed(() => 
  mockDevices.find(d => d.id === selectedDeviceId.value) || mockDevices[0]
);

const deviceOptions = mockDevices.map(device => ({
  title: `${device.name} (${device.status})`,
  value: device.id
}));

const openDialog = () => {
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const updateSelectedDevice = (deviceId: string) => {
  selectedDeviceId.value = deviceId;
};

const handleConfigure = (device: Device) => {
  console.log('Configure device:', device);
  closeDialog();
};

const handleDeviceUpdated = (device: Device) => {
  console.log('Device updated:', device);
  closeDialog();
};

const propItems = [
  {
    name: 'device',
    type: 'Device',
    default: null,
    description: 'Device to display details for'
  },
  {
    name: 'modelValue',
    type: 'boolean',
    default: false,
    description: 'Controls dialog visibility (v-model)'
  }
];

const eventItems = [
  {
    event: 'update:model-value',
    payload: 'boolean',
    description: 'Emitted when dialog visibility changes (v-model).',
  },
  {
    event: 'device-updated',
    payload: 'Device',
    description: 'Emitted when the device is successfully updated.',
  },
  {
    event: 'dialog-closed',
    payload: 'void',
    description: 'Emitted when the dialog is closed.',
  },
];

const slotItems = [
  {
    name: 'actions',
    content: 'action buttons',
    description: 'Slot for custom action buttons in the dialog footer.',
  },
  {
    name: 'additional-info',
    content: 'extra content',
    description: 'Slot for additional device information sections.',
  },
];
</script>