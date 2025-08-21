<template>
  <v-container fluid>
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4">Configuration Templates</h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
      >
        Create Template
      </v-btn>
    </div>
    
    <v-row>
      <v-col
        v-for="template in templates"
        :key="template.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="h-100">
          <v-card-title>
            {{ template.name }}
            <v-spacer />
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-dots-vertical"
                  size="small"
                  variant="text"
                  v-bind="props"
                />
              </template>
              <v-list>
                <v-list-item @click="editTemplate(template)">
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteTemplate(template)">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          
          <v-card-text>
            <p class="text-body-2 mb-3">{{ template.description }}</p>
            
            <div class="mb-3">
              <div class="text-subtitle-2 mb-1">Supported Devices:</div>
              <v-chip
                v-for="deviceType in template.deviceTypes"
                :key="deviceType"
                size="small"
                variant="outlined"
                class="mr-1"
              >
                {{ deviceType.replace('_', ' ') }}
              </v-chip>
            </div>
            
            <div class="mb-3">
              <div class="text-subtitle-2 mb-1">Network:</div>
              <v-chip size="small" color="primary" variant="tonal">
                {{ template.settings.network.ssid }}
              </v-chip>
            </div>
            
            <div class="mb-3">
              <div class="text-subtitle-2 mb-1">Security Features:</div>
              <v-icon 
                size="small"
                :color="template.settings.security.encryption ? 'success' : 'grey'"
                class="mr-1"
              >
                {{ template.settings.security.encryption ? 'mdi-check' : 'mdi-close' }}
              </v-icon>
              <span class="text-caption mr-3">Encryption</span>
              
              <v-icon 
                size="small"
                :color="template.settings.security.remoteWipe ? 'success' : 'grey'"
                class="mr-1"
              >
                {{ template.settings.security.remoteWipe ? 'mdi-check' : 'mdi-close' }}
              </v-icon>
              <span class="text-caption">Remote Wipe</span>
            </div>
          </v-card-text>
          
          <v-card-actions>
            <v-chip size="small" variant="tonal">
              Updated {{ formatDate(template.updatedAt) }}
            </v-chip>
            <v-spacer />
            <v-btn
              variant="outlined"
              size="small"
              @click="useTemplate(template)"
            >
              Use Template
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTemplateStore } from '@/stores/templates';
import type { ConfigurationTemplate } from '@/types/template';

const router = useRouter();
const templateStore = useTemplateStore();

const templates = computed(() => templateStore.templates);

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

const editTemplate = (template: ConfigurationTemplate) => {
  console.log('Edit template:', template.name);
};

const deleteTemplate = (template: ConfigurationTemplate) => {
  console.log('Delete template:', template.name);
};

const useTemplate = (_template: ConfigurationTemplate) => {
  router.push('/configure');
};

onMounted(() => {
  templateStore.fetchTemplates();
});
</script>