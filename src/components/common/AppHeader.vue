<template>
  <v-app-bar
    elevation="1"
    color="white"
  >
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    
    <v-toolbar-title class="text-h6 font-weight-bold">
      NBC Device Manager
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

const router = useRouter();
const userStore = useUserStore();
const drawer = ref(true);

const logout = () => {
  userStore.logout();
  router.push('/login');
};
</script>