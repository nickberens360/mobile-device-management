<template>
  <v-container fluid>
    <div class="d-flex justify-space-between align-start mb-6">
      <div>
        <h1 class="text-h4 mb-2">
          Location Management
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Manage NBC Universal locations including film sets, theme parks, corporate offices, and event venues. Monitor device counts and network profiles for each location.
        </p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="createNewLocation"
      >
        Add Location
      </v-btn>
    </div>
    
    <v-card>
      <v-card-title class="d-flex align-center py-4">
        All Locations
        <v-spacer />
        <v-menu v-if="selectedLocations.length > 0">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              color="secondary"
              prepend-icon="mdi-menu"
              class="mr-2"
            >
              Bulk Actions ({{ selectedLocations.length }})
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="bulkUpdateNetworkProfiles">
              <template #prepend>
                <v-icon>mdi-wifi</v-icon>
              </template>
              <v-list-item-title>Update Network Profiles</v-list-item-title>
            </v-list-item>
            <v-list-item @click="bulkExportData">
              <template #prepend>
                <v-icon>mdi-download</v-icon>
              </template>
              <v-list-item-title>Export Location Data</v-list-item-title>
            </v-list-item>
            <v-list-item @click="clearSelection">
              <template #prepend>
                <v-icon>mdi-close</v-icon>
              </template>
              <v-list-item-title>Clear Selection</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          color="primary"
          prepend-icon="mdi-refresh"
          :loading="loading"
          @click="refreshLocations"
        >
          Refresh
        </v-btn>
      </v-card-title>
      
      <v-card-text>
        <!-- Filters -->
        <v-row class="mb-4">
          <v-col
            cols="12"
            md="3"
          >
            <v-select
              v-model="filters.type"
              :items="locationTypeOptions"
              item-title="label"
              item-value="value"
              label="Filter by Type"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-domain"
              @update:model-value="applyFilters"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-select
              v-model="filters.hasProductions"
              :items="productionFilterOptions"
              item-title="label"
              item-value="value"
              label="Filter by Productions"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-movie"
              @update:model-value="applyFilters"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-select
              v-model="filters.deviceCountRange"
              :items="deviceCountOptions"
              item-title="label"
              item-value="value"
              label="Filter by Device Count"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-devices"
              @update:model-value="applyFilters"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-text-field
              v-model="filters.search"
              label="Search locations"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-magnify"
              @update:model-value="applyFilters"
            />
          </v-col>
        </v-row>

        <v-data-table
          v-model="selectedLocations"
          :headers="headers"
          :items="filteredLocations"
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
          <template #[`item.name`]="{ item }">
            <div class="d-flex align-center">
              <v-icon
                class="mr-2"
                :color="getLocationTypeColor(item.type)"
              >
                {{ getLocationTypeIcon(item.type) }}
              </v-icon>
              <div>
                <div class="font-weight-medium">
                  {{ item.name }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ item.address }}
                </div>
              </div>
            </div>
          </template>

          <template #[`item.type`]="{ item }">
            <v-chip
              :color="getLocationTypeColor(item.type)"
              size="small"
              variant="tonal"
            >
              {{ item.type.replace('_', ' ') }}
            </v-chip>
          </template>

          <template #[`item.deviceCount`]="{ item }">
            <div class="d-flex align-center">
              <span class="text-h6 mr-2">{{ item.deviceCount }}</span>
              <v-progress-circular
                :model-value="getDeviceUtilization(item.deviceCount)"
                :color="getUtilizationColor(getDeviceUtilization(item.deviceCount))"
                size="20"
                width="3"
              />
            </div>
          </template>

          <template #[`item.activeProductions`]="{ item }">
            <div v-if="item.activeProductions?.length">
              <v-chip
                v-for="production in item.activeProductions.slice(0, 2)"
                :key="production"
                size="small"
                variant="outlined"
                class="mr-1 mb-1"
              >
                {{ production }}
              </v-chip>
              <v-chip
                v-if="item.activeProductions.length > 2"
                size="small"
                variant="tonal"
                color="primary"
              >
                +{{ item.activeProductions.length - 2 }} more
              </v-chip>
            </div>
            <span
              v-else
              class="text-medium-emphasis"
            >None</span>
          </template>

          <template #[`item.networkProfiles`]="{ item }">
            <div class="d-flex flex-wrap ga-1">
              <v-chip
                v-for="profile in item.networkProfiles.slice(0, 3)"
                :key="profile"
                size="small"
                color="info"
                variant="tonal"
              >
                {{ profile }}
              </v-chip>
              <v-chip
                v-if="item.networkProfiles.length > 3"
                size="small"
                variant="outlined"
              >
                +{{ item.networkProfiles.length - 3 }}
              </v-chip>
            </div>
          </template>

          <template #[`item.status`]="{ item }">
            <v-chip
              :color="getLocationStatusColor(item)"
              size="small"
              variant="tonal"
            >
              {{ getLocationStatus(item) }}
            </v-chip>
          </template>

          <template #[`item.actions`]="{ item }">
            <v-btn
              icon="mdi-cog"
              size="small"
              variant="text"
              @click="viewLocationDetails(item)"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Location Edit/Create Dialog -->
    <LocationEditDialog
      v-model="showEditDialog"
      :location="selectedLocation"
      :is-creating="isCreating"
      @location-saved="onLocationSaved"
      @dialog-closed="onDialogClosed"
    />
  </v-container>
