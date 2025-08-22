<template>
  <v-container fluid>
    <h1 class="text-h4 mb-2">
      Configuration History
    </h1>
    <p class="text-body-1 text-medium-emphasis mb-6">
      Track all device configuration changes, template updates, and system activities. View detailed logs with rollback capabilities for audit and troubleshooting.
    </p>

    <v-card>
      <v-card-title class="d-flex align-center py-4">
        Configuration History
        <v-spacer />
        <v-btn
          color="primary"
          prepend-icon="mdi-download"
          class="mr-2"
          @click="exportHistory"
        >
          Export History
        </v-btn>
        <v-btn
          color="secondary"
          prepend-icon="mdi-refresh"
          :loading="loading"
          @click="refreshHistory"
        >
          Refresh
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Filters -->
        <v-row class="mb-4">
          <v-col
            cols="12"
            md="3"
          >
            <v-select
              v-model="filters.status"
              :items="statusFilterOptions"
              item-title="label"
              item-value="value"
              label="Filter by Status"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-filter"
              @update:model-value="applyFilters"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-select
              v-model="filters.user"
              :items="userFilterOptions"
              label="Filter by User"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-account"
              @update:model-value="applyFilters"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-select
              v-model="filters.activityType"
              :items="activityTypeOptions"
              item-title="label"
              item-value="value"
              label="Filter by Activity"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-history"
              @update:model-value="applyFilters"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-text-field
              v-model="filters.search"
              label="Search history"
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-magnify"
              @update:model-value="applyFilters"
            />
          </v-col>
        </v-row>
        <v-timeline align="start">
          <v-timeline-item
            v-for="activity in historyItems"
            :key="activity.id"
            :dot-color="activity.color"
            size="small"
          >
            <template #icon>
              <v-icon :color="activity.color">
                {{ activity.icon }}
              </v-icon>
            </template>

            <v-card variant="outlined">
              <v-card-text>
                <div class="d-flex justify-space-between align-start mb-2">
                  <div>
                    <div class="text-h6">
                      {{ activity.title }}
                    </div>
                    <div class="text-body-2 text-medium-emphasis">
                      {{ activity.description }}
                    </div>
                  </div>
                  <v-chip
                    :color="activity.statusColor"
                    size="small"
                    variant="tonal"
                  >
                    {{ activity.status }}
                  </v-chip>
                </div>

                <div class="d-flex align-center mt-2">
                  <v-icon
                    size="small"
                    class="mr-1"
                  >
                    mdi-account
                  </v-icon>
                  <span class="text-caption mr-4">{{ activity.user }}</span>

                  <v-icon
                    size="small"
                    class="mr-1"
                  >
                    mdi-clock-outline
                  </v-icon>
                  <span class="text-caption">{{ activity.timestamp }}</span>
                </div>

                <div
                  v-if="activity.affectedDevices"
                  class="mt-2"
                >
                  <v-chip
                    size="small"
                    variant="outlined"
                  >
                    {{ activity.affectedDevices }} devices affected
                  </v-chip>
                </div>
              </v-card-text>

              <v-card-actions v-if="activity.rollbackAvailable">
                <v-spacer />
                <v-btn
                  size="small"
                  variant="outlined"
                  prepend-icon="mdi-backup-restore"
                  :loading="activity.rolling"
                  @click="rollbackConfiguration(activity)"
                >
                  Rollback
                </v-btn>
                <v-btn
                  size="small"
                  variant="text"
                  prepend-icon="mdi-eye"
                  @click="viewDetails(activity)"
                >
                  View Details
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
defineOptions({
  name: 'HistoryView'
})
import { ref, computed } from 'vue';
import { useNotifications } from '@/composables/useNotifications';

const { showSuccess, showError } = useNotifications();

const loading = ref(false);

// Filters
const filters = ref({
  status: null as string | null,
  user: null as string | null,
  activityType: null as string | null,
  search: ''
});

// Filter options
const statusFilterOptions = [
  { value: 'Success', label: 'Success' },
  { value: 'Failed', label: 'Failed' },
  { value: 'In Progress', label: 'In Progress' }
];

const userFilterOptions = computed(() => {
  const users = [...new Set(allHistoryItems.value.map(item => item.user))];
  return users.sort();
});

const activityTypeOptions = [
  { value: 'configuration', label: 'Configuration' },
  { value: 'template', label: 'Template Changes' },
  { value: 'enrollment', label: 'Device Enrollment' },
  { value: 'system', label: 'System Changes' }
];

