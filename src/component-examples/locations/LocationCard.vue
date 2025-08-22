<template>
  <ExampleComponentUsage
    :prop-items="propItems"
    :event-items="eventItems"
    :slot-items="slotItems"
    description="A clickable card component for displaying location information with device status indicators. Automatically navigates to location details when clicked."
  >
    <LocationCard
      :location="location"
      :online-count="onlineCount"
      :total-count="totalCount"
      :show-details="showDetails"
    />
    <template #[`item.actions`]="{item}">
      <v-text-field
        v-if="item.name === 'location.name'"
        v-model="location.name"
        type="text"
        density="compact"
        hide-details
      />
      <v-select
        v-if="item.name === 'location.type'"
        v-model="location.type"
        :items="locationTypes"
        density="compact"
        hide-details
      />
      <v-text-field
        v-if="item.name === 'location.address'"
        v-model="location.address"
        type="text"
        density="compact"
        hide-details
      />
      <v-text-field
        v-if="item.name === 'onlineCount'"
        v-model.number="onlineCount"
        type="number"
        density="compact"
        hide-details
        min="0"
        :max="totalCount"
      />
      <v-text-field
        v-if="item.name === 'totalCount'"
        v-model.number="totalCount"
        type="number"
        density="compact"
        hide-details
        min="0"
      />
      <v-switch
        v-if="item.name === 'showDetails'"
        v-model="showDetails"
        density="compact"
        hide-details
      />
    </template>
  </ExampleComponentUsage>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LocationCard from '@/components/locations/LocationCard.vue';
import type { Location } from '@/types/location';

const location = ref<Location>({
  id: 'example-loc-1',
  name: 'Universal Studios - Stage 12',
  type: 'Studio',
  address: '100 Universal City Plaza, Universal City, CA',
  activeProductions: ['Jurassic World: Dominion'],
  deviceCount: 50,
  networkProfiles: ['PROD_WIFI', 'GUEST_WIFI']
});

const onlineCount = ref(42);
const totalCount = ref(50);
const showDetails = ref(true);

const locationTypes = [
  'Studio',
  'Corporate Office',
  'Theme Park',
  'Production Set',
  'Broadcast Center'
];

const propItems = [
  {
    name: 'location',
    type: 'Location',
    default: null,
    description: 'Location object with details'
  },
  {
    name: 'onlineCount',
    type: 'number',
    default: '0',
    description: 'Number of online devices'
  },
  {
    name: 'totalCount',
    type: 'number',
    default: '0',
    description: 'Total number of devices'
  },
  {
    name: 'showDetails',
    type: 'boolean',
    default: false,
    description: 'Show address and navigation chevron'
  }
];

const eventItems = [
  {
    event: 'click',
    payload: 'void',
    description: 'Automatically emitted when the card is clicked. Navigates to /locations/{locationId}.',
  },
];

const slotItems = [
  {
    name: 'default',
    content: 'none',
    description: 'No default slot available for this component.',
  },
];
</script>