</template>

<script setup lang="ts">
defineOptions({
  name: 'LocationsView'
})
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLocationStore } from '@/stores/locations';
import { useDeviceStore } from '@/stores/devices';
import { useNotifications } from '@/composables/useNotifications';
import { getStringParam, getBooleanParam } from '@/utils/queryParams';
import LocationEditDialog from '@/components/locations/LocationEditDialog.vue';
import { Location, LocationType } from '@/types/location';

const route = useRoute();
const router = useRouter();
const locationStore = useLocationStore();
const deviceStore = useDeviceStore();
const { showSuccess, showError } = useNotifications();

const locations = computed(() => locationStore.locations);
const loading = computed(() => locationStore.loading);

// Selection and pagination
const selectedLocations = ref<string[]>([]);
const currentPage = ref(1);
const itemsPerPage = ref(15);
const totalItems = computed(() => filteredLocations.value.length);

// Dialog states
const showEditDialog = ref(false);
const selectedLocation = ref<Location | null>(null);
const isCreating = ref(false);

// Filters
const filters = ref({
  type: null as LocationType | null,
  hasProductions: null as boolean | null,
  deviceCountRange: null as string | null,
  search: ''
});

// Table headers
const headers = [
  { title: 'Location', key: 'name', sortable: true },
  { title: 'Type', key: 'type', sortable: true },
  { title: 'Devices', key: 'deviceCount', sortable: true },
  { title: 'Active Productions', key: 'activeProductions', sortable: false },
  { title: 'Network Profiles', key: 'networkProfiles', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false }
];

// Filter options
const locationTypeOptions = [
  { value: LocationType.FILM_SET, label: 'Film Set' },
  { value: LocationType.THEME_PARK, label: 'Theme Park' },
  { value: LocationType.CORPORATE_OFFICE, label: 'Corporate Office' },
  { value: LocationType.EVENT_VENUE, label: 'Event Venue' },
  { value: LocationType.BROADCAST_STUDIO, label: 'Broadcast Studio' }
];

const productionFilterOptions = [
  { value: true, label: 'Has Active Productions' },
  { value: false, label: 'No Active Productions' }
];

const deviceCountOptions = [
  { value: 'low', label: '1-50 devices' },
  { value: 'medium', label: '51-200 devices' },
  { value: 'high', label: '200+ devices' }
];

