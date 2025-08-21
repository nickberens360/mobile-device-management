# NBC Universal Device Management System - Project Specification

## Project Overview

Build a Vue.js web application with TypeScript that enables NBC Universal network engineers to remotely configure and manage networked devices (iPads, laptops, mobile phones) across various properties including movie sets, theme parks, and promotional events.

## Core Functionality

### Primary Use Case
Network engineers need to:
1. Select a location (e.g., "Universal Studios - Stage 12")
2. Choose device type(s) to configure
3. Select or create a configuration template
4. Apply settings to multiple devices simultaneously
5. Track device status and configuration history

## Technical Stack

- **Frontend Framework**: Vue 3 (Composition API) with TypeScript
- **UI Framework**: Vuetify 3
- **Form Library**: FormKit (with TypeScript support)
- **HTTP Client**: Axios
- **State Management**: Pinia (with TypeScript)
- **Router**: Vue Router 4
- **Build Tool**: Vite
- **Package Manager**: npm
- **Type Checking**: TypeScript 5.x

## Project Structure

```
nbc-device-manager/
├── src/
│   ├── api/
│   │   ├── index.ts
│   │   ├── devices.ts
│   │   ├── locations.ts
│   │   ├── templates.ts
│   │   └── configurations.ts
│   ├── assets/
│   │   └── styles/
│   │       └── main.scss
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppSidebar.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   └── AlertMessage.vue
│   │   ├── devices/
│   │   │   ├── DeviceList.vue
│   │   │   ├── DeviceCard.vue
│   │   │   ├── DeviceSelector.vue
│   │   │   └── DeviceStatusBadge.vue
│   │   └── forms/
│   │       ├── ConfigurationForm.vue
│   │       ├── TemplateSelector.vue
│   │       └── DynamicFormField.vue
│   ├── composables/
│   │   ├── useApi.ts
│   │   ├── useNotifications.ts
│   │   └── useDeviceConfiguration.ts
│   ├── layouts/
│   │   └── MainLayout.vue
│   ├── plugins/
│   │   └── vuetify.ts
│   ├── router/
│   │   └── index.ts
│   ├── stores/
│   │   ├── devices.ts
│   │   ├── locations.ts
│   │   ├── templates.ts
│   │   └── user.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── device.ts
│   │   ├── location.ts
│   │   ├── template.ts
│   │   └── configuration.ts
│   ├── views/
│   │   ├── Dashboard.vue
│   │   ├── ConfigureDevices.vue
│   │   ├── DeviceManagement.vue
│   │   ├── Templates.vue
│   │   └── History.vue
│   ├── App.vue
│   ├── main.ts
│   ├── env.d.ts
│   └── shims-vue.d.ts
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Key Features to Implement

### 1. Dashboard View
- Summary cards showing:
    - Total devices by location
    - Recent configuration activities
    - Devices needing attention
    - Quick action buttons
- Utilize Vuetify's v-card and v-row/v-col grid system

### 2. Device Configuration Wizard
Multi-step form with Vuetify stepper:
- **Step 1**: Location Selection
    - v-autocomplete with NBC properties
    - Search/filter capability
- **Step 2**: Device Selection
    - v-data-table with selection
    - Filter by device type using v-chip-group
    - Show device current status with v-badge
- **Step 3**: Configuration Options
    - Dynamic form based on device type
    - Template selection with v-select
    - Preview changes in v-expansion-panels
- **Step 4**: Review & Deploy
    - Summary cards
    - Affected devices list
    - v-dialog for confirmation

### 3. Configuration Templates
- Pre-defined templates for common scenarios:
    - "Film Production - Crew Devices"
    - "Theme Park - Staff Devices"
    - "Press Event - Media Devices"
    - "Corporate - Office Devices"
- CRUD operations with v-data-table
- Template versioning

### 4. Device Management
- v-data-table with:
    - Server-side pagination
    - Multi-sort
    - Custom filters
    - Row selection for bulk actions
- v-menu for bulk actions
- v-dialog for device details

### 5. Configuration History
- Timeline view with v-timeline
- Rollback capability
- Export with v-btn actions

## TypeScript Type Definitions

```typescript
// types/device.ts
export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  location: string;
  status: DeviceStatus;
  currentConfig: DeviceConfiguration | null;
  metadata: DeviceMetadata;
}

