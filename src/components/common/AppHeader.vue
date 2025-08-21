<template>
  <v-app-bar
    elevation="1"
    color="white"
    class="d-flex align-center justify-space-between"
  >
    <v-app-bar-nav-icon @click="drawer = !drawer" />

    <v-img
      :src="logoUrl"
      alt="NBC Logo"
      contain
      class="mr-3"
      style="max-width: 150px;"
    />

    <v-toolbar-title class="text-h6  mb-0 font-weight-bold">
      Device Manager
    </v-toolbar-title>

    <v-spacer />

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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import logoUrl from '@/assets/logo.png';

const router = useRouter();
const userStore = useUserStore();
const drawer = ref(true);

const logout = () => {
  userStore.logout();
  router.push('/login');
};
</script>