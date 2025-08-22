<template>
  <div class="notification-container">
    <v-slide-x-transition group>
      <v-alert
        v-for="notification in notifications"
        :key="notification.id"
        :type="notification.type"
        :title="notification.title"
        :text="notification.message"
        variant="flat"
        closable
        class="notification-item mb-2"
        @click:close="removeNotification(notification.id)"
      >
        <template #prepend>
          <v-icon>
            {{ getNotificationIcon(notification.type) }}
          </v-icon>
        </template>
      </v-alert>
    </v-slide-x-transition>
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from '@/composables/useNotifications';

const { notifications, removeNotification } = useNotifications();

const getNotificationIcon = (type: string): string => {
  const icons = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information'
  };
  return icons[type as keyof typeof icons] || 'mdi-information';
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 80px;
  right: 16px;
  z-index: 9999;
  max-width: 400px;
  width: 100%;
}

.notification-item {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .notification-container {
    right: 8px;
    left: 8px;
    max-width: none;
  }
}
</style>