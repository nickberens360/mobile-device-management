<template>
  <v-container fluid>
    <h1 class="text-h4 mb-2">
      Configure Devices
    </h1>
    <p class="text-body-1 text-medium-emphasis mb-6">
      Apply configuration templates to multiple devices simultaneously. Select devices from any location and device type, then deploy compatible templates across your NBC Universal properties.
    </p>

    <v-stepper
      v-model="currentStep"
      :items="steps"
      flat
      :complete-icon="'mdi-check'"
      editable
    >
      <!-- Step 1: Select Devices -->
      <template #item.1>
        <v-card flat>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">
              mdi-devices
            </v-icon>
            Select Devices for Configuration
          </v-card-title>
          <v-card-text>
            <!-- Filter Controls -->
            <v-row class="mb-4">
              <v-col
                cols="12"
                md="3"
              >
                <v-select
                  v-model="deviceFilters.location"
                  :items="locationOptions"
                  item-title="name"
                  item-value="id"
                  label="Filter by Location"
                  variant="outlined"
                  prepend-inner-icon="mdi-map-marker"
                  clearable
                  multiple
                  chips
                  closable-chips
                />
              </v-col>
              <v-col
                cols="12"
                md="3"
              >
                <v-select
                  v-model="deviceFilters.type"
                  :items="deviceTypeOptions"
                  item-title="label"
                  item-value="value"
                  label="Filter by Type"
                  variant="outlined"
                  prepend-inner-icon="mdi-tablet"
                  clearable
                  multiple
                  chips
                  closable-chips
                />
              </v-col>
              <v-col
                cols="12"
                md="3"
              >
                <v-select
                  v-model="deviceFilters.status"
                  :items="deviceStatusOptions"
                  item-title="label"
                  item-value="value"
                  label="Filter by Status"
                  variant="outlined"
                  prepend-inner-icon="mdi-information"
                  clearable
                  multiple
                  chips
                  closable-chips
                />
              </v-col>
              <v-col
                cols="12"
                md="3"
              >
                <v-text-field
                  v-model="deviceFilters.search"
                  label="Search devices"
                  variant="outlined"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                />
              </v-col>
            </v-row>

            <!-- Device Selection Summary -->
            <v-alert
              v-if="selectedDevices.length > 0"
              type="info"
              variant="tonal"
              class="mb-4"
            >
              <div class="d-flex align-center">
                <div>
                  <strong>{{ selectedDevices.length }} devices selected</strong>
                  <div class="text-body-2 mt-1">
                    Locations: {{ selectedDevicesByLocation.length }} |
                    Types: {{ selectedDevicesByType.length }} |
                    Compatible templates: {{ compatibleTemplatesCount }}
                  </div>
                </div>
                <v-spacer />
                <v-btn
                  variant="text"
                  size="small"
                  @click="clearSelection"
                >
                  Clear All
                </v-btn>
              </div>
            </v-alert>

            <!-- Device Table -->
            <v-data-table
              v-model="selectedDevices"
              :headers="deviceHeaders"
              :items="filteredDevices"
              :loading="devicesLoading"
              show-select
              class="elevation-1"
              item-value="id"
              :items-per-page="15"
            >
              <template #item.name="{ item }">
                <div class="d-flex align-center">
                  <v-icon
                    class="mr-2"
                    :color="getDeviceTypeColor(item.type)"
                  >
                    {{ getDeviceTypeIcon(item.type) }}
                  </v-icon>
                  {{ item.name }}
                </div>
              </template>

              <template #item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  size="small"
                  variant="tonal"
                >
                  <v-icon start>
                    {{ getStatusIcon(item.status) }}
                  </v-icon>
                  {{ item.status }}
                </v-chip>
              </template>

              <template #item.type="{ item }">
                <v-chip
                  size="small"
                  variant="outlined"
                >
                  {{ item.type.replace('_', ' ') }}
                </v-chip>
              </template>

              <template #item.location="{ item }">
                <div class="d-flex align-center">
                  <v-icon
                    class="mr-1"
                    size="small"
                  >
                    mdi-map-marker
                  </v-icon>
                  {{ getLocationName(item.location) }}
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </template>

      <!-- Step 2: Select Compatible Templates -->
      <template #item.2>
        <v-card flat>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">
              mdi-file-document-multiple
            </v-icon>
            Select Compatible Templates
          </v-card-title>
          <v-card-text>
            <v-alert
              v-if="selectedDevices.length === 0"
              type="warning"
              variant="tonal"
              class="mb-4"
            >
              Please select devices in the previous step to see compatible templates.
            </v-alert>

            <v-alert
              v-else-if="compatibleTemplates.length === 0"
              type="info"
              variant="tonal"
              class="mb-4"
            >
              No templates are compatible with all selected devices. Consider selecting devices of similar types or creating a new template.
            </v-alert>

            <!-- Template Selection -->
            <div v-if="compatibleTemplates.length > 0">
              <v-row>
                <v-col
                  v-for="template in compatibleTemplates"
                  :key="template.id"
                  cols="12"
                  md="6"
                >
                  <v-card
                    :variant="selectedTemplate === template.id ? 'tonal' : 'outlined'"
                    :color="selectedTemplate === template.id ? 'primary' : undefined"
                    class="h-100 cursor-pointer"
                    @click="selectedTemplate = template.id"
                  >
                    <v-card-title class="d-flex align-center">
                      <v-radio
                        :value="template.id"
                        :model-value="selectedTemplate"
                        color="primary"
                        class="mr-2"
                      />
                      {{ template.name }}
                      <v-spacer />
                      <v-chip
                        size="small"
                        :color="getTemplateTypeColor(template.deviceTypes[0] || 'default')"
                        variant="tonal"
                      >
                        {{ template.deviceTypes[0] || 'Multi-Device' }}
                      </v-chip>
                    </v-card-title>

                    <v-card-text>
                      <p class="text-body-2 mb-3">
                        {{ template.description }}
                      </p>

                      <div class="mb-2">
                        <v-chip-group>
                          <v-chip
                            v-for="deviceType in template.deviceTypes"
                            :key="deviceType"
                            size="x-small"
                            variant="outlined"
                          >
                            {{ deviceType.replace('_', ' ') }}
                          </v-chip>
                        </v-chip-group>
                      </div>

                      <div class="text-caption text-medium-emphasis">
                        Compatible with {{ getMatchingDeviceCount(template) }} of {{ selectedDevices.length }} selected devices
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </template>

      <!-- Step 3: Customize and Deploy -->
      <template #item.3>
        <v-card flat>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">
              mdi-cog
            </v-icon>
            Customize and Deploy Configuration
          </v-card-title>
          <v-card-text>
            <v-alert
              v-if="!selectedTemplate"
              type="warning"
              variant="tonal"
              class="mb-4"
            >
              Please select a template in the previous step to customize and deploy.
            </v-alert>

            <div v-if="selectedTemplate && selectedTemplateData">
              <!-- Deployment Summary -->
              <v-card
                variant="outlined"
                class="mb-4"
              >
                <v-card-title>Deployment Summary</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <div class="text-subtitle-2 mb-1">
                        Template
                      </div>
                      <v-chip
                        color="primary"
                        variant="tonal"
                      >
                        {{ selectedTemplateData.name }}
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <div class="text-subtitle-2 mb-1">
                        Target Devices
                      </div>
                      <v-chip
                        color="success"
                        variant="tonal"
                      >
                        {{ compatibleDeviceCount }} devices
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <div class="text-subtitle-2 mb-1">
                        Locations
                      </div>
                      <v-chip
                        color="info"
                        variant="tonal"
                      >
                        {{ selectedDevicesByLocation.length }} locations
                      </v-chip>
                    </v-col>
                  </v-row>

                  <!-- Incompatible devices warning -->
                  <v-alert
                    v-if="incompatibleDeviceCount > 0"
                    type="warning"
                    variant="tonal"
                    class="mt-3"
                  >
                    <div class="text-body-2">
                      <strong>{{ incompatibleDeviceCount }} devices</strong> are not compatible with this template and will be skipped:
                      <ul class="mt-2 ml-4">
                        <li
                          v-for="device in incompatibleDevices.slice(0, 5)"
                          :key="device.id"
                        >
                          {{ device.name }} ({{ device.type.replace('_', ' ') }})
                        </li>
                        <li v-if="incompatibleDevices.length > 5">
                          ... and {{ incompatibleDevices.length - 5 }} more
                        </li>
                      </ul>
                    </div>
                  </v-alert>
                </v-card-text>
              </v-card>

              <!-- Configuration Preview and Customization -->
              <v-card
                variant="outlined"
                class="mb-4"
              >
                <v-card-title class="d-flex align-center">
                  <v-icon class="mr-2">
                    mdi-eye
                  </v-icon>
                  Configuration Preview
                  <v-spacer />
                  <v-switch
                    v-model="enableCustomization"
                    label="Enable Customization"
                    color="primary"
                    hide-details
                  />
                </v-card-title>
                <v-card-text>
                  <v-expansion-panels multiple>
                    <v-expansion-panel title="Network Settings">
                      <v-expansion-panel-text>
                        <v-row>
                          <v-col
                            cols="12"
                            md="4"
                          >
                            <v-text-field
                              v-model="customSettings.network.ssid"
                              label="SSID"
                              variant="outlined"
                              prepend-inner-icon="mdi-wifi"
                              :readonly="!enableCustomization"
                              density="compact"
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            md="4"
                          >
                            <v-select
                              v-model="customSettings.network.security"
                              :items="securityOptions"
                              label="Security Type"
                              variant="outlined"
                              prepend-inner-icon="mdi-shield"
                              :readonly="!enableCustomization"
                              density="compact"
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            md="4"
                          >
                            <v-text-field
                              v-model="customSettings.network.vlan"
                              label="VLAN"
                              type="number"
                              variant="outlined"
                              prepend-inner-icon="mdi-network"
                              :readonly="!enableCustomization"
                              density="compact"
                            />
                          </v-col>
                        </v-row>
                      </v-expansion-panel-text>
                    </v-expansion-panel>

                    <v-expansion-panel title="Security Settings">
                      <v-expansion-panel-text>
                        <v-row>
                          <v-col
                            cols="12"
                            md="4"
                          >
                            <v-switch
                              v-model="customSettings.security.encryption"
                              label="Device Encryption"
                              color="success"
                              :readonly="!enableCustomization"
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            md="4"
                          >
                            <v-switch
                              v-model="customSettings.security.remoteWipe"
                              label="Remote Wipe Capability"
                              color="error"
                              :readonly="!enableCustomization"
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            md="4"
                          >
                            <v-select
                              v-model="customSettings.security.passcode"
                              :items="passcodeOptions"
                              label="Passcode Policy"
                              variant="outlined"
                              prepend-inner-icon="mdi-lock"
                              :readonly="!enableCustomization"
                              density="compact"
                            />
                          </v-col>
                        </v-row>
                      </v-expansion-panel-text>
                    </v-expansion-panel>

                    <v-expansion-panel
                      v-if="customSettings.apps"
                      title="Application Settings"
                    >
                      <v-expansion-panel-text>
                        <div class="text-body-2 mb-3">
                          Configure which applications will be installed:
                        </div>
                        <v-chip-group
                          v-model="customSettings.apps.required"
                          multiple
                          :disabled="!enableCustomization"
                        >
                          <v-chip
                            v-for="app in availableApps"
                            :key="app.id"
                            :value="app.id"
                            filter
                          >
                            <v-icon start>
                              {{ app.icon }}
                            </v-icon>
                            {{ app.name }}
                          </v-chip>
                        </v-chip-group>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card-text>
              </v-card>

              <!-- Deployment Options -->
              <v-card variant="outlined">
                <v-card-title class="d-flex align-center">
                  <v-icon class="mr-2">
                    mdi-rocket-launch
                  </v-icon>
                  Deployment Options
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-select
                        v-model="deploymentOptions.mode"
                        :items="deploymentModes"
                        item-title="label"
                        item-value="value"
                        label="Deployment Mode"
                        variant="outlined"
                        prepend-inner-icon="mdi-speedometer"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-select
                        v-model="deploymentOptions.schedule"
                        :items="scheduleOptions"
                        item-title="label"
                        item-value="value"
                        label="Schedule"
                        variant="outlined"
                        prepend-inner-icon="mdi-clock"
                      />
                    </v-col>
                  </v-row>

                  <v-checkbox
                    v-model="deploymentOptions.notifyUsers"
                    label="Notify device users before configuration"
                    color="primary"
                  />

                  <v-checkbox
                    v-model="deploymentOptions.rollbackOnFailure"
                    label="Automatically rollback on failure"
                    color="primary"
                  />
                </v-card-text>
              </v-card>
            </div>
          </v-card-text>
        </v-card>
      </template>

      <template #actions="{ next, prev }">
        <div class="d-flex justify-space-between w-100 pa-4">
          <v-btn
            v-if="currentStep > 1"
            variant="outlined"
            @click="prev"
          >
            <v-icon start>
              mdi-arrow-left
            </v-icon>
            Back
          </v-btn>
          <v-spacer v-else />

          <v-btn
            v-if="currentStep < steps.length"
            color="primary"
            :disabled="!canProceedToNext"
            @click="next"
          >
            Next
            <v-badge
              v-if="currentStep === 2 && selectedDevices.length > 0"
              :content="selectedDevices.length"
              color="secondary"
              inline
            />
            <v-icon end>
              mdi-arrow-right
            </v-icon>
          </v-btn>

          <v-btn
            v-else
            color="success"
            :disabled="!selectedTemplate"
            :loading="deploying"
            @click="deployConfiguration"
          >
            Deploy Configuration
            <v-icon end>
              mdi-rocket-launch
            </v-icon>
          </v-btn>
        </div>
      </template>
    </v-stepper>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDeviceStore } from '@/stores/devices';
