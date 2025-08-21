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
        @click="createNewTemplate"
      >
        Create Template
      </v-btn>
    </div>

    <v-card>
      <v-card-title class="d-flex justify-space-between align-center py-4">
        Configuration Templates
        <v-spacer />
        <v-menu v-if="selectedTemplates.length > 0">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              color="secondary"
              prepend-icon="mdi-menu"
              class="mr-2"
            >
              Bulk Actions ({{ selectedTemplates.length }})
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="bulkDuplicate">
              <template v-slot:prepend>
                <v-icon>mdi-content-copy</v-icon>
              </template>
              <v-list-item-title>Duplicate Templates</v-list-item-title>
            </v-list-item>
            <v-list-item @click="bulkDelete">
              <template v-slot:prepend>
                <v-icon>mdi-delete</v-icon>
              </template>
              <v-list-item-title>Delete Templates</v-list-item-title>
            </v-list-item>
            <v-list-item @click="clearSelection">
              <template v-slot:prepend>
                <v-icon>mdi-close</v-icon>
              </template>
              <v-list-item-title>Clear Selection</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          color="primary"
          prepend-icon="mdi-refresh"
          @click="refreshTemplates"
          :loading="loading"
          class="mr-2"
        >
          Refresh
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Filters -->
        <v-row class="mb-4">
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.deviceType"
              :items="deviceTypeFilterOptions"
              item-title="label"
              item-value="value"
              label="Filter by Device Type"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-devices"
              @update:model-value="applyFilters"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.createdBy"
              :items="createdByOptions"
              label="Filter by Creator"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-account"
              @update:model-value="applyFilters"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.securityLevel"
              :items="securityLevelOptions"
              item-title="label"
              item-value="value"
              label="Filter by Security Level"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-shield"
              @update:model-value="applyFilters"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.search"
              label="Search templates"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-magnify"
              @update:model-value="applyFilters"
            />
          </v-col>
        </v-row>

        <v-data-table
          v-model="selectedTemplates"
          :headers="headers"
          :items="filteredTemplates"
          :loading="loading"
          :items-per-page="itemsPerPage"
          :page="currentPage"
          :server-items-length="totalItems"
          show-select
          multi-sort
          class="elevation-1"
          item-value="id"
          @update:options="handleTableOptions"
        >
          <template v-slot:item.name="{ item }">
            <div class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-file-document</v-icon>
              <div>
                <div class="font-weight-medium">{{ item.name }}</div>
                <div class="text-caption text-medium-emphasis">
                  {{ item.description }}
                </div>
              </div>
            </div>
          </template>

          <template v-slot:item.deviceTypes="{ item }">
            <div class="d-flex flex-wrap ga-1">
              <v-chip
                v-for="deviceType in item.deviceTypes.slice(0, 2)"
                :key="deviceType"
                size="small"
                variant="outlined"
              >
                {{ deviceType.replace('_', ' ') }}
              </v-chip>
              <v-chip
                v-if="item.deviceTypes.length > 2"
                size="small"
                variant="tonal"
              >
                +{{ item.deviceTypes.length - 2 }} more
              </v-chip>
            </div>
          </template>

          <template v-slot:item.settings.network.ssid="{ item }">
            <v-chip size="small" color="primary" variant="tonal">
              {{ item.settings.network.ssid }}
            </v-chip>
          </template>

          <template v-slot:item.security="{ item }">
            <div class="d-flex align-center">
              <v-icon
                size="small"
                :color="item.settings.security.encryption ? 'success' : 'grey'"
                class="mr-1"
              >
                {{ item.settings.security.encryption ? 'mdi-check' : 'mdi-close' }}
              </v-icon>
              <v-icon
                size="small"
                :color="item.settings.security.remoteWipe ? 'success' : 'grey'"
                class="mr-1"
              >
                {{ item.settings.security.remoteWipe ? 'mdi-check' : 'mdi-close' }}
              </v-icon>
              <v-icon
                size="small"
                :color="item.settings.vpn?.enabled ? 'success' : 'grey'"
              >
                {{ item.settings.vpn?.enabled ? 'mdi-check' : 'mdi-close' }}
              </v-icon>
            </div>
          </template>

          <template v-slot:item.version="{ item }">
            <v-chip size="small" variant="outlined">
              v{{ getTemplateVersion(item) }}
            </v-chip>
          </template>

          <template v-slot:item.updatedAt="{ item }">
            <span>{{ formatDate(item.updatedAt) }}</span>
          </template>

          <template v-slot:item.createdBy="{ item }">
            <span>{{ item.createdBy }}</span>
          </template>

          <template v-slot:item.actions="{ item }">
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
                <v-list-item @click="openTemplateDialog(item)">
                  <template v-slot:prepend>
                    <v-icon>mdi-eye</v-icon>
                  </template>
                  <v-list-item-title>View Details</v-list-item-title>
                </v-list-item>
                <v-list-item @click="editTemplate(item)">
                  <template v-slot:prepend>
                    <v-icon>mdi-pencil</v-icon>
                  </template>
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="duplicateTemplateAction(item)">
                  <template v-slot:prepend>
                    <v-icon>mdi-content-copy</v-icon>
                  </template>
                  <v-list-item-title>Duplicate</v-list-item-title>
                </v-list-item>
                <v-list-item @click="useTemplate(item)">
                  <template v-slot:prepend>
                    <v-icon>mdi-play</v-icon>
                  </template>
                  <v-list-item-title>Use Template</v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-list-item @click="deleteTemplate(item)">
                  <template v-slot:prepend>
                    <v-icon color="error">mdi-delete</v-icon>
                  </template>
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Template Details Dialog -->
    <TemplateDetailsDialog
      v-model="showTemplateDialog"
      :template="selectedTemplate"
      @template-updated="onTemplateUpdated"
      @template-deleted="onTemplateDeleted"
      @dialog-closed="onDialogClosed"
    />

    <!-- Create Template Dialog -->
    <CreateTemplateDialog
      v-model="showCreateDialog"
      :duplicate-template="duplicateTemplate"
      @template-created="onTemplateCreated"
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
import { useNotifications } from '@/composables/useNotifications';
import TemplateDetailsDialog from '@/components/forms/TemplateDetailsDialog.vue';
import CreateTemplateDialog from '@/components/forms/CreateTemplateDialog.vue';
import type { ConfigurationTemplate } from '@/types/template';

