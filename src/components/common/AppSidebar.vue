<template>
  <v-navigation-drawer
    v-model="drawer"
    rail-width="72"
    permanent
    height="100vh"
    style="position: fixed;"
    role="navigation"
    aria-label="Main navigation menu"
  >
    <v-list 
      nav
      role="menubar"
      aria-label="Navigation links"
    >
      <v-list-item
        v-for="item in navigationItems"
        :key="item.title"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        color="primary"
        role="menuitem"
        :aria-label="`Navigate to ${item.title}`"
        :aria-current="isCurrentPage(item.to) ? 'page' : undefined"
      />
    </v-list>

    <template #append>
      <v-divider role="separator" />
      <v-list 
        nav
        role="menubar"
        aria-label="Additional links"
      >
        <v-list-item
          prepend-icon="mdi-code-tags"
          title="Component Docs"
          href="/atomic-docs"
          target="_blank"
          role="menuitem"
          aria-label="Open component documentation in new tab"
        />
        <v-list-item
          prepend-icon="mdi-help-circle-outline"
          title="Help"
          role="menuitem"
          aria-label="Get help"
        />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useDrawer } from '@/composables/useDrawer';

const route = useRoute();
const { drawer } = useDrawer();

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
    title: 'Locations',
    icon: 'mdi-map-marker',
    to: '/locations'
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

const isCurrentPage = (path: string): boolean => {
  return route.path === path || route.path.startsWith(path + '/');
};
</script>

