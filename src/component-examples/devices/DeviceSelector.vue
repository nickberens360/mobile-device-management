<template>
  <ExampleComponentUsage
    :prop-items="propItems"
    :event-items="eventItems"
    :slot-items="slotItems"
    description="A component for selecting devices with filtering, search, and multi-select capabilities."
  >
    <LocationSelector
      :devices="availableDevices"
      :selected-devices="selectedDevices"
      :multiple="multiple"
      :show-filters="showFilters"
      :filter-by-location="filterByLocation"
      :filter-by-type="filterByType"
      @update:selected-devices="updateSelectedDevices"
      @device-selected="handleDeviceSelected"
    />
    <template #[`item.actions`]="{item}">
      <v-switch
        v-if="item.name === 'multiple'"
        v-model="multiple"
        density="compact"
        hide-details
      />
      <v-switch
        v-if="item.name === 'showFilters'"
        v-model="showFilters"
        density="compact"
        hide-details
      />
      <v-select
        v-if="item.name === 'filterByLocation'"
        v-model="filterByLocation"
        :items="locationOptions"
        density="compact"
        hide-details
        clearable
      />
      <v-select
        v-if="item.name === 'filterByType'"
        v-model="filterByType"
        :items="deviceTypeOptions"
        density="compact"
        hide-details
        clearable
      />
      <v-chip-group
        v-if="item.name === 'selectedDevices'"
        v-model="selectedDeviceIds"
        multiple
        column
      >
        <v-chip
          v-for="device in selectedDevices"
          :key="device.id"
          :value="device.id"
          size="small"
          closable
          @click:close="removeDevice(device.id)"
        >
          {{ device.name }}
        </v-chip>
      </v-chip-group>
    </template>
  </ExampleComponentUsage>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import LocationSelector from '@/components/devices/LocationSelector.vue';
import type { Device } from '@/types/device';
import { DeviceType, DeviceStatus } from '@/types/device';

const multiple = ref(true);
const showFilters = ref(true);
const filterByLocation = ref('');
const filterByType = ref('');
const selectedDevices = ref<Device[]>([]);

const availableDevices = ref<Device[]>([
  {
    id: 'dev-1',
    name: 'iPad Pro - Stage 12-01',
    type: DeviceType.IPAD_PRO,
    status: DeviceStatus.ONLINE,
    location: 'loc-1',
    serialNumber: 'ABC123456789',
    lastSeen: new Date().toISOString(),
    currentConfig: null
  },
  {
    id: 'dev-2',
    name: 'MacBook Pro - Edit Bay 1',
    type: DeviceType.MACBOOK_PRO,
    status: DeviceStatus.ONLINE,
    location: 'loc-2',
    serialNumber: 'DEF987654321',
    lastSeen: new Date().toISOString(),
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
    currentConfig: null
  }
]);

const selectedDeviceIds = computed(() => selectedDevices.value.map(d => d.id));

const locationOptions = [
  { title: 'Universal Studios - Stage 12', value: 'loc-1' },
  { title: 'Edit Bay Complex', value: 'loc-2' },
  { title: '30 Rockefeller Plaza', value: 'loc-3' }
];

const deviceTypeOptions = [
  { title: 'iPad Pro', value: DeviceType.IPAD_PRO },
  { title: 'MacBook Pro', value: DeviceType.MACBOOK_PRO },
  { title: 'iPhone', value: DeviceType.IPHONE },
  { title: 'iPad Air', value: DeviceType.IPAD_AIR }
];

const updateSelectedDevices = (devices: Device[]) => {
  selectedDevices.value = devices;
};

const handleDeviceSelected = (device: Device) => {
  console.log('Device selected:', device);
};

const removeDevice = (deviceId: string) => {
  selectedDevices.value = selectedDevices.value.filter(d => d.id !== deviceId);
};

const propItems = [
  {
    name: 'devices',
    type: 'Device[]',
    default: '[]',
    description: 'Available devices to select from'
  },
  {
    name: 'selectedDevices',
    type: 'Device[]',
    default: '[]',
    description: 'Currently selected devices'
  },
  {
    name: 'multiple',
    type: 'boolean',
    default: 'true',
    description: 'Allow multiple device selection'
  },
  {
    name: 'showFilters',
    type: 'boolean',
    default: 'true',
    description: 'Show filtering options'
  },
  {
    name: 'filterByLocation',
    type: 'string',
    default: '',
    description: 'Filter devices by location'
  },
  {
    name: 'filterByType',
    type: 'string',
    default: '',
    description: 'Filter devices by type'
  }
];

const eventItems = [
  {
    event: 'update:selected-devices',
    payload: 'Device[]',
    description: 'Emitted when the selected devices change.',
  },
  {
    event: 'device-selected',
    payload: 'Device',
    description: 'Emitted when a single device is selected/clicked.',
  },
];

const slotItems = [
  {
    name: 'device-item',
    content: 'device info',
    description: 'Slot for customizing how each device is displayed.',
  },
  {
    name: 'no-devices',
    content: 'empty state',
    description: 'Slot for custom content when no devices are available.',
  },
];
</script>