import { useLocationStore } from '@/stores/locations';
import { useTemplateStore } from '@/stores/templates';
import { useNotifications } from '@/composables/useNotifications';

const route = useRoute();
const router = useRouter();
const deviceStore = useDeviceStore();
const locationStore = useLocationStore();
const templateStore = useTemplateStore();
const { showSuccess, showError } = useNotifications();

const currentStep = ref(1);
const steps = ['Select Devices', 'Select Templates', 'Customize & Deploy'];

// Device selection
const selectedDevices = ref<string[]>([]);
const selectedTemplate = ref<string>('');

// UI state
const devicesLoading = computed(() => deviceStore.loading);
// const templatesLoading = computed(() => templateStore.loading);
const deploying = ref(false);

// Customization state
const enableCustomization = ref(false);

// Device filters
const deviceFilters = ref({
  location: [] as string[],
  type: [] as string[],
  status: [] as string[],
  search: ''
});

// Custom settings (initialized from template)
const customSettings = ref({
  network: {
    ssid: '',
    security: '',
    vlan: ''
  },
  security: {
    encryption: false,
    remoteWipe: false,
    passcode: ''
  },
  apps: {
    required: [] as string[]
  }
});

// Deployment options
const deploymentOptions = ref({
  mode: 'standard',
  schedule: 'immediate',
  notifyUsers: true,
  rollbackOnFailure: true
});

