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

    <div v-else-if="!location" class="text-center">
      <v-icon size="64" color="grey">mdi-alert</v-icon>
      <h2 class="text-h4 mt-4">Location Not Found</h2>
      <p class="text-body-1 text-medium-emphasis">The requested location could not be found.</p>
      <v-btn color="primary" :to="'/locations'" class="mt-4">
        Back to Locations
      </v-btn>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 mb-2">{{ location.name }}</h1>
          <p class="text-body-1 text-medium-emphasis">
            {{ location.type.replace('_', ' ') }} • {{ location.address }}
          </p>
        </div>
        <div class="d-flex ga-2">
          <v-btn
            color="primary"
            prepend-icon="mdi-pencil"
            @click="editLocation"
          >
            Edit Location
          </v-btn>
          <v-btn
            color="secondary"
            prepend-icon="mdi-devices"
            @click="viewDevices"
          >
            View Devices ({{ location.deviceCount }})
          </v-btn>
        </div>
      </div>

      <v-row>
        <!-- Location Information -->
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-3" :color="getLocationTypeColor(location.type)">
                {{ getLocationTypeIcon(location.type) }}
              </v-icon>
              Location Information
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">Type</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip
                        :color="getLocationTypeColor(location.type)"
                        size="small"
                        variant="tonal"
                      >
                        {{ location.type.replace('_', ' ') }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">Status</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip
                        :color="getLocationStatusColor(location)"
                        size="small"
                        variant="tonal"
                      >
                        {{ getLocationStatus(location) }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">Address</v-list-item-title>
                    <v-list-item-subtitle>{{ location.address }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">Device Count</v-list-item-title>
                    <v-list-item-subtitle class="d-flex align-center">
                      <span class="text-h6 mr-2">{{ location.deviceCount }}</span>
                      <v-progress-circular
                        :model-value="getDeviceUtilization(location.deviceCount)"
                        :color="getUtilizationColor(getDeviceUtilization(location.deviceCount))"
                        size="20"
                        width="3"
                      />
                      <span class="text-caption text-medium-emphasis ml-2">
                        {{ Math.round(getDeviceUtilization(location.deviceCount)) }}% capacity
                      </span>
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
                <v-list-item @click="editLocation">
                  <template v-slot:prepend>
                    <v-icon>mdi-pencil</v-icon>
                  </template>
                  <v-list-item-title>Edit Location</v-list-item-title>
                  <v-list-item-subtitle>Update location information</v-list-item-subtitle>
                </v-list-item>
                <v-list-item @click="viewDevices">
                  <template v-slot:prepend>
                    <v-icon>mdi-devices</v-icon>
                  </template>
                  <v-list-item-title>View Devices</v-list-item-title>
                  <v-list-item-subtitle>{{ location.deviceCount }} devices</v-list-item-subtitle>
                </v-list-item>
                <v-list-item @click="configureNetwork">
                  <template v-slot:prepend>
                    <v-icon>mdi-wifi-settings</v-icon>
                  </template>
                  <v-list-item-title>Network Settings</v-list-item-title>
                  <v-list-item-subtitle>Configure network profiles</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Active Productions -->
        <v-col cols="12" md="6" v-if="location.activeProductions?.length">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-3" color="success">mdi-movie</v-icon>
              Active Productions
            </v-card-title>
            <v-card-text>
              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="production in location.activeProductions"
                  :key="production"
                  size="small"
                  variant="outlined"
                  color="success"
                >
                  {{ production }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Network Profiles -->
        <v-col cols="12" :md="location.activeProductions?.length ? 6 : 12">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-3" color="info">mdi-wifi</v-icon>
              Network Profiles
              <v-spacer />
              <v-btn
                size="small"
                variant="outlined"
                prepend-icon="mdi-wifi-settings"
                @click="configureNetwork"
              >
                Configure
              </v-btn>
            </v-card-title>
            <v-card-text>
              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="profile in location.networkProfiles"
                  :key="profile"
                  size="small"
                  color="info"
                  variant="tonal"
                >
                  {{ profile }}
                </v-chip>
              </div>
              <div v-if="location.networkProfiles.length === 0" class="text-center text-medium-emphasis py-4">
                <v-icon size="48" color="grey">mdi-wifi-off</v-icon>
                <p class="mt-2">No network profiles configured</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Location Edit Dialog -->
    <LocationEditDialog
      v-model="showEditDialog"
      :location="location"
      :is-creating="false"
      @location-saved="onLocationSaved"
      @dialog-closed="onEditDialogClosed"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLocationStore } from '@/stores/locations';
import { useNotifications } from '@/composables/useNotifications';
import LocationEditDialog from '@/components/locations/LocationEditDialog.vue';
import { Location, LocationType } from '@/types/location';

const route = useRoute();
const router = useRouter();
const locationStore = useLocationStore();
const { showSuccess } = useNotifications();

const location = ref<Location | null>(null);
const loading = ref(true);
const showEditDialog = ref(false);

const breadcrumbItems = computed(() => [
  {
    title: 'Locations',
    to: '/locations',
    disabled: false
  },
  {
    title: location.value?.name || 'Location',
    to: '',
    disabled: true
  }
]);

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

const getDeviceUtilization = (deviceCount: number): number => {
  // Simulate utilization based on device count (max theoretical capacity)
  const maxCapacity = Math.max(deviceCount * 1.2, 100);
  return Math.min((deviceCount / maxCapacity) * 100, 100);
};

const getUtilizationColor = (utilization: number): string => {
  if (utilization > 80) return 'error';
  if (utilization > 60) return 'warning';
  return 'success';
};

const getLocationStatus = (location: Location): string => {
  const hasActiveProductions = location.activeProductions && location.activeProductions.length > 0;
  if (location.deviceCount === 0) return 'No Devices';
  if (hasActiveProductions) return 'Active';
  return 'Ready';
};

const getLocationStatusColor = (location: Location): string => {
  const status = getLocationStatus(location);
  switch (status) {
    case 'Active': return 'success';
    case 'Ready': return 'info';
    case 'No Devices': return 'warning';
    default: return 'grey';
  }
};

const editLocation = () => {
  showEditDialog.value = true;
};

const viewDevices = () => {
  router.push(`/devices?location=${location.value?.id}`);
};

const configureNetwork = () => {
  showSuccess(
    'Network Configuration', 
    `Opening network settings for ${location.value?.name}`
  );
  // In a real app, this would open a network configuration dialog or navigate to a network config page
};

const onLocationSaved = (savedLocation: Location) => {
  location.value = savedLocation;
  locationStore.fetchLocations(); // Refresh the store
  showSuccess('Location Updated', `${savedLocation.name} has been updated successfully`);
  
  // Navigate back to detail view (remove /edit from URL)
  if (route.path.endsWith('/edit')) {
    router.push(`/locations/${savedLocation.id}`);
  }
};

const onEditDialogClosed = () => {
  showEditDialog.value = false;
  
  // If we were on the edit route, navigate back to detail view
  if (route.path.endsWith('/edit')) {
    router.push(`/locations/${location.value?.id}`);
  }
};

const loadLocation = async () => {
  loading.value = true;
  try {
    const locationId = route.params.locationId as string;
    
    // Ensure locations are loaded
    if (locationStore.locations.length === 0) {
      await locationStore.fetchLocations();
    }
    
    const foundLocation = locationStore.locations.find(l => l.id === locationId);
    if (foundLocation) {
      location.value = foundLocation;
      
      // Check if this is the edit route and auto-open the edit dialog
      if (route.path.endsWith('/edit')) {
        showEditDialog.value = true;
      }
    } else {
      location.value = null;
    }
  } catch (error) {
    console.error('Error loading location:', error);
    location.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadLocation();
});
</script>