export enum DeviceType {
  IPAD_PRO = 'ipad_pro',
  IPAD_AIR = 'ipad_air',
  MACBOOK_PRO = 'macbook_pro',
  IPHONE = 'iphone'
}

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  CONFIGURING = 'configuring',
  ERROR = 'error'
}

export interface DeviceConfiguration {
  template: string;
  appliedAt: string;
  appliedBy: string;
}

export interface DeviceMetadata {
  serialNumber: string;
  osVersion: string;
  lastSeen: string;
}

// types/template.ts
export interface ConfigurationTemplate {
  id: string;
  name: string;
  description: string;
  deviceTypes: DeviceType[];
  settings: TemplateSettings;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface TemplateSettings {
  network: NetworkSettings;
  vpn: VPNSettings;
  apps: AppSettings;
  security: SecuritySettings;
}

export interface NetworkSettings {
  ssid: string;
  security: 'WPA2' | 'WPA3';
  vlan: number;
}

export interface VPNSettings {
  enabled: boolean;
  server?: string;
}

export interface AppSettings {
  required: string[];
  blocked: string[];
}

export interface SecuritySettings {
  passcode: 'required' | 'optional' | 'disabled';
  encryption: boolean;
  remoteWipe: boolean;
}

// types/location.ts
export interface Location {
  id: string;
  name: string;
  type: LocationType;
  address: string;
  activeProductions?: string[];
  deviceCount: number;
  networkProfiles: string[];
}

export enum LocationType {
  FILM_SET = 'film_set',
  THEME_PARK = 'theme_park',
  CORPORATE_OFFICE = 'corporate_office',
  EVENT_VENUE = 'event_venue'
}

// types/api.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BulkConfigureRequest {
  deviceIds: string[];
  templateId: string;
  customSettings?: Partial<TemplateSettings>;
}
```

## API Service Layer with TypeScript

```typescript
// api/index.ts
import axios, { AxiosInstance } from 'axios';
import type { ApiResponse } from '@/types/api';

class ApiService {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axios.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
          // Redirect to login
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.axios.get<T>(url, { params });
    return {
      data: response.data,
      status: response.status,
    };
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.axios.post<T>(url, data);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.axios.put<T>(url, data);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.axios.delete<T>(url);
    return {
      data: response.data,
      status: response.status,
    };
  }
}

export default new ApiService();
```

## Pinia Store with TypeScript

```typescript
// stores/devices.ts
import { defineStore } from 'pinia';
import type { Device, DeviceType } from '@/types/device';
import type { PaginatedResponse } from '@/types/api';
import deviceApi from '@/api/devices';

interface DeviceState {
  devices: Device[];
  selectedDevices: Set<string>;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  filters: {
    location?: string;
    type?: DeviceType;
    status?: string;
  };
}