// Options for filters and forms
const deviceTypeOptions = [
  { value: 'ipad_pro', label: 'iPad Pro', icon: 'mdi-tablet' },
  { value: 'ipad_air', label: 'iPad Air', icon: 'mdi-tablet' },
  { value: 'macbook_pro', label: 'MacBook Pro', icon: 'mdi-laptop' },
  { value: 'iphone', label: 'iPhone', icon: 'mdi-cellphone' }
];

const deviceStatusOptions = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'configuring', label: 'Configuring' },
  { value: 'error', label: 'Error' }
];

const securityOptions = ['WPA2', 'WPA3', 'WEP', 'Open'];
const passcodeOptions = ['Simple', 'Complex', 'Alphanumeric', 'None'];

const deploymentModes = [
  { value: 'standard', label: 'Standard (Normal Priority)' },
  { value: 'express', label: 'Express (High Priority)' },
  { value: 'maintenance', label: 'Maintenance Window' }
];

const scheduleOptions = [
  { value: 'immediate', label: 'Deploy Immediately' },
  { value: 'off_hours', label: 'During Off Hours' },
  { value: 'custom', label: 'Custom Schedule' }
];

const availableApps = [
  { id: 'teams', name: 'Microsoft Teams', icon: 'mdi-microsoft-teams' },
  { id: 'zoom', name: 'Zoom', icon: 'mdi-video' },
  { id: 'slack', name: 'Slack', icon: 'mdi-slack' },
  { id: 'chrome', name: 'Chrome', icon: 'mdi-google-chrome' },
  { id: 'office', name: 'Office 365', icon: 'mdi-microsoft-office' }
];

const deviceHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Type', key: 'type' },
  { title: 'Status', key: 'status' },
  { title: 'Location', key: 'location' },
  { title: 'Last Seen', key: 'metadata.lastSeen' }
];

// Computed properties for the new workflow
const locationOptions = computed(() => {
  return locationStore.locations;
});

const allDevices = computed(() => deviceStore.devices);

const filteredDevices = computed(() => {
  let devices = allDevices.value;

  // Filter by location
  if (deviceFilters.value.location.length > 0) {
    devices = devices.filter(d => deviceFilters.value.location.includes(d.location));
  }

  // Filter by type
  if (deviceFilters.value.type.length > 0) {
    devices = devices.filter(d => deviceFilters.value.type.includes(d.type));
  }

  // Filter by status
  if (deviceFilters.value.status.length > 0) {
    devices = devices.filter(d => deviceFilters.value.status.includes(d.status));
  }

  // Filter by search
  if (deviceFilters.value.search) {
    const search = deviceFilters.value.search.toLowerCase();
    devices = devices.filter(d =>
      d.name.toLowerCase().includes(search) ||
      d.type.toLowerCase().includes(search) ||
      getLocationName(d.location).toLowerCase().includes(search)
    );
  }

  return devices;
});

const selectedDevicesData = computed(() =>
  allDevices.value.filter(d => selectedDevices.value.includes(d.id))
);

