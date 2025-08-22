<template>
  <v-dialog
    v-model="isOpen"
    max-width="900px"
  >
    <v-card v-if="location">
      <v-card-title class="d-flex align-center">
        <v-icon
          class="mr-3"
          :color="getLocationTypeColor(location.type)"
        >
          {{ getLocationTypeIcon(location.type) }}
        </v-icon>
        {{ location.name }}
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialog"
        />
      </v-card-title>

      <v-card-text>
        <v-row>
          <!-- Basic Information -->
          <v-col
            cols="12"
            md="6"
          >
            <v-card variant="outlined">
              <v-card-title class="text-h6">
                Basic Information
              </v-card-title>
              <v-card-text>
                <div class="mb-3">
                  <v-chip
                    :color="getLocationTypeColor(location.type)"
                    size="large"
                    variant="tonal"
                  >
                    <v-icon start>
                      {{ getLocationTypeIcon(location.type) }}
                    </v-icon>
                    {{ location.type.replace('_', ' ') }}
                  </v-chip>
                </div>
                
                <div class="mb-3">
                  <div class="text-subtitle-2 mb-1">
                    Address
                  </div>
                  <div class="text-body-1">
                    {{ location.address }}
                  </div>
                </div>

                <div class="mb-3">
                  <div class="text-subtitle-2 mb-1">
                    Status
                  </div>
                  <v-chip
                    :color="getLocationStatusColor(location)"
                    size="small"
                    variant="tonal"
                  >
                    {{ getLocationStatus(location) }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Device Statistics -->
          <v-col
            cols="12"
            md="6"
          >
            <v-card variant="outlined">
              <v-card-title class="text-h6">
                Device Statistics
              </v-card-title>
              <v-card-text>
                <div class="d-flex align-center mb-3">
                  <v-icon
                    color="primary"
                    class="mr-2"
                  >
                    mdi-devices
                  </v-icon>
                  <div>
                    <div class="text-h4">
                      {{ location.deviceCount }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Total Devices
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <div class="text-subtitle-2 mb-2">
                    Device Utilization
                  </div>
                  <v-progress-linear
                    :model-value="getDeviceUtilization(location.deviceCount)"
                    :color="getUtilizationColor(getDeviceUtilization(location.deviceCount))"
                    height="20"
                    rounded
                  >
                    {{ Math.round(getDeviceUtilization(location.deviceCount)) }}%
                  </v-progress-linear>
                </div>

                <div class="d-flex align-center">
                  <v-icon
                    color="info"
                    class="mr-2"
                  >
                    mdi-database
                  </v-icon>
                  <span>Max Capacity: {{ getMaxCapacity(location) }}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Active Productions -->
          <v-col
            cols="12"
            md="6"
          >
            <v-card variant="outlined">
              <v-card-title class="text-h6">
                <v-icon class="mr-2">
                  mdi-movie
                </v-icon>
                Active Productions
              </v-card-title>
              <v-card-text>
                <div v-if="location.activeProductions?.length">
                  <v-chip
                    v-for="production in location.activeProductions"
                    :key="production"
                    size="small"
                    variant="outlined"
                    color="purple"
                    class="mr-1 mb-1"
                  >
                    <v-icon start>
                      mdi-movie
                    </v-icon>
                    {{ production }}
                  </v-chip>
                </div>
                <div
                  v-else
                  class="text-medium-emphasis"
                >
                  <v-icon class="mr-1">
                    mdi-information-outline
                  </v-icon>
                  No active productions
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Network Profiles -->
          <v-col
            cols="12"
            md="6"
          >
            <v-card variant="outlined">
              <v-card-title class="text-h6">
                <v-icon class="mr-2">
                  mdi-wifi
                </v-icon>
                Network Profiles
              </v-card-title>
              <v-card-text>
                <div class="d-flex flex-wrap ga-1">
                  <v-chip
                    v-for="profile in location.networkProfiles"
                    :key="profile"
                    size="small"
                    color="info"
                    variant="tonal"
                  >
                    <v-icon start>
                      mdi-wifi
                    </v-icon>
                    {{ profile }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Device Breakdown -->
          <v-col cols="12">
            <v-card variant="outlined">
              <v-card-title class="text-h6">
                <v-icon class="mr-2">
                  mdi-chart-pie
                </v-icon>
                Device Breakdown
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col
                    v-for="stat in deviceBreakdown"
                    :key="stat.type"
                    cols="6"
                    sm="3"
                  >
                    <div class="text-center">
                      <v-icon
                        :color="stat.color"
                        size="32"
                      >
                        {{ stat.icon }}
                      </v-icon>
                      <div class="text-h6 mt-1">
                        {{ stat.count }}
                      </div>
                      <div class="text-caption">
                        {{ stat.type }}
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Quick Actions -->
          <v-col cols="12">
            <v-card variant="outlined">
              <v-card-title class="text-h6">
                <v-icon class="mr-2">
                  mdi-lightning-bolt
                </v-icon>
                Quick Actions
              </v-card-title>
              <v-card-text>
                <div class="d-flex flex-wrap ga-2">
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-devices"
                    @click="manageDevices"
                  >
                    Manage Devices
                  </v-btn>
                  <v-btn
                    color="secondary"
                    prepend-icon="mdi-cog"
                    @click="configureDevices"
                  >
                    Configure Devices
                  </v-btn>
                  <v-btn
                    color="info"
                    prepend-icon="mdi-wifi-settings"
                    @click="networkSettings"
                  >
                    Network Settings
                  </v-btn>
                  <v-btn
                    color="success"
                    prepend-icon="mdi-plus"
                    @click="addTemplate"
                  >
                    Create Template
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Additional Information (if available) -->
          <v-col
            v-if="hasAdditionalInfo"
            cols="12"
          >
            <v-card variant="outlined">
              <v-card-title class="text-h6">
                <v-icon class="mr-2">
                  mdi-information
                </v-icon>
                Additional Information
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col
                    v-if="(location as any).contactPerson"
                    cols="12"
                    md="6"
                  >
                    <div class="mb-2">
                      <div class="text-subtitle-2 mb-1">
                        Contact Person
                      </div>
                      <div class="d-flex align-center">
                        <v-icon class="mr-2">
                          mdi-account
                        </v-icon>
                        <span>{{ (location as any).contactPerson }}</span>
                      </div>
                    </div>
                  </v-col>
                  <v-col
                    v-if="(location as any).contactEmail"
                    cols="12"
                    md="6"
                  >
                    <div class="mb-2">
                      <div class="text-subtitle-2 mb-1">
                        Contact Email
                      </div>
                      <div class="d-flex align-center">
                        <v-icon class="mr-2">
                          mdi-email
                        </v-icon>
                        <span>{{ (location as any).contactEmail }}</span>
                      </div>
                    </div>
                  </v-col>
                  <v-col
                    v-if="(location as any).notes"
                    cols="12"
                  >
                    <div class="mb-2">
                      <div class="text-subtitle-2 mb-1">
                        Notes
                      </div>
                      <div class="d-flex align-start">
                        <v-icon class="mr-2 mt-1">
                          mdi-note-text
                        </v-icon>
                        <span>{{ (location as any).notes }}</span>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="primary"
          prepend-icon="mdi-pencil"
          @click="editLocation"
        >
          Edit Location
        </v-btn>
        <v-spacer />
        <v-btn
          variant="outlined"
          @click="closeDialog"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Location, LocationType } from '@/types/location';

interface Props {
  modelValue: boolean;
  location: Location | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'dialog-closed': [];
}>();

const router = useRouter();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const hasAdditionalInfo = computed(() => {
  if (!props.location) return false;
  const loc = props.location as any;
  return !!(loc.contactPerson || loc.contactEmail || loc.notes);
});

const deviceBreakdown = computed(() => {
  if (!props.location) return [];
  
  const total = props.location.deviceCount;
  // Simulate device type breakdown
  return [
    { type: 'iPad Pro', count: Math.floor(total * 0.4), icon: 'mdi-tablet', color: 'primary' },
    { type: 'iPad Air', count: Math.floor(total * 0.25), icon: 'mdi-tablet', color: 'secondary' },
    { type: 'MacBook Pro', count: Math.floor(total * 0.2), icon: 'mdi-laptop', color: 'info' },
    { type: 'iPhone', count: Math.floor(total * 0.15), icon: 'mdi-cellphone', color: 'success' }
  ];
});

// Helper functions
const getLocationTypeIcon = (type: LocationType): string => {
  const icons: Record<string, string> = {
    [LocationType.FILM_SET]: 'mdi-movie',
    [LocationType.THEME_PARK]: 'mdi-ferris-wheel',
    [LocationType.CORPORATE_OFFICE]: 'mdi-office-building',
    [LocationType.EVENT_VENUE]: 'mdi-stadium',
    [LocationType.BROADCAST_STUDIO]: 'mdi-broadcast'
  };
  return icons[type] || 'mdi-map-marker';
};

const getLocationTypeColor = (type: LocationType): string => {
  const colors: Record<string, string> = {
    [LocationType.FILM_SET]: 'purple',
    [LocationType.THEME_PARK]: 'green',
    [LocationType.CORPORATE_OFFICE]: 'blue',
    [LocationType.EVENT_VENUE]: 'orange',
    [LocationType.BROADCAST_STUDIO]: 'red'
  };
  return colors[type] || 'grey';
};

const getLocationStatus = (location: Location): string => {
  const hasActiveProductions = location.activeProductions && location.activeProductions.length > 0;
  if (location.deviceCount === 0) return 'No Devices';
  if (hasActiveProductions) return 'Active Production';
  return 'Ready';
};

const getLocationStatusColor = (location: Location): string => {
  const status = getLocationStatus(location);
  switch (status) {
    case 'Active Production': return 'success';
    case 'Ready': return 'info';
    case 'No Devices': return 'warning';
    default: return 'grey';
  }
};

const getDeviceUtilization = (deviceCount: number): number => {
  const maxCapacity = Math.max(deviceCount * 1.2, 100);
  return Math.min((deviceCount / maxCapacity) * 100, 100);
};

const getUtilizationColor = (utilization: number): string => {
  if (utilization > 80) return 'error';
  if (utilization > 60) return 'warning';
  return 'success';
};

const getMaxCapacity = (location: Location): number => {
  return (location as any).maxCapacity || Math.max(location.deviceCount * 1.2, 100);
};

// Actions
const editLocation = () => {
  closeDialog();
  // This would typically emit an event or navigate to edit mode
  router.push(`/locations/${props.location?.id}/edit`);
};

const manageDevices = () => {
  closeDialog();
  router.push(`/devices?location=${props.location?.id}`);
};

const configureDevices = () => {
  closeDialog();
  router.push({
    path: '/configure',
    query: { locationId: props.location?.id }
  });
};

const networkSettings = () => {
  closeDialog();
  // Would open network settings dialog or page
};

const addTemplate = () => {
  closeDialog();
  router.push({
    path: '/templates/new',
    query: { locationId: props.location?.id }
  });
};

const closeDialog = () => {
  isOpen.value = false;
  emit('dialog-closed');
};
</script>