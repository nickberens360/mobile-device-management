<template>
  <v-container fluid>
    <!-- Breadcrumb Navigation -->
    <v-breadcrumbs
      :items="breadcrumbItems"
      class="px-0"
    >
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item
          :to="item.to"
          :disabled="item.disabled"
        >
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <div v-if="loading" class="d-flex justify-center">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <div v-else-if="!template" class="text-center">
      <v-icon size="64" color="grey">mdi-alert</v-icon>
      <h2 class="text-h4 mt-4">Template Not Found</h2>
      <p class="text-body-1 text-medium-emphasis">The requested template could not be found.</p>
      <v-btn color="primary" :to="'/templates'" class="mt-4">
        Back to Templates
      </v-btn>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 mb-2">{{ template.name }}</h1>
          <p class="text-body-1 text-medium-emphasis">
            {{ template.description }}
          </p>
        </div>
        <div class="d-flex ga-2">
          <v-btn
            color="primary"
            prepend-icon="mdi-pencil"
            @click="editTemplate"
          >
            Edit Template
          </v-btn>
          <v-btn
            color="secondary"
            prepend-icon="mdi-play"
            @click="useTemplate"
          >
            Use Template
          </v-btn>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-dots-vertical"
                variant="text"
                v-bind="props"
              />
            </template>
            <v-list>
              <v-list-item @click="duplicateTemplate">
                <template v-slot:prepend>
                  <v-icon>mdi-content-copy</v-icon>
                </template>
                <v-list-item-title>Duplicate</v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteTemplate">
                <template v-slot:prepend>
                  <v-icon color="error">mdi-delete</v-icon>
                </template>
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>

      <v-row>
        <!-- Template Overview -->
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-3" color="primary">mdi-file-document</v-icon>
              Template Overview
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item class="px-0">
                  <v-list-item-title class="text-caption text-medium-emphasis">Version</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip size="small" variant="outlined">
                      v{{ getTemplateVersion(template) }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item class="px-0">
                  <v-list-item-title class="text-caption text-medium-emphasis">Security Level</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip size="small" :color="getSecurityLevelColor(getSecurityLevel(template))">
                      {{ getSecurityLevel(template).toUpperCase() }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item class="px-0">
                  <v-list-item-title class="text-caption text-medium-emphasis">Created By</v-list-item-title>
                  <v-list-item-subtitle>{{ template.createdBy }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item class="px-0">
                  <v-list-item-title class="text-caption text-medium-emphasis">Created</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDate(template.createdAt) }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item class="px-0">
                  <v-list-item-title class="text-caption text-medium-emphasis">Last Updated</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDate(template.updatedAt) }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Device Compatibility -->
        <v-col cols="12" md="8">
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-3" color="info">mdi-devices</v-icon>
              Compatible Device Types
            </v-card-title>
            <v-card-text>
              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="deviceType in template.deviceTypes"
                  :key="deviceType"
                  size="small"
                  variant="outlined"
                  color="info"
                >
                  {{ deviceType.replace('_', ' ') }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <!-- Network Configuration -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-3" color="success">mdi-wifi</v-icon>
              Network Configuration
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">SSID</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip size="small" color="primary" variant="tonal">
                        {{ template.settings.network.ssid }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">Security Type</v-list-item-title>
                    <v-list-item-subtitle>{{ template.settings.network.securityType || template.settings.network.security || 'WPA2' }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12" sm="6" v-if="template.settings.network.autoConnect !== undefined">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">Auto Connect</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-icon :color="template.settings.network.autoConnect ? 'success' : 'grey'">
                        {{ template.settings.network.autoConnect ? 'mdi-check' : 'mdi-close' }}
                      </v-icon>
                      {{ template.settings.network.autoConnect ? 'Enabled' : 'Disabled' }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12" sm="6" v-if="template.settings.network.hidden !== undefined">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">Hidden Network</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-icon :color="template.settings.network.hidden ? 'success' : 'grey'">
                        {{ template.settings.network.hidden ? 'mdi-check' : 'mdi-close' }}
                      </v-icon>
                      {{ template.settings.network.hidden ? 'Yes' : 'No' }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Security Settings -->
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-3" color="warning">mdi-shield</v-icon>
              Security Settings
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">Encryption</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-icon :color="template.settings.security.encryption ? 'success' : 'error'" class="mr-1">
                        {{ template.settings.security.encryption ? 'mdi-check-circle' : 'mdi-close-circle' }}
                      </v-icon>
                      {{ template.settings.security.encryption ? 'Enabled' : 'Disabled' }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">Remote Wipe</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-icon :color="template.settings.security.remoteWipe ? 'success' : 'error'" class="mr-1">
                        {{ template.settings.security.remoteWipe ? 'mdi-check-circle' : 'mdi-close-circle' }}
                      </v-icon>
                      {{ template.settings.security.remoteWipe ? 'Enabled' : 'Disabled' }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-medium-emphasis">VPN</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-icon :color="template.settings.vpn?.enabled ? 'success' : 'error'" class="mr-1">
                        {{ template.settings.vpn?.enabled ? 'mdi-check-circle' : 'mdi-close-circle' }}
                      </v-icon>
                      {{ template.settings.vpn?.enabled ? 'Enabled' : 'Disabled' }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>
              </v-row>
              
              <v-divider class="my-4" />
              
              <div v-if="template.settings.vpn?.enabled">
                <h4 class="text-subtitle-1 mb-3">VPN Configuration</h4>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-list-item class="px-0">
                      <v-list-item-title class="text-caption text-medium-emphasis">Server</v-list-item-title>
                      <v-list-item-subtitle>{{ template.settings.vpn.server || 'Not configured' }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12" sm="6" v-if="template.settings.vpn?.protocol">
                    <v-list-item class="px-0">
                      <v-list-item-title class="text-caption text-medium-emphasis">Protocol</v-list-item-title>
                      <v-list-item-subtitle>{{ template.settings.vpn.protocol || 'OpenVPN' }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>

          <!-- Application Settings -->
          <v-card v-if="template.settings.applications?.length || template.settings.apps?.required?.length">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-3" color="purple">mdi-apps</v-icon>
              Application Configuration
            </v-card-title>
            <v-card-text>
              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="app in (template.settings.applications || template.settings.apps?.required || [])"
                  :key="app"
                  size="small"
                  variant="outlined"
                  color="purple"
                >
                  {{ app }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Template Edit Dialog -->
    <TemplateEditDialog
      v-model="showEditDialog"
      :template="template"
      @template-updated="onTemplateUpdated"
      @dialog-closed="showEditDialog = false"
    />

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-3" color="error">mdi-delete-alert</v-icon>
          Delete Template
        </v-card-title>
        <v-card-text>
          <p>Are you sure you want to delete <strong>{{ template?.name }}</strong>?</p>
          <p class="text-body-2 text-medium-emphasis">This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="outlined" @click="showDeleteDialog = false">
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn color="error" :loading="deleting" @click="confirmDelete">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTemplateStore } from '@/stores/templates';
import { useNotifications } from '@/composables/useNotifications';
import TemplateEditDialog from '@/components/forms/TemplateEditDialog.vue';
import type { ConfigurationTemplate } from '@/types/template';

const route = useRoute();
const router = useRouter();
const templateStore = useTemplateStore();
const { showSuccess, showError } = useNotifications();

const template = ref<ConfigurationTemplate | null>(null);
const loading = ref(true);
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const deleting = ref(false);

const breadcrumbItems = computed(() => [
  {
    title: 'Templates',
    to: '/templates',
    disabled: false
  },
  {
    title: template.value?.name || 'Template',
    to: '',
    disabled: true
  }
]);

const getSecurityLevel = (template: ConfigurationTemplate): string => {
  const { encryption, remoteWipe } = template.settings.security;
  const vpnEnabled = template.settings.vpn?.enabled || false;

  if (encryption && remoteWipe && vpnEnabled) return 'high';
  if (encryption && remoteWipe) return 'medium';
  return 'low';
};

const getSecurityLevelColor = (level: string): string => {
  switch (level) {
    case 'high': return 'success';
    case 'medium': return 'warning';
    case 'low': return 'error';
    default: return 'grey';
  }
};

const getTemplateVersion = (template: ConfigurationTemplate): string => {
  // Simple versioning based on update frequency
  const created = new Date(template.createdAt);
  const updated = new Date(template.updatedAt);
  const daysDiff = Math.floor((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) return '1.0';
  if (daysDiff < 7) return '1.1';
  if (daysDiff < 30) return '1.2';
  return '2.0';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

const editTemplate = () => {
  showEditDialog.value = true;
};

const useTemplate = () => {
  router.push({
    path: '/configure',
    query: {
      templateId: template.value?.id,
      templateName: template.value?.name
    }
  });
};

const duplicateTemplate = () => {
  router.push({
    path: '/templates/new',
    query: { duplicate: template.value?.id }
  });
};

const deleteTemplate = () => {
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!template.value) return;
  
  deleting.value = true;
  try {
    await templateStore.deleteTemplate(template.value.id);
    showSuccess('Template Deleted', `${template.value.name} has been deleted successfully`);
    router.push('/templates');
  } catch (error) {
    showError('Delete Failed', 'Failed to delete template');
  } finally {
    deleting.value = false;
    showDeleteDialog.value = false;
  }
};

const onTemplateUpdated = (updatedTemplate: ConfigurationTemplate) => {
  template.value = updatedTemplate;
  templateStore.fetchTemplates(); // Refresh the store
  showSuccess('Template Updated', `${updatedTemplate.name} has been updated successfully`);
};

const loadTemplate = async () => {
  loading.value = true;
  try {
    const templateId = route.params.templateId as string;
    
    // Ensure templates are loaded
    if (templateStore.templates.length === 0) {
      await templateStore.fetchTemplates();
    }
    
    const foundTemplate = templateStore.templates.find(t => t.id === templateId);
    if (foundTemplate) {
      template.value = foundTemplate;
    } else {
      template.value = null;
    }
  } catch (error) {
    console.error('Error loading template:', error);
    template.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadTemplate();
});
</script>