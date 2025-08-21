<template>
  <v-container fluid>
    <h1 class="text-h4 mb-2">Device Management</h1>
    <p class="text-body-1 text-medium-emphasis mb-6">
      View and manage all networked devices including iPads, laptops, and mobile phones across NBC Universal locations. Monitor device status and perform individual actions.
    </p>
    
    <v-card>
      <v-card-title>
        All Devices
        <v-spacer />
        <v-btn
          color="primary"
          prepend-icon="mdi-refresh"
          @click="refreshDevices"
          :loading="loading"
        >
          Refresh
        </v-btn>
      </v-card-title>
      
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="devices"
          :loading="loading"
          :items-per-page="20"
          class="elevation-1"
        >
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="small"
              variant="tonal"
            >
              {{ item.status }}
            </v-chip>
          </template>
          
          <template v-slot:item.type="{ item }">
            <v-chip size="small" variant="outlined">
              {{ item.type.replace('_', ' ') }}
            </v-chip>
          </template>
          
          <template v-slot:item.actions="{ item }">
            <v-btn
              icon="mdi-eye"
              size="small"
              variant="text"
              @click="viewDevice(item)"
            />
            <v-btn
              icon="mdi-cog"
              size="small"
              variant="text"
              @click="openDeviceDialog(item)"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Device Details Dialog -->
    <DeviceDetailsDialog
      v-model="showDeviceDialog"
      :device="selectedDevice"
      @device-updated="onDeviceUpdated"
      @dialog-closed="onDialogClosed"
    />

    <!-- Router outlet for nested routes -->
    <router-view />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDeviceStore } from '@/stores/devices';
import DeviceDetailsDialog from '@/components/devices/DeviceDetailsDialog.vue';
import type { Device } from '@/types/device';

const route = useRoute();
const router = useRouter();
const deviceStore = useDeviceStore();

const devices = computed(() => deviceStore.devices);
const loading = computed(() => deviceStore.loading);

const showDeviceDialog = ref(false);
const selectedDevice = ref<Device | null>(null);

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Type', key: 'type' },
  { title: 'Status', key: 'status' },
  { title: 'Location', key: 'location' },
  { title: 'Last Seen', key: 'metadata.lastSeen' },
  { title: 'Actions', key: 'actions', sortable: false }
];

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    online: 'success',
    offline: 'error',
    configuring: 'warning',
    error: 'error'
  };
  return colors[status] || 'grey';
};

const refreshDevices = () => {
  deviceStore.fetchDevices();
};

const viewDevice = (device: Device) => {
  console.log('View device:', device.name);
};

const openDeviceDialog = (device: Device) => {
  router.push(`/devices/${device.id}`);
};

const onDeviceUpdated = (updatedDevice: Device) => {
  // In a real app, this would update the device in the store
  // For now, we'll just refresh the devices list
  deviceStore.fetchDevices();
  console.log('Device updated:', updatedDevice.name);
};

const onDialogClosed = () => {
  if (route.params.deviceId) {
    router.push('/devices');
  }
};

const handleDeviceRoute = async (deviceId?: string | string[]) => {
  if (deviceId && typeof deviceId === 'string') {
    // Ensure devices are loaded
    if (devices.value.length === 0) {
      await deviceStore.fetchDevices();
    }
    
    const device = devices.value.find(d => d.id === deviceId);
    if (device) {
      selectedDevice.value = device;
      showDeviceDialog.value = true;
    } else {
      // Device not found, redirect to devices list
      router.push('/devices');
    }
  } else {
    selectedDevice.value = null;
    showDeviceDialog.value = false;
  }
};

// Watch for route changes to open/close dialog
watch(() => route.params.deviceId, handleDeviceRoute, { immediate: true });

// Also watch for devices being loaded to handle initial route
watch(() => devices.value.length, () => {
  if (devices.value.length > 0 && route.params.deviceId) {
    handleDeviceRoute(route.params.deviceId);
  }
});

onMounted(async () => {
  await deviceStore.fetchDevices();
  // Handle initial route after devices are loaded
  if (route.params.deviceId) {
    handleDeviceRoute(route.params.deviceId);
  }
});
</script>