<template>
  <v-container fluid>
    <div class="d-flex justify-space-between align-start mb-6">
      <div>
        <h1 class="text-h4 mb-2">Configuration Templates</h1>
        <p class="text-body-1 text-medium-emphasis">
          Pre-defined configuration templates for different scenarios including film production, theme parks, corporate offices, and media events.
        </p>
      </div>
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
        <v-card class="h-100 clickable" @click="openTemplateDialog(template)">
          <v-card-title>
            {{ template.name }}
            <v-spacer />
            <v-menu @click.stop>
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-dots-vertical"
                  size="small"
                  variant="text"
                  v-bind="props"
                  @click.stop
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
          
          <v-card-actions @click.stop>
            <v-chip size="small" variant="tonal">
              Updated {{ formatDate(template.updatedAt) }}
            </v-chip>
            <v-spacer />
            <v-btn
              variant="outlined"
              size="small"
              prepend-icon="mdi-eye"
              @click="openTemplateDialog(template)"
              class="mr-2"
            >
              View Details
            </v-btn>
            <v-btn
              color="primary"
              size="small"
              @click.stop="useTemplate(template)"
            >
              Use Template
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Template Details Dialog -->
    <TemplateDetailsDialog
      v-model="showTemplateDialog"
      :template="selectedTemplate"
      @template-updated="onTemplateUpdated"
      @template-deleted="onTemplateDeleted"
      @dialog-closed="onDialogClosed"
    />

    <!-- Router outlet for nested routes -->
    <router-view />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTemplateStore } from '@/stores/templates';
import TemplateDetailsDialog from '@/components/forms/TemplateDetailsDialog.vue';
import type { ConfigurationTemplate } from '@/types/template';

const route = useRoute();
const router = useRouter();
const templateStore = useTemplateStore();

const templates = computed(() => templateStore.templates);

const showTemplateDialog = ref(false);
const selectedTemplate = ref<ConfigurationTemplate | null>(null);

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

const openTemplateDialog = (template: ConfigurationTemplate) => {
  router.push(`/templates/${template.id}`);
};

const editTemplate = (template: ConfigurationTemplate) => {
  openTemplateDialog(template);
};

const deleteTemplate = (template: ConfigurationTemplate) => {
  openTemplateDialog(template);
};

const useTemplate = (template: ConfigurationTemplate) => {
  router.push({
    path: '/configure',
    query: {
      templateId: template.id,
      templateName: template.name
    }
  });
};

const onTemplateUpdated = (updatedTemplate: ConfigurationTemplate) => {
  templateStore.fetchTemplates();
  console.log('Template updated:', updatedTemplate.name);
};

const onTemplateDeleted = (templateId: string) => {
  templateStore.fetchTemplates();
  console.log('Template deleted:', templateId);
};

const onDialogClosed = () => {
  if (route.params.templateId) {
    router.push('/templates');
  }
};

const handleTemplateRoute = async (templateId?: string | string[]) => {
  if (templateId && typeof templateId === 'string') {
    // Ensure templates are loaded
    if (templates.value.length === 0) {
      await templateStore.fetchTemplates();
    }
    
    const template = templates.value.find(t => t.id === templateId);
    if (template) {
      selectedTemplate.value = template;
      showTemplateDialog.value = true;
    } else {
      // Template not found, redirect to templates list
      router.push('/templates');
    }
  } else {
    selectedTemplate.value = null;
    showTemplateDialog.value = false;
  }
};

// Watch for route changes to open/close dialog
watch(() => route.params.templateId, handleTemplateRoute, { immediate: true });

// Also watch for templates being loaded to handle initial route
watch(() => templates.value.length, () => {
  if (templates.value.length > 0 && route.params.templateId) {
    handleTemplateRoute(route.params.templateId);
  }
});

onMounted(async () => {
  await templateStore.fetchTemplates();
  // Handle initial route after templates are loaded
  if (route.params.templateId) {
    handleTemplateRoute(route.params.templateId);
  }
});
</script>