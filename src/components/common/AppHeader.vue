<template>
  <v-app-bar
    elevation="1"
    color="surface"
    class="d-flex align-center justify-space-between"
  >
    <v-app-bar-nav-icon @click="toggleDrawer" />

    <v-img
      :src="logoUrl"
      alt="NBC Logo"
      contain
      class="mr-1"
      style="max-width: 150px;"
    />

    <v-toolbar-title class="mb-0">
      Device Manager
    </v-toolbar-title>

    <v-spacer />

    <v-btn
      :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
      @click="toggleTheme"
    />

    <v-btn icon="mdi-bell-outline" />

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-account-circle"
          v-bind="props"
        />
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { useDrawer } from '@/composables/useDrawer';
import { useUserStore } from '@/stores/user';
import logoUrl from '@/assets/logo.png';

const router = useRouter();
const userStore = useUserStore();
const theme = useTheme();
const { toggleDrawer } = useDrawer();

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
};

const logout = () => {
  userStore.logout();
  router.push('/login');
};
</script>