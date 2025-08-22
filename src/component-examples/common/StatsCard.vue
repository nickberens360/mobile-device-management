<template>
  <ExampleComponentUsage
    :prop-items="propItems"
    :event-items="eventItems"
    :slot-items="slotItems"
    description="A flexible statistics card component that displays a title, value, icon, and optional action button. Perfect for dashboards and overview pages."
  >
    <StatsCard
      :title="title"
      :value="value"
      :icon="icon"
      :suffix="suffix"
      :height="height"
      :icon-size="iconSize"
      :icon-color="iconColor"
      :value-color="valueColor"
      :has-action="hasAction"
      :action-text="actionText"
      :action-color="actionColor"
      @action-click="handleActionClick"
    />
    <template #[`item.actions`]="{item}">
      <v-text-field
        v-if="item.name === 'title'"
        v-model="title"
        type="text"
        density="compact"
        hide-details
      />
      <v-text-field
        v-if="item.name === 'value'"
        v-model="value"
        type="text"
        density="compact"
        hide-details
      />
      <v-text-field
        v-if="item.name === 'icon'"
        v-model="icon"
        type="text"
        density="compact"
        hide-details
      />
      <v-text-field
        v-if="item.name === 'suffix'"
        v-model="suffix"
        type="text"
        density="compact"
        hide-details
      />
      <v-text-field
        v-if="item.name === 'height'"
        v-model.number="height"
        type="number"
        density="compact"
        hide-details
      />
      <v-text-field
        v-if="item.name === 'iconSize'"
        v-model.number="iconSize"
        type="number"
        density="compact"
        hide-details
      />
      <v-select
        v-if="item.name === 'iconColor'"
        v-model="iconColor"
        :items="colorOptions"
        density="compact"
        hide-details
      />
      <v-select
        v-if="item.name === 'valueColor'"
        v-model="valueColor"
        :items="colorOptions"
        density="compact"
        hide-details
      />
      <v-switch
        v-if="item.name === 'hasAction'"
        v-model="hasAction"
        density="compact"
        hide-details
      />
      <v-text-field
        v-if="item.name === 'actionText'"
        v-model="actionText"
        type="text"
        density="compact"
        hide-details
      />
      <v-select
        v-if="item.name === 'actionColor'"
        v-model="actionColor"
        :items="colorOptions"
        density="compact"
        hide-details
      />
    </template>
  </ExampleComponentUsage>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import StatsCard from '@/components/common/StatsCard.vue';

const title = ref('Total Devices');
const value = ref('1,234');
const icon = ref('mdi-devices');
const suffix = ref('');
const height = ref(140);
const iconSize = ref(48);
const iconColor = ref('primary');
const valueColor = ref('');
const hasAction = ref(true);
const actionText = ref('View Details');
const actionColor = ref('');

const colorOptions = [
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info',
  'red',
  'green',
  'blue',
  'orange',
  'purple'
];

const handleActionClick = () => {
  console.log('Action button clicked!');
};

const propItems = [
  {
    name: 'title',
    type: 'string',
    default: '',
    description: 'The title/label for the stat'
  },
  {
    name: 'value',
    type: 'string | number',
    default: '',
    description: 'The main value to display'
  },
  {
    name: 'icon',
    type: 'string',
    default: '',
    description: 'Material Design icon name'
  },
  {
    name: 'suffix',
    type: 'string',
    default: '',
    description: 'Text to append to the value'
  },
  {
    name: 'height',
    type: 'number',
    default: '140',
    description: 'Card height in pixels'
  },
  {
    name: 'iconSize',
    type: 'number',
    default: '48',
    description: 'Icon size in pixels'
  },
  {
    name: 'iconColor',
    type: 'string',
    default: 'primary',
    description: 'Icon color (Vuetify color name)'
  },
  {
    name: 'valueColor',
    type: 'string',
    default: '',
    description: 'Value text color (defaults to iconColor)'
  },
  {
    name: 'hasAction',
    type: 'boolean',
    default: false,
    description: 'Whether to show action button'
  },
  {
    name: 'actionText',
    type: 'string',
    default: 'View',
    description: 'Action button text'
  },
  {
    name: 'actionColor',
    type: 'string',
    default: '',
    description: 'Action button color (defaults to iconColor)'
  }
];

const eventItems = [
  {
    event: 'action-click',
    payload: 'void',
    description: 'Emitted when the action button is clicked (only when hasAction is true).',
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