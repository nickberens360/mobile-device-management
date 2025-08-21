<template>
  <ExampleComponentUsage
    :prop-items="propItems"
    :event-items="eventItems"
    :slot-items="slotItems"
    description="A smart list item component for displaying configuration activities with intelligent navigation based on activity type. Automatically routes to appropriate views when clicked."
  >
    <v-list class="border">
      <ConfigurationActivityItem
        :activity="activity"
      />
    </v-list>
    <template #[`item.actions`]="{item}">
      <v-text-field
        v-if="item.name === 'activity.title'"
        v-model="activity.title"
        type="text"
        density="compact"
        hide-details
      />
      <v-text-field
        v-if="item.name === 'activity.subtitle'"
        v-model="activity.subtitle"
        type="text"
        density="compact"
        hide-details
      />
      <v-text-field
        v-if="item.name === 'activity.icon'"
        v-model="activity.icon"
        type="text"
        density="compact"
        hide-details
      />
      <v-select
        v-if="item.name === 'activity.color'"
        v-model="activity.color"
        :items="colorOptions"
        density="compact"
        hide-details
      />
      <v-text-field
        v-if="item.name === 'activity.time'"
        v-model="activity.time"
        type="text"
        density="compact"
        hide-details
      />
      <v-select
        v-if="item.name === 'activity.type'"
        v-model="activity.type"
        :items="activityTypes"
        density="compact"
        hide-details
      />
      <v-text-field
        v-if="item.name === 'activity.locationId'"
        v-model="activity.locationId"
        type="text"
        density="compact"
        hide-details
      />
      <v-text-field
        v-if="item.name === 'activity.templateId'"
        v-model="activity.templateId"
        type="text"
        density="compact"
        hide-details
      />
      <v-text-field
        v-if="item.name === 'activity.deviceIds'"
        v-model="deviceIdsText"
        type="text"
        density="compact"
        hide-details
        placeholder="device1,device2,device3"
        @input="updateDeviceIds"
      />
    </template>
  </ExampleComponentUsage>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ConfigurationActivityItem, { type ConfigurationActivity } from '@/components/common/ConfigurationActivityItem.vue';

const activity = ref<ConfigurationActivity>({
  id: 1,
  title: '15 devices configured',
  subtitle: 'Universal Studios - Stage 12',
  icon: 'mdi-check-circle',
  color: 'success',
  time: '2 hours ago',
  type: 'device_configuration',
  locationId: 'loc-1',
  templateId: '',
  deviceIds: ['dev-001', 'dev-002', 'dev-003']
});

const deviceIdsText = computed({
  get: () => activity.value.deviceIds?.join(',') || '',
  set: (value: string) => {
    activity.value.deviceIds = value ? value.split(',').map(id => id.trim()) : [];
  }
});

const updateDeviceIds = (event: Event) => {
  const target = event.target as HTMLInputElement;
  deviceIdsText.value = target.value;
};

const colorOptions = [
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info'
];

const activityTypes = [
  { title: 'Device Configuration', value: 'device_configuration' },
  { title: 'Template Update', value: 'template_update' },
  { title: 'Template Create', value: 'template_create' },
  { title: 'Configuration Failure', value: 'configuration_failure' }
];

const propItems = [
  {
    name: 'activity',
    type: 'ConfigurationActivity',
    default: 'null',
    description: 'Activity object with navigation metadata'
  }
];

const eventItems = [
  {
    event: 'click',
    payload: 'void',
    description: 'Automatically emitted when the item is clicked. Navigates based on activity type and available metadata.',
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