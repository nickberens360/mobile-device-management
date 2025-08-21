<template>
  <ExampleComponentUsage
    :event-items="eventItems"
    :slot-items="slotItems"
    description="A container component for displaying app-wide notifications with auto-dismiss functionality."
  >
    <div class="position-relative" style="height: 200px; border: 1px dashed #ccc;">
      <NotificationContainer />
      <div class="pa-4">
        <v-btn @click="addNotification('success')" color="success" class="mr-2">
          Add Success
        </v-btn>
        <v-btn @click="addNotification('error')" color="error" class="mr-2">
          Add Error
        </v-btn>
        <v-btn @click="addNotification('warning')" color="warning" class="mr-2">
          Add Warning
        </v-btn>
        <v-btn @click="addNotification('info')" color="info">
          Add Info
        </v-btn>
      </div>
    </div>
    <template #[`item.actions`]="{item}">
      <v-text-field
        v-if="item.name === 'position'"
        v-model="position"
        type="text"
        density="compact"
        hide-details
        readonly
        placeholder="top-right (fixed)"
      />
      <v-text-field
        v-if="item.name === 'autoDismiss'"
        v-model.number="autoDismiss"
        type="number"
        density="compact"
        hide-details
        placeholder="5000ms"
      />
    </template>
  </ExampleComponentUsage>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NotificationContainer from '@/components/common/NotificationContainer.vue';
import { useNotifications } from '@/composables/useNotifications';

const position = ref('top-right');
const autoDismiss = ref(5000);

const { addNotification: addNotificationToStore } = useNotifications();

let notificationCounter = 0;

const addNotification = (type: string) => {
  notificationCounter++;
  addNotificationToStore({
    id: `demo-${notificationCounter}`,
    type: type as any,
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} Notification`,
    message: `This is a demo ${type} notification #${notificationCounter}`,
    timeout: autoDismiss.value
  });
};

const eventItems = [
  {
    event: 'notification-dismissed',
    payload: 'notification object',
    description: 'Emitted when a notification is dismissed by user or auto-timeout.',
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