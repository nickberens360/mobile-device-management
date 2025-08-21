<template>
  <v-container fluid>
    <h1 class="text-h4 mb-6">Configure Devices</h1>
    
    <v-stepper v-model="currentStep" :items="steps" flat>
      <template v-slot:item.1>
        <DeviceSelector @location-selected="onLocationSelected" />
        <v-card-actions class="justify-end">
          <v-btn
            color="primary"
            @click="currentStep++"
            :disabled="!selectedLocation"
          >
            Next
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </v-card-actions>
      </template>

      <template v-slot:item.2>
        <v-card>
          <v-card-title>Select Device Type</v-card-title>
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

            <v-alert
              v-if="!locationDevices.length"
              type="info"
              variant="tonal"
              class="mb-4"
            >
              No devices found for the selected location and type.
            </v-alert>

            <v-data-table
              v-else
              v-model="selectedDevices"
              :headers="deviceHeaders"
              :items="locationDevices"
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
              <template v-slot:item.type="{ item }">
                <v-chip size="small" variant="outlined">
                  {{ item.type.replace('_', ' ') }}
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
              Next ({{ selectedDevices.length }} devices)
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>

      <template v-slot:item.3>
        <v-card>
          <v-card-title>Select Template</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedTemplate"
              :items="availableTemplates"
              item-title="name"
              item-value="id"
              label="Configuration Template"
              variant="outlined"
              prepend-inner-icon="mdi-file-document-outline"
              :loading="templatesLoading"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :subtitle="item.raw.description" />
              </template>
            </v-select>

            <v-card
              v-if="selectedTemplateData"
              variant="outlined"
              class="mt-4"
            >
              <v-card-title>Template Preview</v-card-title>
              <v-card-text>
                <v-expansion-panels>
                  <v-expansion-panel title="Network Settings">
                    <v-expansion-panel-text>
                      <div class="d-flex align-center mb-2">
                        <v-icon class="mr-2">mdi-wifi</v-icon>
                        <strong>SSID:</strong>
                        <v-chip size="small" class="ml-2">
                          {{ selectedTemplateData.settings.network.ssid }}
                        </v-chip>
                      </div>
                      <div class="d-flex align-center mb-2">
                        <v-icon class="mr-2">mdi-shield</v-icon>
                        <strong>Security:</strong>
                        <v-chip size="small" class="ml-2" color="success">
                          {{ selectedTemplateData.settings.network.security }}
                        </v-chip>
                      </div>
                      <div class="d-flex align-center">
                        <v-icon class="mr-2">mdi-network</v-icon>
                        <strong>VLAN:</strong>
                        <v-chip size="small" class="ml-2">
                          {{ selectedTemplateData.settings.network.vlan }}
                        </v-chip>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>

                  <v-expansion-panel title="Security Settings">
                    <v-expansion-panel-text>
                      <div class="d-flex align-center mb-2">
                        <v-icon class="mr-2" :color="selectedTemplateData.settings.security.encryption ? 'success' : 'error'">
                          {{ selectedTemplateData.settings.security.encryption ? 'mdi-check' : 'mdi-close' }}
                        </v-icon>
                        <span>Encryption {{ selectedTemplateData.settings.security.encryption ? 'Enabled' : 'Disabled' }}</span>
                      </div>
                      <div class="d-flex align-center mb-2">
                        <v-icon class="mr-2" :color="selectedTemplateData.settings.security.remoteWipe ? 'success' : 'error'">
                          {{ selectedTemplateData.settings.security.remoteWipe ? 'mdi-check' : 'mdi-close' }}
                        </v-icon>
                        <span>Remote Wipe {{ selectedTemplateData.settings.security.remoteWipe ? 'Enabled' : 'Disabled' }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <v-icon class="mr-2">mdi-lock</v-icon>
                        <strong>Passcode:</strong>
                        <v-chip size="small" class="ml-2">
                          {{ selectedTemplateData.settings.security.passcode }}
                        </v-chip>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="currentStep--">Back</v-btn>
            <v-spacer />
            <v-btn
              color="success"
              @click="deployConfiguration"
              :disabled="!selectedTemplate"
              :loading="deploying"
            >
              Deploy Configuration
              <v-icon end>mdi-rocket-launch</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-stepper>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDeviceStore } from '@/stores/devices';
import { useTemplateStore } from '@/stores/templates';
import DeviceSelector from '@/components/devices/DeviceSelector.vue';
import type { DeviceType } from '@/types/device';
import type { Location } from '@/types/location';

const router = useRouter();
const deviceStore = useDeviceStore();
const templateStore = useTemplateStore();

const currentStep = ref(1);
const steps = ['Select Location', 'Select Devices', 'Configure & Deploy'];

const selectedLocation = ref<Location | null>(null);
const selectedDevices = ref<string[]>([]);
const selectedDeviceType = ref<DeviceType>('ipad_pro' as DeviceType);
const selectedTemplate = ref<string>('');

const devicesLoading = ref(false);
const templatesLoading = computed(() => templateStore.loading);
const deploying = ref(false);

const deviceTypes = [
  { value: 'ipad_pro', label: 'iPad Pro', icon: 'mdi-tablet' },
  { value: 'ipad_air', label: 'iPad Air', icon: 'mdi-tablet' },
  { value: 'macbook_pro', label: 'MacBook Pro', icon: 'mdi-laptop' },
  { value: 'iphone', label: 'iPhone', icon: 'mdi-cellphone' }
];

const deviceHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Type', key: 'type' },
  { title: 'Status', key: 'status' },
  { title: 'Last Seen', key: 'metadata.lastSeen' }
];

const locationDevices = computed(() => {
  if (!selectedLocation.value) return [];
  return deviceStore.devices.filter(d => 
    d.location === selectedLocation.value!.id && 
    d.type === selectedDeviceType.value
  );
});

const availableTemplates = computed(() => {
  return templateStore.templates.filter(template =>
    template.deviceTypes.includes(selectedDeviceType.value)
  );
});

const selectedTemplateData = computed(() => {
  return templateStore.templates.find(t => t.id === selectedTemplate.value);
});

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    online: 'success',
    offline: 'error',
    configuring: 'warning',
    error: 'error'
  };
  return colors[status] || 'grey';
};

const onLocationSelected = async (location: Location) => {
  selectedLocation.value = location;
  devicesLoading.value = true;
  try {
    await deviceStore.fetchDevices();
  } finally {
    devicesLoading.value = false;
  }
};

const deployConfiguration = async () => {
  if (!selectedTemplate.value || selectedDevices.value.length === 0) return;
  
  deploying.value = true;
  try {
    await deviceStore.configureDevices(selectedTemplate.value, selectedDevices.value);
    
    // Show success message and redirect
    router.push('/devices');
  } catch (error) {
    console.error('Configuration failed:', error);
  } finally {
    deploying.value = false;
  }
};

onMounted(() => {
  templateStore.fetchTemplates();
});

watch(selectedDeviceType, () => {
  selectedDevices.value = [];
  selectedTemplate.value = '';
});
</script>