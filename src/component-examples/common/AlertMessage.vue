<template>
  <ExampleComponentUsage
    :prop-items="propItems"
    :event-items="eventItems"
    :slot-items="slotItems"
    description="A versatile alert component for displaying informational, warning, success, or error messages with optional actions."
  >
    <AlertMessage
      :type="type"
      :title="title"
      :text="text"
      :closable="closable"
      :variant="variant"
      v-model="visible"
    />
    <template #[`item.actions`]="{item}">
      <v-select
        v-if="item.name === 'type'"
        v-model="type"
        :items="alertTypes"
        density="compact"
        hide-details
      />
      <v-text-field
        v-if="item.name === 'title'"
        v-model="title"
        type="text"
        density="compact"
        hide-details
      />
      <v-textarea
        v-if="item.name === 'text'"
        v-model="text"
        density="compact"
        hide-details
        rows="2"
      />
      <v-switch
        v-if="item.name === 'closable'"
        v-model="closable"
        density="compact"
        hide-details
      />
      <v-select
        v-if="item.name === 'variant'"
        v-model="variant"
        :items="variantTypes"
        density="compact"
        hide-details
      />
      <v-switch
        v-if="item.name === 'modelValue'"
        v-model="visible"
        density="compact"
        hide-details
      />
    </template>
  </ExampleComponentUsage>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AlertMessage from '@/components/common/AlertMessage.vue';

const type = ref('info');
const title = ref('Information');
const text = ref('This is an informational message to help guide the user.');
const closable = ref(true);
const variant = ref('tonal');
const visible = ref(true);

const alertTypes = [
  { title: 'Info', value: 'info' },
  { title: 'Success', value: 'success' },
  { title: 'Warning', value: 'warning' },
  { title: 'Error', value: 'error' }
];

const variantTypes = [
  { title: 'Flat', value: 'flat' },
  { title: 'Text', value: 'text' },
  { title: 'Elevated', value: 'elevated' },
  { title: 'Tonal', value: 'tonal' },
  { title: 'Outlined', value: 'outlined' },
  { title: 'Plain', value: 'plain' }
];


const propItems = [
  {
    name: 'type',
    type: "'success' | 'info' | 'warning' | 'error'",
    default: 'info',
    description: 'Alert type'
  },
  {
    name: 'title',
    type: 'string',
    default: undefined,
    description: 'Alert title'
  },
  {
    name: 'text',
    type: 'string',
    default: undefined,
    description: 'Alert text content'
  },
  {
    name: 'closable',
    type: 'boolean',
    default: true,
    description: 'Whether the alert can be closed'
  },
  {
    name: 'variant',
    type: "'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'",
    default: 'tonal',
    description: 'Alert variant style'
  },
  {
    name: 'modelValue',
    type: 'boolean',
    default: true,
    description: 'Controls alert visibility (v-model)'
  }
];

const eventItems = [
  {
    event: 'update:modelValue',
    payload: 'boolean',
    description: 'Emitted when alert visibility changes.',
  },
];

const slotItems = [
  {
    name: 'default',
    content: 'message text',
    description: 'Default slot for custom message content.',
  },
  {
    name: 'actions',
    content: 'action buttons',
    description: 'Slot for custom action buttons.',
  },
];
</script>