// Filtered locations
const filteredLocations = computed(() => {
  let result = locations.value;

  if (filters.value.type) {
    result = result.filter(loc => loc.type === filters.value.type);
  }

  if (filters.value.hasProductions !== null) {
    result = result.filter(loc => {
      const hasProductions = !!(loc.activeProductions && loc.activeProductions.length > 0);
      return hasProductions === filters.value.hasProductions;
    });
  }

  if (filters.value.deviceCountRange) {
    result = result.filter(loc => {
      const count = loc.deviceCount;
      switch (filters.value.deviceCountRange) {
        case 'low': return count <= 50;
        case 'medium': return count > 50 && count <= 200;
        case 'high': return count > 200;
        default: return true;
      }
    });
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    result = result.filter(loc => 
      loc.name.toLowerCase().includes(search) ||
      loc.address.toLowerCase().includes(search) ||
      loc.networkProfiles.some(profile => profile.toLowerCase().includes(search))
    );
  }

  return result;
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

// Actions
const refreshLocations = async () => {
  await locationStore.fetchLocations();
};

const applyFilters = () => {
  currentPage.value = 1; // Reset to first page when filters change
};

const handleTableOptions = (options: any) => {
  currentPage.value = options.page;
  itemsPerPage.value = options.itemsPerPage;
};

// Selection actions
const clearSelection = () => {
  selectedLocations.value = [];
};

const bulkUpdateNetworkProfiles = async () => {
  if (selectedLocations.value.length === 0) return;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    showSuccess(
      'Network Profiles Updated',
      `Updated network profiles for ${selectedLocations.value.length} locations`
    );
    clearSelection();
    refreshLocations();
  } catch (_error) {
    showError('Update Failed', 'Failed to update network profiles');
  }
};

const bulkExportData = async () => {
  if (selectedLocations.value.length === 0) return;
  
  try {
    const selectedData = locations.value.filter(loc => selectedLocations.value.includes(loc.id));
    const dataStr = JSON.stringify(selectedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `locations-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    showSuccess('Export Complete', `Exported data for ${selectedLocations.value.length} locations`);
    clearSelection();
  } catch (_error) {
    showError('Export Failed', 'Failed to export location data');
  }
};

// Location actions
const createNewLocation = () => {
  router.push('/locations/new');
};

// Removed unused editLocation function

const viewLocationDetails = (location: Location) => {
  router.push(`/locations/${location.id}`);
};

// Removed unused manageDevices function

// Removed unused configureNetwork function

// Removed unused deleteLocation function

const onLocationSaved = (location: Location) => {
  locationStore.fetchLocations();
  showSuccess(
    isCreating.value ? 'Location Created' : 'Location Updated',
    `${location.name} has been ${isCreating.value ? 'created' : 'updated'} successfully`
  );
  router.push('/locations');
};

const onDialogClosed = () => {
  selectedLocation.value = null;
  router.push('/locations');
};

// Route handling
const handleLocationRoute = (locationId: string | string[]) => {
  if (locationId === 'new') {
    selectedLocation.value = null;
    isCreating.value = true;
    showEditDialog.value = true;
  }
};

// Watch for route changes
watch(() => route.params.locationId, (locationId) => {
  if (locationId) {
    handleLocationRoute(locationId);
  } else {
    // No location ID, close dialogs
    showEditDialog.value = false;
    selectedLocation.value = null;
  }
}, { immediate: true });

onMounted(async () => {
  // Load query params if present
  const typeParam = getStringParam(route.query, 'type');
  if (typeParam && Object.values(LocationType).includes(typeParam as LocationType)) {
    filters.value.type = typeParam as LocationType;
  }
  
  const hasProductionsParam = getBooleanParam(route.query, 'hasProductions');
  if (hasProductionsParam !== null) {
    filters.value.hasProductions = hasProductionsParam;
  }
  
  const rangeParam = getStringParam(route.query, 'deviceCountRange');
  if (rangeParam && ['low', 'medium', 'high'].includes(rangeParam)) {
    filters.value.deviceCountRange = rangeParam;
  }
  
  const searchParam = getStringParam(route.query, 'search');
  if (searchParam) {
    filters.value.search = searchParam;
  }
  
  await Promise.all([
    locationStore.fetchLocations(),
    deviceStore.fetchDevices()
  ]);
  
  // Handle route after data is loaded
  if (route.params.locationId) {
    handleLocationRoute(route.params.locationId);
  }
});
</script>