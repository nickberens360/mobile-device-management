<template>
  <v-container fluid>
    <h1 class="text-h4 mb-6">Dashboard</h1>
    
    <v-row>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text class="d-flex align-center">
            <div>
              <div class="text-overline mb-1">Total Devices</div>
              <div class="text-h4 font-weight-bold">{{ totalDevices }}</div>
            </div>
            <v-spacer />
            <v-icon size="48" color="primary">mdi-devices</v-icon>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-text class="d-flex align-center">
            <div>
              <div class="text-overline mb-1">Online Devices</div>
              <div class="text-h4 font-weight-bold text-success">{{ onlineDevices }}</div>
            </div>
            <v-spacer />
            <v-icon size="48" color="success">mdi-check-circle</v-icon>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-text class="d-flex align-center">
            <div>
              <div class="text-overline mb-1">Locations</div>
              <div class="text-h4 font-weight-bold">{{ totalLocations }}</div>
            </div>
            <v-spacer />
            <v-icon size="48" color="secondary">mdi-map-marker</v-icon>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-text class="d-flex align-center">
            <div>
              <div class="text-overline mb-1">Templates</div>
              <div class="text-h4 font-weight-bold">{{ totalTemplates }}</div>
            </div>
            <v-spacer />
            <v-icon size="48" color="accent">mdi-file-document-multiple</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Recent Configuration Activities</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="activity in recentActivities"
                :key="activity.id"
                :title="activity.title"
                :subtitle="activity.subtitle"
              >
                <template v-slot:prepend>
                  <v-icon :color="activity.color">{{ activity.icon }}</v-icon>
                </template>
                <template v-slot:append>
                  <v-list-item-subtitle>{{ activity.time }}</v-list-item-subtitle>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Quick Actions</v-card-title>
          <v-card-text>
            <v-btn
              block
              color="primary"
              class="mb-2"
              prepend-icon="mdi-cog"
              @click="$router.push('/configure')"
            >
              Configure Devices
            </v-btn>
            <v-btn
              block
              color="secondary"
              class="mb-2"
              prepend-icon="mdi-plus"
              @click="$router.push('/templates')"
            >
              Create Template
            </v-btn>
            <v-btn
              block
              variant="outlined"
              prepend-icon="mdi-devices"
              @click="$router.push('/devices')"
            >
              View All Devices
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Devices by Location
            <v-spacer />
            <v-btn
              variant="text"
              size="small"
              @click="loadDevicesByLocation"
            >
              Refresh
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                v-for="location in locationStats"
                :key="location.id"
                cols="12"
                sm="6"
                md="4"
              >
                <v-card variant="outlined">
                  <v-card-text>
                    <div class="d-flex align-center mb-2">
                      <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
                      <div class="text-subtitle-1 font-weight-bold">{{ location.name }}</div>
                    </div>
                    <v-chip
                      size="small"
                      color="primary"
                      variant="tonal"
                      class="mr-2"
                    >
                      {{ location.type }}
                    </v-chip>
                    <div class="mt-3">
                      <v-progress-linear
                        :model-value="location.onlinePercentage"
                        height="20"
                        rounded
                        color="success"
                      >
                        {{ location.online }}/{{ location.total }} online
                      </v-progress-linear>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDeviceStore } from '@/stores/devices';
import { useLocationStore } from '@/stores/locations';
import { useTemplateStore } from '@/stores/templates';
import { DeviceStatus } from '@/types/device';

const deviceStore = useDeviceStore();
const locationStore = useLocationStore();
const templateStore = useTemplateStore();

const totalDevices = computed(() => deviceStore.devices.length);
const onlineDevices = computed(() => 
  deviceStore.devices.filter(d => d.status === DeviceStatus.ONLINE).length
);
const totalLocations = computed(() => locationStore.locations.length);
const totalTemplates = computed(() => templateStore.templates.length);

const recentActivities = ref([
  {
    id: 1,
    title: '15 devices configured',
    subtitle: 'Universal Studios - Stage 12',
    icon: 'mdi-check-circle',
    color: 'success',
    time: '2 hours ago'
  },
  {
    id: 2,
    title: 'Template updated',
    subtitle: 'Film Production - Crew Devices',
    icon: 'mdi-file-document-edit',
    color: 'info',
    time: '5 hours ago'
  },
  {
    id: 3,
    title: 'Configuration failed',
    subtitle: '3 devices at 30 Rockefeller Plaza',
    icon: 'mdi-alert-circle',
    color: 'error',
    time: '1 day ago'
  },
  {
    id: 4,
    title: 'New template created',
    subtitle: 'Press Event - Media Devices',
    icon: 'mdi-plus-circle',
    color: 'primary',
    time: '2 days ago'
  }
]);

const locationStats = computed(() => {
  return locationStore.locations.map(location => {
    const devices = deviceStore.devices.filter(d => d.location === location.id);
    const online = devices.filter(d => d.status === DeviceStatus.ONLINE).length;
    return {
      ...location,
      total: devices.length,
      online,
      onlinePercentage: devices.length > 0 ? (online / devices.length) * 100 : 0
    };
  });
});

const loadDevicesByLocation = async () => {
  await deviceStore.fetchDevices();
};

onMounted(async () => {
  await Promise.all([
    deviceStore.fetchDevices(),
    locationStore.fetchLocations(),
    templateStore.fetchTemplates()
  ]);
});
</script>