export const useDeviceStore = defineStore('devices', {
  state: (): DeviceState => ({
    devices: [],
    selectedDevices: new Set(),
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
    },
    filters: {},
  }),

  getters: {
    selectedDevicesList: (state): Device[] => {
      return state.devices.filter(d => state.selectedDevices.has(d.id));
    },

    filteredDevices: (state): Device[] => {
      return state.devices.filter(device => {
        if (state.filters.location && device.location !== state.filters.location) {
          return false;
        }
        if (state.filters.type && device.type !== state.filters.type) {
          return false;
        }
        if (state.filters.status && device.status !== state.filters.status) {
          return false;
        }
        return true;
      });
    },
  },

  actions: {
    async fetchDevices(): Promise<void> {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await deviceApi.getDevices({
          ...this.pagination,
          ...this.filters,
        });
        
        this.devices = response.data.data;
        this.pagination.total = response.data.total;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch devices';
      } finally {
        this.loading = false;
      }
    },

    selectDevice(deviceId: string): void {
      this.selectedDevices.add(deviceId);
    },

    deselectDevice(deviceId: string): void {
      this.selectedDevices.delete(deviceId);
    },

    clearSelection(): void {
      this.selectedDevices.clear();
    },

    setFilter<K extends keyof DeviceState['filters']>(
      key: K,
      value: DeviceState['filters'][K]
    ): void {
      this.filters[key] = value;
      this.pagination.page = 1; // Reset to first page
      this.fetchDevices();
    },

    async configureDevices(templateId: string, deviceIds: string[]): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        await deviceApi.bulkConfigure({
          templateId,
          deviceIds,
        });
        
        // Refresh device list
        await this.fetchDevices();
        this.clearSelection();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Configuration failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
```

## Vuetify Configuration

```typescript
// plugins/vuetify.ts
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

// NBC Universal brand colors
const nbcTheme = {
  dark: false,
  colors: {
    primary: '#5E2C91', // NBC Purple
    secondary: '#F37021', // NBC Orange
    accent: '#0089D0', // NBC Blue
    error: '#D32F2F',
    info: '#1976D2',
    success: '#388E3C',
    warning: '#F57C00',
    background: '#F5F5F5',
    surface: '#FFFFFF',
  },
};

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'nbcTheme',
    themes: {
      nbcTheme,
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});
```

## Component Example with TypeScript and Vuetify

```vue
<!-- views/ConfigureDevices.vue -->
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Configure Devices</h1>
        
        <v-stepper v-model="currentStep" :items="steps" flat>
          <template v-slot:item.1>
            <v-card flat>
              <v-card-title>Select Location</v-card-title>
              <v-card-text>
                <v-autocomplete
                  v-model="selectedLocation"
                  :items="locations"
                  item-title="name"
                  item-value="id"
                  label="Choose a location"
                  variant="outlined"
                  prepend-inner-icon="mdi-map-marker"
                  :loading="locationsLoading"
                  clearable
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:append>
                        <v-chip size="small" color="primary">
                          {{ item.raw.deviceCount }} devices
                        </v-chip>
                      </template>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  @click="currentStep++"
                  :disabled="!selectedLocation"
                >
                  Next
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>

          <template v-slot:item.2>
            <v-card flat>
              <v-card-title>Select Devices</v-card-title>
              <v-card-text>
                <v-chip-group
                  v-model="selectedDeviceType"
                  class="mb-4"
                  filter
                  mandatory
                >
                  <v-chip
                    v-for="type in deviceTypes"
                    :key="type.value"
                    :value="type.value"
                  >
                    <v-icon start>{{ type.icon }}</v-icon>
                    {{ type.label }}
                  </v-chip>
                </v-chip-group>

                <v-data-table
                  v-model="selectedDevices"
                  :headers="deviceHeaders"
                  :items="filteredDevices"
                  :loading="devicesLoading"
                  show-select
                  class="elevation-1"
                  item-value="id"
                >
                  <template v-slot:item.status="{ item }">
                    <v-chip
                      :color="getStatusColor(item.status)"
                      size="small"
                      variant="tonal"
                    >
                      {{ item.status }}
                    </v-chip>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="currentStep--">Back</v-btn>
                <v-spacer />
                <v-btn
                  color="primary"
                  @click="currentStep++"
                  :disabled="selectedDevices.length === 0"
                >
                  Next
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>

          <template v-slot:item.3>
            <v-card flat>
              <v-card-title>Configure Settings</v-card-title>
              <v-card-text>
                <v-select
                  v-model="selectedTemplate"
                  :items="templates"
                  item-title="name"
                  item-value="id"
                  label="Configuration Template"
                  variant="outlined"
                  prepend-inner-icon="mdi-file-document-outline"
                  class="mb-4"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :subtitle="item.raw.description" />
                  </template>
                </v-select>

                <v-expansion-panels v-if="selectedTemplate" class="mb-4">
                  <v-expansion-panel title="Network Settings">
                    <v-expansion-panel-text>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="configuration.network.ssid"
                            :items="availableNetworks"
                            label="WiFi Network"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="configuration.network.security"
                            :items="['WPA2', 'WPA3']"
                            label="Security Protocol"
                            variant="outlined"
                          />
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                  
                  <v-expansion-panel title="Security Settings">
                    <v-expansion-panel-text>
                      <v-switch
                        v-model="configuration.security.encryption"
                        label="Enable Encryption"
                        color="primary"
                      />
                      <v-switch
                        v-model="configuration.security.remoteWipe"
                        label="Enable Remote Wipe"
                        color="primary"
                      />
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="currentStep--">Back</v-btn>
                <v-spacer />
                <v-btn
                  color="primary"
                  @click="currentStep++"
                  :disabled="!selectedTemplate"
                >
                  Next
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>

          <template v-slot:item.4>
            <v-card flat>
              <v-card-title>Review & Deploy</v-card-title>
              <v-card-text>
                <v-alert type="info" variant="tonal" class="mb-4">
                  You are about to configure {{ selectedDevices.length }} devices
                  at {{ selectedLocationName }}
                </v-alert>
                
                <v-list>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-map-marker</v-icon>
                    </template>
                    <v-list-item-title>Location</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedLocationName }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-devices</v-icon>
                    </template>
                    <v-list-item-title>Devices</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ selectedDevices.length }} devices selected
                    </v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-file-document-outline</v-icon>
                    </template>
                    <v-list-item-title>Template</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedTemplateName }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="currentStep--">Back</v-btn>
                <v-spacer />
                <v-btn
                  color="success"
                  @click="deployConfiguration"
                  :loading="deploying"
                >
                  Deploy Configuration
                  <v-icon end>mdi-rocket-launch</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDeviceStore } from '@/stores/devices';
