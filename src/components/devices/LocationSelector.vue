<template>
  <v-card>
    <v-card-title>Select Location</v-card-title>
    <v-card-text>
      <v-autocomplete
        v-model="selectedLocation"
        :items="locations"
        item-title="name"
        item-value="id"
        label="Choose a location"
        variant="outlined"
        prepend-inner-icon="mdi-map-marker"
        :loading="loading"
        clearable
        @update:model-value="onLocationChange"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <v-icon>mdi-map-marker</v-icon>
            </template>
            <template v-slot:append>
              <v-chip size="small" color="primary" variant="tonal">
                {{ item.raw.deviceCount }} devices
              </v-chip>
            </template>
            <v-list-item-subtitle>
              {{ item.raw.address }}
            </v-list-item-subtitle>
          </v-list-item>
        </template>
      </v-autocomplete>

      <v-card
        v-if="selectedLocationData"
        variant="outlined"
        class="mt-4"
      >
        <v-card-text>
          <div class="d-flex align-center mb-2">
            <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
            <div class="text-h6">{{ selectedLocationData.name }}</div>
          </div>
          <v-chip
            size="small"
            color="secondary"
            variant="tonal"
            class="mr-2"
          >
            {{ selectedLocationData.type.replace('_', ' ') }}
          </v-chip>
          <div class="text-body-2 text-medium-emphasis mt-2">
            {{ selectedLocationData.address }}
          </div>
          <div v-if="selectedLocationData.activeProductions?.length" class="mt-2">
            <div class="text-body-2 font-weight-bold mb-1">Active Productions:</div>
            <v-chip
              v-for="production in selectedLocationData.activeProductions"
              :key="production"
              size="small"
              variant="outlined"
              class="mr-1"
            >
              {{ production }}
            </v-chip>
          </div>
          <div class="mt-2">
            <div class="text-body-2 font-weight-bold mb-1">Network Profiles:</div>
            <v-chip
              v-for="profile in selectedLocationData.networkProfiles"
              :key="profile"
              size="small"
              color="accent"
              variant="tonal"
              class="mr-1"
            >
              {{ profile }}
            </v-chip>
          </div>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useLocationStore } from '@/stores/locations';
import type { Location } from '@/types/location';

const locationStore = useLocationStore();

const selectedLocation = ref<string>('');
const loading = computed(() => locationStore.loading);
const locations = computed(() => locationStore.locations);

const selectedLocationData = computed(() => {
  return locations.value.find(loc => loc.id === selectedLocation.value);
});

const emit = defineEmits<{
  locationSelected: [location: Location];
}>();

const onLocationChange = (locationId: string) => {
  const location = locations.value.find(loc => loc.id === locationId);
  if (location) {
    emit('locationSelected', location);
  }
};

onMounted(async () => {
  await locationStore.fetchLocations();
});
</script>