// All history items (simulate more data)
const allHistoryItems = ref([
  {
    id: 1,
    title: 'Bulk Configuration Applied',
    description: 'Applied "Film Production - Crew Devices" template to Universal Studios - Stage 12',
    status: 'Success',
    statusColor: 'success',
    color: 'success',
    icon: 'mdi-check-circle',
    user: 'john.doe@nbcuni.com',
    timestamp: '2 hours ago',
    affectedDevices: 15,
    rollbackAvailable: true,
    activityType: 'configuration',
    rolling: false
  },
  {
    id: 2,
    title: 'Template Updated',
    description: 'Modified network settings in "Film Production - Crew Devices" template',
    status: 'Success',
    statusColor: 'info',
    color: 'info',
    icon: 'mdi-file-document-edit',
    user: 'jane.smith@nbcuni.com',
    timestamp: '5 hours ago',
    affectedDevices: null,
    rollbackAvailable: false,
    activityType: 'template',
    rolling: false
  },
  {
    id: 3,
    title: 'Configuration Failed',
    description: 'Failed to apply "Corporate - Office Devices" template to 30 Rockefeller Plaza',
    status: 'Failed',
    statusColor: 'error',
    color: 'error',
    icon: 'mdi-alert-circle',
    user: 'admin@nbcuni.com',
    timestamp: '1 day ago',
    affectedDevices: 3,
    rollbackAvailable: false,
    activityType: 'configuration',
    rolling: false
  },
  {
    id: 4,
    title: 'New Template Created',
    description: 'Created "Press Event - Media Devices" template for media events',
    status: 'Success',
    statusColor: 'success',
    color: 'primary',
    icon: 'mdi-plus-circle',
    user: 'media.admin@nbcuni.com',
    timestamp: '2 days ago',
    affectedDevices: null,
    rollbackAvailable: false,
    activityType: 'template',
    rolling: false
  },
  {
    id: 5,
    title: 'Mass Device Enrollment',
    description: 'Enrolled 50 new iPad devices at Universal Orlando - Islands of Adventure',
    status: 'Success',
    statusColor: 'success',
    color: 'success',
    icon: 'mdi-devices',
    user: 'park.admin@nbcuni.com',
    timestamp: '3 days ago',
    affectedDevices: 50,
    rollbackAvailable: false,
    activityType: 'enrollment',
    rolling: false
  },
  {
    id: 6,
    title: 'System Maintenance',
    description: 'Performed system maintenance and updates across all locations',
    status: 'Success',
    statusColor: 'success',
    color: 'info',
    icon: 'mdi-wrench',
    user: 'system@nbcuni.com',
    timestamp: '4 days ago',
    affectedDevices: null,
    rollbackAvailable: false,
    activityType: 'system',
    rolling: false
  },
  {
    id: 7,
    title: 'Security Template Deployed',
    description: 'Applied enhanced security template to executive devices',
    status: 'Success',
    statusColor: 'success',
    color: 'success',
    icon: 'mdi-shield-check',
    user: 'security.admin@nbcuni.com',
    timestamp: '5 days ago',
    affectedDevices: 8,
    rollbackAvailable: true,
    activityType: 'configuration',
    rolling: false
  }
]);

// Filtered history items
const historyItems = computed(() => {
  let result = allHistoryItems.value;

  if (filters.value.status) {
    result = result.filter(item => item.status === filters.value.status);
  }

  if (filters.value.user) {
    result = result.filter(item => item.user === filters.value.user);
  }

  if (filters.value.activityType) {
    result = result.filter(item => item.activityType === filters.value.activityType);
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    result = result.filter(item =>
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.user.toLowerCase().includes(search)
    );
  }

  return result;
});

// Actions
const applyFilters = () => {
  // Filters are automatically applied through computed property
};

const refreshHistory = async () => {
  loading.value = true;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    showSuccess('History Refreshed', 'Configuration history has been updated');
  } catch (_error) {
    showError('Refresh Failed', 'Failed to refresh history data');
  } finally {
    loading.value = false;
  }
};

const exportHistory = async () => {
  try {
    // Simulate export functionality
    const dataStr = JSON.stringify(historyItems.value, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `configuration-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showSuccess('Export Complete', 'Configuration history exported successfully');
  } catch (_error) {
    showError('Export Failed', 'Failed to export history data');
  }
};

const rollbackConfiguration = async (activity: any) => {
  activity.rolling = true;
  try {
    // Simulate rollback process
    await new Promise(resolve => setTimeout(resolve, 2000));
    showSuccess(
      'Rollback Complete',
      `Successfully rolled back configuration: ${activity.title}`
    );
    activity.rollbackAvailable = false;
  } catch (_error) {
    showError('Rollback Failed', 'Failed to rollback configuration');
  } finally {
    activity.rolling = false;
  }
};

const viewDetails = (activity: any) => {
  showSuccess('View Details', `Opening detailed view for: ${activity.title}`);
};
</script>