const selectedDevicesByLocation = computed(() => {
  const locations = new Set(selectedDevicesData.value.map(d => d.location));
  return Array.from(locations);
});

const selectedDevicesByType = computed(() => {
  const types = new Set(selectedDevicesData.value.map(d => d.type));
  return Array.from(types);
});

// Template compatibility logic
const compatibleTemplates = computed(() => {
  if (selectedDevices.value.length === 0) return [];

  const selectedTypes = selectedDevicesByType.value;
  return templateStore.templates.filter(template => {
    // Template is compatible if it supports all selected device types
    return selectedTypes.every(type =>
      template.deviceTypes?.includes(type as any)
    );
  });
});

const compatibleTemplatesCount = computed(() => compatibleTemplates.value.length);

const selectedTemplateData = computed(() =>
  templateStore.templates.find(t => t.id === selectedTemplate.value)
);

// Device compatibility for selected template
const compatibleDeviceCount = computed(() => {
  if (!selectedTemplateData.value) return 0;
  return selectedDevicesData.value.filter(device =>
    selectedTemplateData.value!.deviceTypes?.includes(device.type as any)
  ).length;
});

const incompatibleDevices = computed(() => {
  if (!selectedTemplateData.value) return [];
  return selectedDevicesData.value.filter(device =>
    !selectedTemplateData.value!.deviceTypes?.includes(device.type as any)
  );
});

const incompatibleDeviceCount = computed(() => incompatibleDevices.value.length);

const canProceedToNext = computed(() => {
  switch (currentStep.value) {
    case 1:
      return selectedDevices.value.length > 0;
    case 2:
      return !!selectedTemplate.value;
    case 3:
      return !!selectedTemplate.value && selectedTemplateData.value;
    default:
      return false;
  }
});

// Helper functions
const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    online: 'success',
    offline: 'error',
    configuring: 'warning',
    error: 'error'
  };
  return colors[status] || 'grey';
};

