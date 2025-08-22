<template>
  <!-- Skip Navigation Links -->
  <div class="skip-links">
    <a 
      href="#main-content" 
      class="skip-link"
      @click="skipToMain"
    >
      Skip to main content
    </a>
    <a 
      href="#navigation" 
      class="skip-link"
      @click="skipToNav"
    >
      Skip to navigation
    </a>
  </div>

  <v-layout>
    <header role="banner">
      <AppHeader />
    </header>
    
    <nav 
      id="navigation"
      role="navigation" 
      aria-label="Main navigation"
    >
      <AppSidebar />
    </nav>

    <v-main role="main">
      <v-container 
        id="main-content"
        fluid
        tabindex="-1"
      >
        <router-view />
      </v-container>
    </v-main>

    <!-- Live region for announcements -->
    <div 
      id="announcements"
      aria-live="polite" 
      aria-atomic="true" 
      class="sr-only"
    >
      {{ announcement }}
    </div>

    <NotificationContainer />
  </v-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import AppHeader from '@/components/common/AppHeader.vue';
import NotificationContainer from '@/components/common/NotificationContainer.vue';

const announcement = ref('');

const skipToMain = () => {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.focus();
    announcement.value = 'Jumped to main content';
    setTimeout(() => {
      announcement.value = '';
    }, 1000);
  }
};

const skipToNav = () => {
  const navigation = document.getElementById('navigation');
  if (navigation) {
    const firstFocusable = navigation.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      (firstFocusable as HTMLElement).focus();
      announcement.value = 'Jumped to navigation';
      setTimeout(() => {
        announcement.value = '';
      }, 1000);
    }
  }
};
</script>

<style scoped>
.skip-links {
  position: relative;
  z-index: 9999;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  z-index: 9999;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>