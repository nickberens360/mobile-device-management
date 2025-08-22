<template>
  <v-container fluid>
    <header>
      <h1 class="text-h4 mb-2">
        Dashboard
      </h1>
      <p class="text-body-1 text-medium-emphasis mb-6">
        Overview of all NBC Universal devices, locations, and recent configuration activities across film sets, theme parks, and corporate offices.
      </p>
    </header>

    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <StatsCard
          title="Total Devices"
          :value="totalDevices"
          icon="mdi-devices"
          icon-color="primary"
          has-action
          action-text="View All"
          @action-click="$router.push('/devices')"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <StatsCard
          title="Online Devices"
          :value="onlineDevices"
          icon="mdi-check-circle"
          icon-color="success"
          has-action
          action-text="View Online"
          @action-click="$router.push('/devices?filter=online')"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <StatsCard
          title="Locations"
          :value="totalLocations"
          icon="mdi-map-marker"
          icon-color="secondary"
          has-action
          action-text="Manage"
          action-color="secondary"
          @action-click="$router.push('/locations')"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <StatsCard
          title="Device Exceptions"
          :value="devicesNeedingAttention"
          icon="mdi-alert-circle"
          icon-color="warning"
          has-action
          action-text="View Issues"
          @action-click="$router.push('/devices?filter=attention')"
        />
      </v-col>
    </v-row>

    <!-- Additional Metrics Row -->
    <v-row class="mt-4">
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <StatsCard
          title="Templates"
          :value="totalTemplates"
          icon="mdi-file-document-multiple"
          icon-color="accent"
          has-action
          action-text="View All"
          @action-click="$router.push('/templates')"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <StatsCard
          title="Recent Configs"
          :value="recentConfigurations"
          icon="mdi-cog"
          icon-color="info"
          has-action
          action-text="Configure"
          @action-click="$router.push('/configure')"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <StatsCard
          title="Uptime"
          :value="systemUptime"
          suffix="%"
          icon="mdi-server"
          icon-color="success"
          has-action
          action-text="History"
          @action-click="$router.push('/history')"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <StatsCard
          title="Active Users"
          :value="activeUsers"
          icon="mdi-account-multiple"
          icon-color="primary"
          has-action
          action-text="View Activity"
          @action-click="$router.push('/history')"
        />
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col
        cols="12"
        md="8"
      >
        <v-card>
          <v-card-title>
            <h2 class="text-h6">
              Recent Configuration Activities
            </h2>
          </v-card-title>
          <v-card-text>
            <v-list>
              <ConfigurationActivityItem
                v-for="activity in recentActivities"
                :key="activity.id"
                :activity="activity"
              />
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-card>
          <v-card-title>
            <h2 class="text-h6">
              Quick Actions
            </h2>
          </v-card-title>
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
              @click="$router.push('/templates/new')"
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
            <h2 class="text-h6">
              Devices by Location
            </h2>
            <v-spacer />
            <v-btn
              variant="text"
              size="small"
              aria-label="Refresh devices by location data"
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
                <LocationCard
                  :location="location"
                  :online-count="location.online"
                  :total-count="location.total"
                  show-details
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DashboardView'
})
import { ref, computed, onMounted } from 'vue';
import { useDeviceStore } from '@/stores/devices';
import { useLocationStore } from '@/stores/locations';
import { useTemplateStore } from '@/stores/templates';
import { DeviceStatus } from '@/types/device';
import StatsCard from '@/components/common/StatsCard.vue';
import LocationCard from '@/components/locations/LocationCard.vue';
import ConfigurationActivityItem, { type ConfigurationActivity } from '@/components/common/ConfigurationActivityItem.vue';

const deviceStore = useDeviceStore();
const locationStore = useLocationStore();
const templateStore = useTemplateStore();

const totalDevices = computed(() => deviceStore.devices.length);
const onlineDevices = computed(() =>
  deviceStore.devices.filter(d => d.status === DeviceStatus.ONLINE).length
);
const devicesNeedingAttention = computed(() =>
  deviceStore.devices.filter(d =>
    d.status === DeviceStatus.ERROR || d.status === DeviceStatus.OFFLINE
  ).length
);
const totalLocations = computed(() => locationStore.locations.length);
const totalTemplates = computed(() => templateStore.templates.length);

// Additional metrics
const recentConfigurations = computed(() => {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return deviceStore.devices.filter(d =>
    d.currentConfig && new Date(d.currentConfig.appliedAt) > last24Hours
  ).length;
});

const systemUptime = computed(() => 99.7); // Simulated uptime
const activeUsers = computed(() => 12); // Simulated active users

const recentActivities = ref<ConfigurationActivity[]>([
  {
    id: 1,
    title: '15 devices configured',
    subtitle: 'Universal Studios - Stage 12',
    icon: 'mdi-check-circle',
    color: 'success',
    time: '2 hours ago',
    type: 'device_configuration',
    locationId: 'loc-1'
  },
  {
    id: 2,
    title: 'Template updated',
    subtitle: 'Film Production - Crew Devices',
    icon: 'mdi-file-document-edit',
    color: 'info',
    time: '5 hours ago',
    type: 'template_update',
    templateId: 'tpl-1'
  },
  {
    id: 3,
    title: 'Configuration failed',
    subtitle: '3 devices at 30 Rockefeller Plaza',
    icon: 'mdi-alert-circle',
    color: 'error',
    time: '1 day ago',
    type: 'configuration_failure',
    locationId: 'loc-3',
    deviceIds: ['dev-001', 'dev-002', 'dev-003']
  },
  {
    id: 4,
    title: 'New template created',
    subtitle: 'Press Event - Media Devices',
    icon: 'mdi-plus-circle',
    color: 'primary',
    time: '2 days ago',
    type: 'template_create',
    templateId: 'tpl-4'
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