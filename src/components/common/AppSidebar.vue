<template>
  <v-navigation-drawer
    v-model="drawer"
    rail-width="72"
    permanent
  >
    <v-list nav>
      <v-list-item
        v-for="item in navigationItems"
        :key="item.title"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        color="primary"
      />
    </v-list>

    <template v-slot:append>
      <v-divider />
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-help-circle-outline"
          title="Help"
        />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawer = ref(true);

const navigationItems = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    to: '/dashboard'
  },
  {
    title: 'Configure Devices',
    icon: 'mdi-cog',
    to: '/configure'
  },
  {
    title: 'Device Management',
    icon: 'mdi-devices',
    to: '/devices'
  },
  {
    title: 'Templates',
    icon: 'mdi-file-document-multiple',
    to: '/templates'
  },
  {
    title: 'History',
    icon: 'mdi-history',
    to: '/history'
  }
];
</script>