const getStatusIcon = (status: string): string => {
  const icons: Record<string, string> = {
    online: 'mdi-check-circle',
    offline: 'mdi-close-circle',
    configuring: 'mdi-loading',
    error: 'mdi-alert-circle'
  };
  return icons[status] || 'mdi-help-circle';
};

const getDeviceTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    ipad_pro: 'mdi-tablet',
    ipad_air: 'mdi-tablet',
    macbook_pro: 'mdi-laptop',
    iphone: 'mdi-cellphone'
  };
  return icons[type] || 'mdi-devices';
};

const getDeviceTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    ipad_pro: 'primary',
    ipad_air: 'secondary',
    macbook_pro: 'info',
    iphone: 'success'
  };
  return colors[type] || 'grey';
};

const getTemplateTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    production: 'purple',
    corporate: 'blue',
    event: 'orange',
    educational: 'green'
  };
  return colors[type] || 'grey';
};

const getLocationName = (locationId: string): string => {
  const location = locationStore.locations.find(l => l.id === locationId);
  return location?.name || 'Unknown Location';
};

const getMatchingDeviceCount = (template: any): number => {
  return selectedDevicesData.value.filter(device =>
    template.deviceTypes?.includes(device.type)
  ).length;
};

// Actions
const clearSelection = () => {
  selectedDevices.value = [];
};

// Watch for template selection to initialize custom settings
watch(selectedTemplate, () => {
  if (selectedTemplateData.value) {
    customSettings.value = {
      network: {
        ssid: selectedTemplateData.value.settings.network.ssid,
        security: selectedTemplateData.value.settings.network.security || 'WPA2',
        vlan: String(selectedTemplateData.value.settings.network.vlan)
      },
      security: {
        encryption: selectedTemplateData.value.settings.security.encryption,
        remoteWipe: selectedTemplateData.value.settings.security.remoteWipe,
        passcode: selectedTemplateData.value.settings.security.passcode || 'optional'
      },
      apps: {
        required: selectedTemplateData.value.settings.apps?.required || []
      }
    };
  }
});

const deployConfiguration = async () => {
  if (!selectedTemplate.value || selectedDevices.value.length === 0) return;

  deploying.value = true;
  try {
    // Filter to only compatible devices
    const compatibleDeviceIds = selectedDevicesData.value
      .filter(device =>
        selectedTemplateData.value!.deviceTypes?.includes(device.type as any)
      )
      .map(device => device.id);

    if (compatibleDeviceIds.length === 0) {
      showError('No Compatible Devices', 'Selected template is not compatible with any selected devices');
      return;
    }

    // Use custom settings if customization is enabled (for future implementation)
    // const finalSettings = enableCustomization.value ? customSettings.value : selectedTemplateData.value!.settings;

    await deviceStore.configureDevices(selectedTemplate.value, compatibleDeviceIds);

    const locationCount = selectedDevicesByLocation.value.length;
    const deviceCount = compatibleDeviceIds.length;

    showSuccess(
      'Configuration Deployed Successfully!',
      `Applied ${selectedTemplateData.value!.name} to ${deviceCount} devices across ${locationCount} location${locationCount > 1 ? 's' : ''}`
    );

    // Redirect after success
    setTimeout(() => {
      router.push('/devices');
    }, 2000);
  } catch (error) {
    console.error('Configuration failed:', error);
    showError(
      'Configuration Failed',
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  } finally {
    deploying.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    templateStore.fetchTemplates(),
    deviceStore.fetchDevices(),
    locationStore.fetchLocations()
  ]);

  // Check if we have device context from query parameters
  const { deviceId, locationId, deviceType } = route.query;

  if (deviceId && typeof deviceId === 'string') {
    // Pre-select the specific device
    selectedDevices.value = [deviceId];
    currentStep.value = 2; // Skip to template selection
  } else if (locationId && typeof locationId === 'string') {
    // Pre-filter by location
    deviceFilters.value.location = [locationId];
  }

  if (deviceType && typeof deviceType === 'string') {
    // Pre-filter by device type
    deviceFilters.value.type = [deviceType];
  }
});
</script>