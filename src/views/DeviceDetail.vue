<template>
  <v-container fluid>
    <!-- Breadcrumb Navigation -->
    <v-breadcrumbs
      :items="breadcrumbItems"
      class="px-0"
    >
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item
          :to="item.to"
          :disabled="item.disabled"
        >
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <div v-if="loading" class="d-flex justify-center">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <div v-else-if="!device" class="text-center">
      <v-icon size="64" color="grey">mdi-alert</v-icon>
      <h2 class="text-h4 mt-4">Device Not Found</h2>
      <p class="text-body-1 text-medium-emphasis">The requested device could not be found.</p>
      <v-btn color="primary" :to="'/devices'" class="mt-4">
        Back to Devices
      </v-btn>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 mb-2">{{ device.name }}</h1>
          <p class="text-body-1 text-medium-emphasis">
            {{ device.type.replace('_', ' ') }} • {{ getLocationName(device.location) }}
          </p>
        </div>
        <div class="d-flex ga-2">
          <v-btn
            color="primary"
            prepend-icon="mdi-pencil"
            @click="editDevice"
          >
            Edit Device
          </v-btn>
          <v-btn
            color="secondary"
            prepend-icon="mdi-cog"
            @click="configureDevice"
          >
            Configure
          </v-btn>
        </div>
      </div>

      <v-row>
        <!-- Device Information -->
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-3" color="primary">mdi-devices</v-icon>
              Device Information
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">Status</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip
                        :color="getStatusColor(device.status)"
                        size="small"
                        variant="tonal"
                      >
                        <v-icon start>{{ getStatusIcon(device.status) }}</v-icon>
                        {{ device.status }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">Device Type</v-list-item-title>
                    <v-list-item-subtitle>{{ device.type.replace('_', ' ') }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">Serial Number</v-list-item-title>
                    <v-list-item-subtitle>{{ device.metadata.serialNumber }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">OS Version</v-list-item-title>
                    <v-list-item-subtitle>{{ device.metadata.osVersion }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">Last Seen</v-list-item-title>
                    <v-list-item-subtitle>{{ formatDate(device.metadata.lastSeen) }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">Location</v-list-item-title>
                    <v-list-item-subtitle>
                      <router-link :to="`/locations/${device.location}`" class="text-decoration-none">
                        {{ getLocationName(device.location) }}
                      </router-link>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Quick Actions -->
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Quick Actions</v-card-title>
            <v-card-text class="pa-0">
              <v-list>
                <v-list-item @click="editDevice">
                  <template v-slot:prepend>
                    <v-icon>mdi-pencil</v-icon>
                  </template>
                  <v-list-item-title>Edit Device</v-list-item-title>
                  <v-list-item-subtitle>Update device information</v-list-item-subtitle>
                </v-list-item>
                <v-list-item @click="configureDevice">
                  <template v-slot:prepend>
                    <v-icon>mdi-cog</v-icon>
                  </template>
                  <v-list-item-title>Configure Device</v-list-item-title>
                  <v-list-item-subtitle>Apply configuration template</v-list-item-subtitle>
                </v-list-item>
                <v-list-item @click="refreshStatus">
                  <template v-slot:prepend>
                    <v-icon>mdi-refresh</v-icon>
                  </template>
                  <v-list-item-title>Refresh Status</v-list-item-title>
                  <v-list-item-subtitle>Update device status</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Current Configuration -->
        <v-col cols="12">
          <v-card v-if="device.currentConfig">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-3" color="success">mdi-check-circle</v-icon>
              Current Configuration
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">Template</v-list-item-title>
                    <v-list-item-subtitle>
                      <router-link :to="`/templates/${device.currentConfig.template}`" class="text-decoration-none">
                        {{ device.currentConfig.template }}
                      </router-link>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12" md="4">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">Applied By</v-list-item-title>
                    <v-list-item-subtitle>{{ device.currentConfig.appliedBy }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12" md="4">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">Applied At</v-list-item-title>
                    <v-list-item-subtitle>{{ formatDate(device.currentConfig.appliedAt) }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card v-else variant="outlined" color="warning">
            <v-card-text class="d-flex align-center">
              <v-icon color="warning" class="mr-3">mdi-alert</v-icon>
              <div>
                <div class="text-h6">No Configuration Applied</div>
                <div class="text-body-2">This device has not been configured yet.</div>
              </div>
              <v-spacer />
              <v-btn
                color="primary"
                variant="outlined"
                prepend-icon="mdi-cog"
                @click="configureDevice"
              >
                Configure Now
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Device Edit Dialog -->
    <DeviceEditDialog
      v-model="showEditDialog"
      :device="device"
      @device-updated="onDeviceUpdated"
      @dialog-closed="showEditDialog = false"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDeviceStore } from '@/stores/devices';
import { useLocationStore } from '@/stores/locations';
import { useNotifications } from '@/composables/useNotifications';
import DeviceEditDialog from '@/components/devices/DeviceEditDialog.vue';
import type { Device } from '@/types/device';

const route = useRoute();
const router = useRouter();
const deviceStore = useDeviceStore();
const locationStore = useLocationStore();
const { showSuccess, showError } = useNotifications();

const device = ref<Device | null>(null);
const loading = ref(true);
const showEditDialog = ref(false);

const breadcrumbItems = computed(() => [
  {
    title: 'Devices',
    to: '/devices',
    disabled: false
  },
  {
    title: device.value?.name || 'Device',
    to: '',
    disabled: true
  }
]);

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    online: 'success',
    offline: 'error',
    configuring: 'warning',
    error: 'error'
  };
  return colors[status] || 'grey';
};

const getStatusIcon = (status: string): string => {
  const icons: Record<string, string> = {
    online: 'mdi-check-circle',
    offline: 'mdi-minus-circle',
    configuring: 'mdi-loading',
    error: 'mdi-alert-circle'
  };
  return icons[status] || 'mdi-help-circle';
};

const getLocationName = (locationId: string): string => {
  const location = locationStore.locations.find(l => l.id === locationId);
  return location?.name || locationId;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

const editDevice = () => {
  showEditDialog.value = true;
};

const configureDevice = () => {
  router.push({
    path: '/configure',
    query: {
      deviceId: device.value?.id,
      locationId: device.value?.location,
      deviceType: device.value?.type
    }
  });
};

const refreshStatus = async () => {
  if (!device.value) return;
  
  try {
    // Simulate status refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    showSuccess('Status Updated', 'Device status has been refreshed');
    // In a real app, this would fetch the latest device data
    await loadDevice();
  } catch (error) {
    showError('Update Failed', 'Failed to refresh device status');
  }
};

const onDeviceUpdated = (updatedDevice: Device) => {
  device.value = updatedDevice;
  deviceStore.fetchDevices(); // Refresh the store
  showSuccess('Device Updated', `${updatedDevice.name} has been updated successfully`);
};

const loadDevice = async () => {
  loading.value = true;
  try {
    const deviceId = route.params.deviceId as string;
    
    // Ensure devices are loaded
    if (deviceStore.devices.length === 0) {
      await deviceStore.fetchDevices();
    }
    
    // Ensure locations are loaded for display
    if (locationStore.locations.length === 0) {
      await locationStore.fetchLocations();
    }
    
    const foundDevice = deviceStore.devices.find(d => d.id === deviceId);
    if (foundDevice) {
      device.value = foundDevice;
    } else {
      device.value = null;
    }
  } catch (error) {
    console.error('Error loading device:', error);
    device.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadDevice();
});
</script>