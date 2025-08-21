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
      :message="message"
      :dismissible="dismissible"
      :show-icon="showIcon"
      :show="show"
      @dismiss="handleDismiss"
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
        v-if="item.name === 'message'"
        v-model="message"
        density="compact"
        hide-details
        rows="2"
      />
      <v-switch
        v-if="item.name === 'dismissible'"
        v-model="dismissible"
        density="compact"
        hide-details
      />
      <v-switch
        v-if="item.name === 'showIcon'"
        v-model="showIcon"
        density="compact"
        hide-details
      />
      <v-switch
        v-if="item.name === 'show'"
        v-model="show"
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
const message = ref('This is an informational message to help guide the user.');
const dismissible = ref(true);
const showIcon = ref(true);
const show = ref(true);

const alertTypes = [
  { title: 'Info', value: 'info' },
  { title: 'Success', value: 'success' },
  { title: 'Warning', value: 'warning' },
  { title: 'Error', value: 'error' }
];

const handleDismiss = () => {
  console.log('Alert dismissed');
  show.value = false;
  // Reset after a delay for demo purposes
  setTimeout(() => {
    show.value = true;
  }, 2000);
};

const propItems = [
  {
    name: 'type',
    type: 'string',
    default: 'info',
    description: 'Alert type (info, success, warning, error)'
  },
  {
    name: 'title',
    type: 'string',
    default: '',
    description: 'Alert title'
  },
  {
    name: 'message',
    type: 'string',
    default: '',
    description: 'Alert message content'
  },
  {
    name: 'dismissible',
    type: 'boolean',
    default: 'true',
    description: 'Whether the alert can be dismissed'
  },
  {
    name: 'showIcon',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show the alert icon'
  },
  {
    name: 'show',
    type: 'boolean',
    default: 'true',
    description: 'Controls alert visibility'
  }
];

const eventItems = [
  {
    event: 'dismiss',
    payload: 'void',
    description: 'Emitted when the alert is dismissed (only when dismissible is true).',
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