import { useLocationStore } from '@/stores/locations';
import { useTemplateStore } from '@/stores/templates';
import { useNotifications } from '@/composables/useNotifications';
import type { Device, DeviceType } from '@/types/device';
import type { Location } from '@/types/location';
import type { ConfigurationTemplate, TemplateSettings } from '@/types/template';

const router = useRouter();
const deviceStore = useDeviceStore();
const locationStore = useLocationStore();
const templateStore = useTemplateStore();
const { showSuccess, showError } = useNotifications();

// Stepper state
const currentStep = ref(1);
const steps = [
  'Select Location',
  'Select Devices',
  'Configure Settings',
  'Review & Deploy'
];

// Form state
const selectedLocation = ref<string>('');
const selectedDevices = ref<string[]>([]);
const selectedDeviceType = ref<DeviceType>(DeviceType.IPAD_PRO);
const selectedTemplate = ref<string>('');
const configuration = ref<Partial<TemplateSettings>>({
  network: { ssid: '', security: 'WPA3', vlan: 100 },
  security: { encryption: true, remoteWipe: true, passcode: 'required' }
});

// Loading states
const locationsLoading = ref(false);
const devicesLoading = ref(false);
const deploying = ref(false);

// Device type options
const deviceTypes = [
  { value: DeviceType.IPAD_PRO, label: 'iPad Pro', icon: 'mdi-tablet' },
  { value: DeviceType.IPAD_AIR, label: 'iPad Air', icon: 'mdi-tablet' },
  { value: DeviceType.MACBOOK_PRO, label: 'MacBook Pro', icon: 'mdi-laptop' },
  { value: DeviceType.IPHONE, label: 'iPhone', icon: 'mdi-cellphone' }
];

// Table headers
const deviceHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Type', key: 'type' },
  { title: 'Status', key: 'status' },
  { title: 'Last Seen', key: 'metadata.lastSeen' }
];

// Computed properties
const locations = computed(() => locationStore.locations);
const templates = computed(() => templateStore.templates);
const filteredDevices = computed(() => 
  deviceStore.devices.filter(d => 
    d.location === selectedLocation.value && 
    d.type === selectedDeviceType.value
  )
);

const selectedLocationName = computed(() => {
  const location = locations.value.find(l => l.id === selectedLocation.value);
  return location?.name || '';
});

const selectedTemplateName = computed(() => {
  const template = templates.value.find(t => t.id === selectedTemplate.value);
  return template?.name || '';
});

// Methods
const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    online: 'success',
    offline: 'error',
    configuring: 'warning',
    error: 'error'
  };
  return colors[status] || 'grey';
};

const deployConfiguration = async () => {
  deploying.value = true;
  
  try {
    await deviceStore.configureDevices(selectedTemplate.value, selectedDevices.value);
    showSuccess('Configuration deployed successfully!');
    router.push('/device-management');
  } catch (error) {
    showError('Failed to deploy configuration');
  } finally {
    deploying.value = false;
  }
};

// Load initial data
onMounted(async () => {
  locationsLoading.value = true;
  await locationStore.fetchLocations();
  locationsLoading.value = false;
  
  await templateStore.fetchTemplates();
});

