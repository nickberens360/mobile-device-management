<template>
  <ExampleComponentUsage
    :prop-items="propItems"
    :event-items="eventItems"
    :slot-items="slotItems"
    description="A dialog component for viewing detailed location information including device counts, network profiles, and management actions."
  >
    <div>
      <v-btn
        color="primary"
        @click="openDialog"
      >
        View Location Details
      </v-btn>
      <LocationDetailsDialog
        :location="selectedLocation"
        :model-value="showDialog"
        @update:model-value="showDialog = $event"
        @edit="handleEdit"
        @manage-devices="handleManageDevices"
        @view-activity="handleViewActivity"
      />
    </div>
    <template #[`item.actions`]="{item}">
      <v-select
        v-if="item.name === 'location'"
        v-model="selectedLocationId"
        :items="locationOptions"
        density="compact"
        hide-details
        @update:model-value="updateSelectedLocation"
      />
      <v-switch
        v-if="item.name === 'modelValue'"
        v-model="showDialog"
        density="compact"
        hide-details
      />
    </template>
  </ExampleComponentUsage>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import LocationDetailsDialog from '@/components/locations/LocationDetailsDialog.vue';
import type { Location } from '@/types/location';
import { LocationType } from '@/types/location';

const showDialog = ref(false);
const selectedLocationId = ref('loc-1');

const mockLocations: Location[] = [
  {
    id: 'loc-1',
    name: 'Universal Studios - Stage 12',
    type: LocationType.BROADCAST_STUDIO,
    address: '100 Universal City Plaza, Universal City, CA',
    activeProductions: ['Jurassic World: Dominion', 'Fast & Furious 11'],
    deviceCount: 87,
    networkProfiles: ['PROD_WIFI', 'GUEST_WIFI', 'SECURITY_NET']
  },
  {
    id: 'loc-2',
    name: 'Universal Orlando - Islands of Adventure',
    type: LocationType.THEME_PARK,
    address: '6000 Universal Blvd, Orlando, FL',
    activeProductions: [],
    deviceCount: 234,
    networkProfiles: ['PARK_WIFI', 'STAFF_WIFI', 'GUEST_WIFI']
  },
  {
    id: 'loc-3',
    name: '30 Rockefeller Plaza',
    type: LocationType.CORPORATE_OFFICE,
    address: '30 Rockefeller Plaza, New York, NY',
    activeProductions: [],
    deviceCount: 156,
    networkProfiles: ['CORP_WIFI', 'GUEST_WIFI', 'EXEC_NET']
  },
  {
    id: 'loc-4',
    name: 'NBC Sports Production Facility',
    type: LocationType.BROADCAST_STUDIO,
    address: '1 Blachley Rd, Stamford, CT',
    activeProductions: ['Sunday Night Football', 'Olympics Coverage'],
    deviceCount: 98,
    networkProfiles: ['BROADCAST_NET', 'PRODUCTION_WIFI', 'GUEST_WIFI']
  }
];

const selectedLocation = computed(() => 
  mockLocations.find(l => l.id === selectedLocationId.value) || mockLocations[0]
);

const locationOptions = mockLocations.map(location => ({
  title: `${location.name} (${location.type})`,
  value: location.id
}));

const openDialog = () => {
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const updateSelectedLocation = (locationId: string) => {
  selectedLocationId.value = locationId;
};

const handleEdit = (location: Location) => {
  console.log('Edit location:', location);
  closeDialog();
};

const handleManageDevices = (location: Location) => {
  console.log('Manage devices for location:', location);
  closeDialog();
};

const handleViewActivity = (location: Location) => {
  console.log('View activity for location:', location);
  closeDialog();
};

const propItems = [
  {
    name: 'location',
    type: 'Location',
    default: null,
    description: 'Location to display details for'
  },
  {
    name: 'modelValue',
    type: 'boolean',
    default: false,
    description: 'Controls dialog visibility (v-model)'
  }
];

const eventItems = [
  {
    event: 'update:model-value',
    payload: 'boolean',
    description: 'Emitted when dialog visibility changes (v-model).',
  },
  {
    event: 'edit',
    payload: 'Location',
    description: 'Emitted when the edit button is clicked.',
  },
  {
    event: 'manage-devices',
    payload: 'Location',
    description: 'Emitted when the manage devices button is clicked.',
  },
  {
    event: 'view-activity',
    payload: 'Location',
    description: 'Emitted when the view activity button is clicked.',
  },
];

const slotItems = [
  {
    name: 'additional-info',
    content: 'extra content',
    description: 'Slot for additional location information sections.',
  },
  {
    name: 'actions',
    content: 'action buttons',
    description: 'Slot for custom action buttons in the dialog footer.',
  },
];
</script>