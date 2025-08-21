<template>
  <v-layout>
    <AppHeader />
    <AppSidebar />

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <NotificationContainer />
  </v-layout>
</template>

<script setup lang="ts">
import AppSidebar from '@/components/common/AppSidebar.vue';
import AppHeader from '@/components/common/AppHeader.vue';
import NotificationContainer from '@/components/common/NotificationContainer.vue';
</script>