// Watch for location changes to load devices
watch(selectedLocation, async (newLocation) => {
  if (newLocation) {
    devicesLoading.value = true;
    await deviceStore.fetchDevices({ location: newLocation });
    devicesLoading.value = false;
  }
});
</script>
```

## Development Setup Instructions

```bash
# Create project with TypeScript
npm create vite@latest nbc-device-manager -- --template vue-ts

# Navigate to project
cd nbc-device-manager

# Install dependencies
npm install vue-router@4 pinia axios vuetify@^3.4.0 @mdi/font @formkit/vue sass

# Install TypeScript dependencies
npm install -D @types/node @vue/tsconfig @tsconfig/node18

# Install dev dependencies
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

## TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Vite Configuration with TypeScript

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api.nbc-devices.internal',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

## Environment Variables

```env
VITE_API_BASE_URL=https://api.nbc-devices.internal/v1
VITE_APP_TITLE=NBC Device Manager
VITE_MOCK_API=true
```

## Mock Data with TypeScript

```typescript
// mocks/locations.ts
import type { Location, LocationType } from '@/types/location';

export const mockLocations: Location[] = [
  {
    id: 'loc-1',
    name: 'Universal Studios - Stage 12',
    type: LocationType.FILM_SET,
    address: '100 Universal City Plaza, Universal City, CA',
    activeProductions: ['Jurassic World: Dominion'],
    deviceCount: 87,
    networkProfiles: ['PROD_WIFI', 'GUEST_WIFI']
  },
  {
    id: 'loc-2',
    name: 'Universal Orlando - Islands of Adventure',
    type: LocationType.THEME_PARK,
    address: '6000 Universal Blvd, Orlando, FL',
    deviceCount: 234,
    networkProfiles: ['PARK_WIFI', 'STAFF_WIFI', 'GUEST_WIFI']
  },
  {
    id: 'loc-3',
    name: '30 Rockefeller Plaza',
    type: LocationType.CORPORATE_OFFICE,
    address: '30 Rockefeller Plaza, New York, NY',
    deviceCount: 456,
    networkProfiles: ['CORP_WIFI', 'GUEST_WIFI', 'SECURE_NET']
  }
];

// mocks/devices.ts
import type { Device, DeviceType, DeviceStatus } from '@/types/device';

export const mockDevices: Device[] = [
  {
    id: 'dev-1',
    name: 'iPad-Prod-001',
    type: DeviceType.IPAD_PRO,
    location: 'loc-1',
    status: DeviceStatus.ONLINE,
    currentConfig: {
      template: 'tpl-1',
      appliedAt: '2024-01-15T10:30:00Z',
      appliedBy: 'john.doe@nbcuni.com'
    },
    metadata: {
      serialNumber: 'ABC123',
      osVersion: '17.2',
      lastSeen: '2024-01-15T14:22:00Z'
    }
  },
  // ... more devices
];
```

## Initial Implementation Priority

1. **Phase 1**: Basic structure with TypeScript
    - Set up Vue + TypeScript project with Vuetify
    - Create type definitions
    - Implement mock API layer with proper typing
    - Build location selector with Vuetify components

2. **Phase 2**: Core workflow
    - Device selection with v-data-table
    - Configuration form with Vuetify form components
    - Template selection with type safety

3. **Phase 3**: Advanced features
    - Dynamic form generation with TypeScript
    - Bulk operations with proper error handling
    - Configuration history with v-timeline
    - Real API integration with type-safe responses

## Success Criteria

- Network engineers can configure 50+ devices in under 5 minutes
- Support for at least 4 device types with type safety
- Template system reduces configuration time by 80%
- Mobile-responsive design using Vuetify's breakpoint system
- Clear error handling with TypeScript error types
- Type-safe audit trail for all configurations

## Notes for Implementation

- Use TypeScript's strict mode for maximum type safety
- Leverage Vuetify's built-in validation for forms
- Implement proper loading states with v-progress-linear
- Use Vuetify's theme system for NBC Universal branding
- Take advantage of Vuetify's accessibility features
- Implement a dark mode toggle using Vuetify's theme switcher
- Use v-dialog for all confirmations to prevent accidental bulk operations
- Utilize Vuetify's v-virtual-scroll for large device lists
- Implement comprehensive error boundaries with TypeScript