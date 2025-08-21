<template>
  <ExampleComponentUsage
    :prop-items="propItems"
    :event-items="eventItems"
    :slot-items="slotItems"
    description="A simple loading spinner component with customizable size, width, and container height."
  >
    <LoadingSpinner
      :size="size"
      :width="width"
      :min-height="minHeight"
    />
    <template #[`item.actions`]="{item}">
      <v-text-field
        v-if="item.name === 'size'"
        v-model.number="size"
        type="number"
        density="compact"
        hide-details
        min="16"
        max="200"
      />
      <v-text-field
        v-if="item.name === 'width'"
        v-model.number="width"
        type="number"
        density="compact"
        hide-details
        min="1"
        max="10"
      />
      <v-text-field
        v-if="item.name === 'minHeight'"
        v-model="minHeight"
        type="text"
        density="compact"
        hide-details
        placeholder="e.g., 200px, 50vh"
      />
    </template>
  </ExampleComponentUsage>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const size = ref(64);
const width = ref(4);
const minHeight = ref('300px');

const propItems = [
  {
    name: 'size',
    type: 'number',
    default: '64',
    description: 'Size of the spinner in pixels'
  },
  {
    name: 'width',
    type: 'number',
    default: '4',
    description: 'Width of the spinner stroke'
  },
  {
    name: 'minHeight',
    type: 'string',
    default: '300px',
    description: 'Minimum height of the container'
  }
];

const eventItems = [
  {
    event: 'none',
    payload: 'none',
    description: 'This component does not emit any events.',
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