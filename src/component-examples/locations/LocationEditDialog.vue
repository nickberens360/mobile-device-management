<template>
  <ExampleComponentUsage
    :prop-items="propItems"
    :event-items="eventItems"
    :slot-items="slotItems"
    description="A dialog component for editing location information with form validation and network profile management."
  >
    <div>
      <v-btn
        color="primary"
        @click="openDialog"
      >
        Edit Location
      </v-btn>
      <LocationEditDialog
        :location="selectedLocation"
        :model-value="showDialog"
        :is-creating="false"
        @update:model-value="showDialog = $event"
        @location-updated="handleLocationUpdated"
        @location-deleted="handleLocationDeleted"
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
      <v-switch
        v-if="item.name === 'isCreating'"
        :model-value="false"
        density="compact"
        hide-details
        disabled
      />
    </template>
  </ExampleComponentUsage>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import LocationEditDialog from '@/components/locations/LocationEditDialog.vue';
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

const handleLocationUpdated = (location: Location) => {
  console.log('Location updated:', location);
  closeDialog();
};

const handleLocationDeleted = (locationId: string) => {
  console.log('Location deleted:', locationId);
  closeDialog();
};

const propItems = [
  {
    name: 'location',
    type: 'Location',
    default: null,
    description: 'Location to edit'
  },
  {
    name: 'modelValue',
    type: 'boolean',
    default: false,
    description: 'Controls dialog visibility (v-model)'
  },
  {
    name: 'isCreating',
    type: 'boolean',
    default: false,
    description: 'Whether this is creating a new location'
  }
];

const eventItems = [
  {
    event: 'update:model-value',
    payload: 'boolean',
    description: 'Emitted when dialog visibility changes (v-model).',
  },
  {
    event: 'location-updated',
    payload: 'Location',
    description: 'Emitted when the location is successfully updated.',
  },
  {
    event: 'location-deleted',
    payload: 'string (locationId)',
    description: 'Emitted when the location is deleted.',
  },
];

const slotItems = [
  {
    name: 'additional-fields',
    content: 'custom form fields',
    description: 'Slot for adding custom form fields to the location edit form.',
  },
  {
    name: 'additional-actions',
    content: 'action buttons',
    description: 'Slot for additional action buttons in the dialog footer.',
  },
];
</script>