const route = useRoute();
const router = useRouter();
const templateStore = useTemplateStore();
const { showSuccess, showError } = useNotifications();

const templates = computed(() => templateStore.templates);
const loading = computed(() => templateStore.loading);

// Selection and pagination
const selectedTemplates = ref<string[]>([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = computed(() => filteredTemplates.value.length);

// Filters
const filters = ref({
  deviceType: null as string | null,
  createdBy: null as string | null,
  securityLevel: null as string | null,
  search: ''
});

const showTemplateDialog = ref(false);
const selectedTemplate = ref<ConfigurationTemplate | null>(null);

const showCreateDialog = ref(false);
const duplicateTemplate = ref<ConfigurationTemplate | null>(null);

// Table headers
const headers = [
  { title: 'Template', key: 'name', sortable: true },
  { title: 'Device Types', key: 'deviceTypes', sortable: false },
  { title: 'Network', key: 'settings.network.ssid', sortable: true },
  { title: 'Security', key: 'security', sortable: false },
  { title: 'Version', key: 'version', sortable: true },
  { title: 'Updated', key: 'updatedAt', sortable: true },
  { title: 'Created By', key: 'createdBy', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
];

// Filter options
const deviceTypeFilterOptions = [
  { value: 'ipad_pro', label: 'iPad Pro' },
  { value: 'ipad_air', label: 'iPad Air' },
  { value: 'macbook_pro', label: 'MacBook Pro' },
  { value: 'iphone', label: 'iPhone' }
];

const createdByOptions = computed(() => {
  const creators = [...new Set(templates.value.map(t => t.createdBy))];
  return creators.sort();
});

const securityLevelOptions = [
  { value: 'high', label: 'High Security (Encryption + Remote Wipe + VPN)' },
  { value: 'medium', label: 'Medium Security (Encryption + Remote Wipe)' },
  { value: 'low', label: 'Low Security (Basic)' }
];

// Filtered templates
const filteredTemplates = computed(() => {
  let result = templates.value;

  if (filters.value.deviceType) {
    result = result.filter(t => t.deviceTypes.includes(filters.value.deviceType as any));
  }

  if (filters.value.createdBy) {
    result = result.filter(t => t.createdBy === filters.value.createdBy);
  }

  if (filters.value.securityLevel) {
    result = result.filter(t => {
      const level = getSecurityLevel(t);
      return level === filters.value.securityLevel;
    });
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    result = result.filter(t =>
      t.name.toLowerCase().includes(search) ||
      t.description.toLowerCase().includes(search) ||
      t.settings.network.ssid.toLowerCase().includes(search)
    );
  }

  return result;
});

// Helper functions
const getSecurityLevel = (template: ConfigurationTemplate): string => {
  const { encryption, remoteWipe } = template.settings.security;
  const vpnEnabled = template.settings.vpn?.enabled || false;

  if (encryption && remoteWipe && vpnEnabled) return 'high';
  if (encryption && remoteWipe) return 'medium';
  return 'low';
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

// Actions
const refreshTemplates = () => {
  templateStore.fetchTemplates();
};

const applyFilters = () => {
  currentPage.value = 1; // Reset to first page when filters change
};

const handleTableOptions = (options: any) => {
  currentPage.value = options.page;
  itemsPerPage.value = options.itemsPerPage;
};

// Selection actions
const clearSelection = () => {
  selectedTemplates.value = [];
};

const bulkDuplicate = async () => {
  if (selectedTemplates.value.length === 0) return;

  try {
    for (const templateId of selectedTemplates.value) {
      const template = templates.value.find(t => t.id === templateId);
      if (template) {
        // Simulate duplication
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    showSuccess(
      'Templates Duplicated',
      `Successfully duplicated ${selectedTemplates.value.length} templates`
    );
    clearSelection();
    refreshTemplates();
  } catch (error) {
    showError('Duplication Failed', 'Failed to duplicate templates');
  }
};

const bulkDelete = async () => {
  if (selectedTemplates.value.length === 0) return;

  try {
    for (const templateId of selectedTemplates.value) {
      await templateStore.deleteTemplate(templateId);
    }
    showSuccess(
      'Templates Deleted',
      `Successfully deleted ${selectedTemplates.value.length} templates`
    );
    clearSelection();
  } catch (error) {
    showError('Deletion Failed', 'Failed to delete templates');
  }
};

// Template actions
const createNewTemplate = () => {
  router.push('/templates/new');
};

const duplicateTemplateAction = (template: ConfigurationTemplate) => {
  router.push({
    path: '/templates/new',
    query: { duplicate: template.id }
  });
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

const onTemplateCreated = (newTemplate: ConfigurationTemplate) => {
  templateStore.fetchTemplates();
  console.log('Template created:', newTemplate.name);
};

const onDialogClosed = () => {
  if (route.params.templateId || route.path === '/templates/new') {
    router.push('/templates');
  }
};

const handleTemplateRoute = async () => {
  const isNewRoute = route.path === '/templates/new';
  const templateId = route.params.templateId as string;

  if (isNewRoute) {
    // Handle create new template
    duplicateTemplate.value = null;

    // Check for duplicate query parameter
    const duplicateId = route.query.duplicate as string;
    if (duplicateId && templates.value.length > 0) {
      const templateToDuplicate = templates.value.find(t => t.id === duplicateId);
      duplicateTemplate.value = templateToDuplicate || null;
    }

    selectedTemplate.value = null;
    showTemplateDialog.value = false;
    showCreateDialog.value = true;
  } else if (templateId && typeof templateId === 'string') {
    // Handle existing template
    if (templates.value.length === 0) {
      await templateStore.fetchTemplates();
    }

    const template = templates.value.find(t => t.id === templateId);
    if (template) {
      selectedTemplate.value = template;
      showTemplateDialog.value = true;
      showCreateDialog.value = false;
    } else {
      router.push('/templates');
    }
  } else {
    // Default state
    selectedTemplate.value = null;
    showTemplateDialog.value = false;
    showCreateDialog.value = false;
    duplicateTemplate.value = null;
  }
};

// Watch for route changes to open/close dialog
watch(() => [route.params.templateId, route.path], handleTemplateRoute, { immediate: true });

// Also watch for templates being loaded to handle initial route
watch(() => templates.value.length, () => {
  if (templates.value.length > 0 && (route.params.templateId || route.path === '/templates/new')) {
    handleTemplateRoute();
  }
});

onMounted(async () => {
  await templateStore.fetchTemplates();
  // Handle initial route after templates are loaded
  if (route.params.templateId || route.path === '/templates/new') {
    handleTemplateRoute();
  }
});
</script>