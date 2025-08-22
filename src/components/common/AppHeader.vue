<template>
  <v-app-bar
    elevation="1"
    color="surface"
    app
    fixed
    class="d-flex align-center justify-space-between"
    style="position: fixed !important; top: 0 !important; z-index: 1000 !important;"
    role="banner"
  >
    <v-app-bar-nav-icon 
      :aria-label="drawerOpen ? 'Close navigation menu' : 'Open navigation menu'"
      :aria-expanded="drawerOpen"
      aria-controls="navigation"
      @click="toggleDrawer"
    />

    <v-img
      :src="logoUrl"
      alt="NBC Universal logo"
      contain
      class="mr-1"
      style="max-width: 150px;"
      role="img"
    />

    <v-toolbar-title class="mb-0">
      <h1 class="text-h6 font-weight-medium">
        Device Manager
      </h1>
    </v-toolbar-title>

    <v-spacer />

    <v-btn
      :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
      :aria-label="theme.global.current.value.dark ? 'Switch to light theme' : 'Switch to dark theme'"
      @click="toggleTheme"
    />

    <v-btn 
      icon="mdi-bell-outline"
      aria-label="Notifications"
      :aria-describedby="hasNotifications ? 'notification-count' : undefined"
    />

    <v-menu>
      <template #activator="{ props }">
        <v-btn
          icon="mdi-account-circle"
          v-bind="props"
          aria-label="User menu"
          aria-haspopup="true"
          :aria-expanded="menuOpen"
        />
      </template>
      <v-list
        role="menu"
        aria-label="User actions"
      >
        <v-list-item role="menuitem">
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item role="menuitem">
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
        <v-divider role="separator" />
        <v-list-item
          role="menuitem"
          @click="logout"
        >
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { useDrawer } from '@/composables/useDrawer';
import { useUserStore } from '@/stores/user';
import logoUrl from '@/assets/logo.png';

const router = useRouter();
const userStore = useUserStore();
const theme = useTheme();
const { drawer, toggleDrawer } = useDrawer();

const menuOpen = ref(false);
const hasNotifications = ref(false); // This would come from a notifications store in a real app

const drawerOpen = computed(() => drawer.value);

const toggleTheme = () => {
  const newTheme = theme.global.current.value.dark ? 'light' : 'dark';
  theme.global.name.value = newTheme;
  
  // Announce theme change
  const announcement = document.getElementById('announcements');
  if (announcement) {
    announcement.textContent = `Switched to ${newTheme} theme`;
  }
};

const logout = () => {
  userStore.logout();
  router.push('/login');
};
</script>