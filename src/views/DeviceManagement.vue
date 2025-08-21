<template>
  <v-container fluid>
    <h1 class="text-h4 mb-6">Device Management</h1>
    
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
              @click="configureDevice(item)"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDeviceStore } from '@/stores/devices';
import type { Device } from '@/types/device';

const router = useRouter();
const deviceStore = useDeviceStore();

const devices = computed(() => deviceStore.devices);
const loading = computed(() => deviceStore.loading);

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

const configureDevice = (_device: Device) => {
  router.push('/configure');
};

onMounted(() => {
  deviceStore.fetchDevices();
});
</script>