<template>
  <v-container fluid>
    <h1 class="text-h4 mb-2">Device Management</h1>
    <p class="text-body-1 text-medium-emphasis mb-6">
      View and manage all networked devices including iPads, laptops, and mobile phones across NBC Universal locations. Monitor device status and perform individual actions.
    </p>

    <v-card>
      <v-card-title class="d-flex align-center py-4">
        All Devices
        <v-spacer />
        <v-menu v-if="selectedDevices.length > 0">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              color="secondary"
              prepend-icon="mdi-menu"
              class="mr-2"
            >
              Bulk Actions ({{ selectedDevices.length }})
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="bulkConfigure">
              <template v-slot:prepend>
                <v-icon>mdi-cog</v-icon>
              </template>
              <v-list-item-title>Configure Devices</v-list-item-title>
            </v-list-item>
            <v-list-item @click="bulkUpdateStatus">
              <template v-slot:prepend>
                <v-icon>mdi-sync</v-icon>
              </template>
              <v-list-item-title>Update Status</v-list-item-title>
            </v-list-item>
            <v-list-item @click="clearSelection">
              <template v-slot:prepend>
                <v-icon>mdi-close</v-icon>
              </template>
              <v-list-item-title>Clear Selection</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
        <!-- Alert when showing devices needing attention -->
        <v-alert
          v-if="filters.showAttention"
          type="warning"
          variant="tonal"
          closable
          class="mb-4"
          @click:close="filters.showAttention = false"
        >
          Showing devices that need attention (Offline or Error status)
        </v-alert>
        
        <!-- Filters -->
        <v-row class="mb-4">
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.location"
              :items="locationOptions"
              item-title="name"
              item-value="id"
              label="Filter by Location"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-map-marker"
              @update:model-value="applyFilters"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.type"
              :items="deviceTypeOptions"
              item-title="label"
              item-value="value"
              label="Filter by Type"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-devices"
              @update:model-value="applyFilters"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.status"
              :items="statusFilterOptions"
              item-title="label"
              item-value="value"
              label="Filter by Status"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-information"
              @update:model-value="() => { filters.showAttention = false; applyFilters(); }"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.search"
              label="Search devices"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-magnify"
              @update:model-value="applyFilters"
            />
          </v-col>
        </v-row>

        <v-data-table
          v-model="selectedDevices"
          :headers="headers"
          :items="filteredDevices"
          :loading="loading"
          :items-per-page="itemsPerPage"
          :page="currentPage"
          :server-items-length="totalItems"
          show-select
          multi-sort
          class="elevation-1"
          item-value="id"
          @update:options="handleTableOptions"
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

          <template v-slot:item.location="{ item }">
            <span>{{ getLocationName(item.location) }}</span>
          </template>

          <template v-slot:item.metadata.lastSeen="{ item }">
            <span>{{ formatDate(item.metadata.lastSeen) }}</span>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex align-center">
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
            </div>
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
import { useLocationStore } from '@/stores/locations';
import { useNotifications } from '@/composables/useNotifications';
import DeviceDetailsDialog from '@/components/devices/DeviceDetailsDialog.vue';
import type { Device } from '@/types/device';

const route = useRoute();
const router = useRouter();
const deviceStore = useDeviceStore();
const locationStore = useLocationStore();
const { showSuccess, showError } = useNotifications();

const devices = computed(() => deviceStore.devices);
const loading = computed(() => deviceStore.loading);

const showDeviceDialog = ref(false);
const selectedDevice = ref<Device | null>(null);
const selectedDevices = ref<string[]>([]);

// Pagination and filtering
const currentPage = ref(1);
const itemsPerPage = ref(20);
const totalItems = computed(() => filteredDevices.value.length);

const filters = ref({
  location: null as string | null,
  type: null as string | null,
  status: null as string | null,
  search: '',
  showAttention: false // Special filter for devices needing attention
});

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Type', key: 'type' },
  { title: 'Status', key: 'status' },
  { title: 'Location', key: 'location' },
  { title: 'Last Seen', key: 'metadata.lastSeen' },
  { title: 'Actions', key: 'actions', sortable: false }
];

// Filter options
const locationOptions = computed(() => locationStore.locations);

const deviceTypeOptions = [
  { value: 'ipad_pro', label: 'iPad Pro' },
  { value: 'ipad_air', label: 'iPad Air' },
  { value: 'macbook_pro', label: 'MacBook Pro' },
  { value: 'iphone', label: 'iPhone' }
];

const statusFilterOptions = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'configuring', label: 'Configuring' },
  { value: 'error', label: 'Error' }
];

// Filtered devices
const filteredDevices = computed(() => {
  let result = devices.value;

  // Special filter for devices needing attention
  if (filters.value.showAttention) {
    result = result.filter(d => d.status === 'error' || d.status === 'offline');
  } else {
    // Regular status filter
    if (filters.value.status) {
      result = result.filter(d => d.status === filters.value.status);
    }
  }

  if (filters.value.location) {
    result = result.filter(d => d.location === filters.value.location);
  }

  if (filters.value.type) {
    result = result.filter(d => d.type === filters.value.type);
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    result = result.filter(d =>
      d.name.toLowerCase().includes(search) ||
      d.metadata.serialNumber.toLowerCase().includes(search)
    );
  }

  return result;
});

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    online: 'success',
    offline: 'error',
    configuring: 'warning',
    error: 'error'
  };
  return colors[status] || 'grey';
};

const getLocationName = (locationId: string): string => {
  const location = locationStore.locations.find(l => l.id === locationId);
  return location?.name || locationId;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

const refreshDevices = () => {
  deviceStore.fetchDevices();
};

const applyFilters = () => {
  currentPage.value = 1; // Reset to first page when filters change
};

const handleTableOptions = (options: any) => {
  currentPage.value = options.page;
  itemsPerPage.value = options.itemsPerPage;
};

// Bulk actions
const clearSelection = () => {
  selectedDevices.value = [];
};

const bulkConfigure = () => {
  if (selectedDevices.value.length === 0) return;

  router.push({
    path: '/configure',
    query: {
      deviceIds: selectedDevices.value.join(',')
    }
  });
};

const bulkUpdateStatus = async () => {
  if (selectedDevices.value.length === 0) return;

  try {
    // Simulate bulk status update
    await new Promise(resolve => setTimeout(resolve, 1000));
    showSuccess(
      'Status Updated',
      `Updated status for ${selectedDevices.value.length} devices`
    );
    clearSelection();
    refreshDevices();
  } catch (error) {
    showError('Update Failed', 'Failed to update device status');
  }
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
  await Promise.all([
    deviceStore.fetchDevices(),
    locationStore.fetchLocations()
  ]);
  
  // Handle query parameter for filtering
  if (route.query.filter === 'attention') {
    // Set special filter to show devices needing attention (offline or error status)
    filters.value.showAttention = true;
  }
  
  // Handle initial route after devices are loaded
  if (route.params.deviceId) {
    handleDeviceRoute(route.params.deviceId);
  }
});
</script>