<template>
  <v-dialog
    v-model="isOpen"
    max-width="800px"
    persistent
  >
    <v-card v-if="device">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-3" color="primary">mdi-devices</v-icon>
        Device Details
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialog"
        />
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="isFormValid">
          <v-row>
            <!-- Basic Information -->
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">Basic Information</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.name"
                        label="Device Name"
                        variant="outlined"
                        prepend-inner-icon="mdi-tag"
                        :rules="[rules.required]"
                        :readonly="!isEditing"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="formData.type"
                        :items="deviceTypes"
                        item-title="label"
                        item-value="value"
                        label="Device Type"
                        variant="outlined"
                        prepend-inner-icon="mdi-cellphone"
                        :readonly="!isEditing"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-autocomplete
                        v-model="formData.location"
                        :items="locations"
                        item-title="name"
                        item-value="id"
                        label="Location"
                        variant="outlined"
                        prepend-inner-icon="mdi-map-marker"
                        :readonly="!isEditing"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="formData.status"
                        :items="statusOptions"
                        item-title="label"
                        item-value="value"
                        label="Status"
                        variant="outlined"
                        prepend-inner-icon="mdi-information"
                        :readonly="!isEditing"
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <template v-slot:prepend>
                              <v-icon :color="getStatusColor(item.raw.value)">
                                {{ getStatusIcon(item.raw.value) }}
                              </v-icon>
                            </template>
                          </v-list-item>
                        </template>
                      </v-select>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Device Metadata -->
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">Device Metadata</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.metadata.serialNumber"
                        label="Serial Number"
                        variant="outlined"
                        prepend-inner-icon="mdi-barcode"
                        :readonly="!isEditing"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.metadata.osVersion"
                        label="OS Version"
                        variant="outlined"
                        prepend-inner-icon="mdi-information-outline"
                        :readonly="!isEditing"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.metadata.lastSeen"
                        label="Last Seen"
                        variant="outlined"
                        prepend-inner-icon="mdi-clock-outline"
                        type="datetime-local"
                        :readonly="!isEditing"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Current Configuration -->
            <v-col cols="12" v-if="device.currentConfig">
              <v-card variant="outlined">
                <v-card-title class="text-h6">Current Configuration</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        :model-value="device.currentConfig.template"
                        label="Template ID"
                        variant="outlined"
                        prepend-inner-icon="mdi-file-document"
                        readonly
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        :model-value="device.currentConfig.appliedBy"
                        label="Applied By"
                        variant="outlined"
                        prepend-inner-icon="mdi-account"
                        readonly
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        :model-value="formatDate(device.currentConfig.appliedAt)"
                        label="Applied At"
                        variant="outlined"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- No Configuration Card -->
            <v-col cols="12" v-else>
              <v-card variant="outlined" color="warning">
                <v-card-text class="d-flex align-center">
                  <v-icon color="warning" class="mr-3">mdi-alert</v-icon>
                  <div>
                    <div class="text-h6">No Configuration Applied</div>
                    <div class="text-body-2">This device has not been configured yet.</div>
                  </div>
                  <v-spacer />
                  <v-btn
                    color="primary"
                    variant="outlined"
                    prepend-icon="mdi-cog"
                    @click="configureDevice"
                  >
                    Configure Now
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn
          v-if="!isEditing"
          color="primary"
          prepend-icon="mdi-pencil"
          @click="startEditing"
        >
          Edit Device
        </v-btn>
        
        <template v-else>
          <v-btn
            color="success"
            prepend-icon="mdi-check"
            :loading="saving"
            :disabled="!isFormValid"
            @click="saveChanges"
          >
            Save Changes
          </v-btn>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-cancel"
            @click="cancelEditing"
          >
            Cancel
          </v-btn>
        </template>

        <v-spacer />

        <v-btn
          color="secondary"
          prepend-icon="mdi-cog"
          @click="configureDevice"
        >
          Configure Device
        </v-btn>

        <v-btn
          variant="outlined"
          @click="closeDialog"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useLocationStore } from '@/stores/locations';
import { useNotifications } from '@/composables/useNotifications';
import type { Device, DeviceType, DeviceStatus } from '@/types/device';

interface Props {
  device: Device | null;
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'device-updated': [device: Device];
  'dialog-closed': [];
}>();

const router = useRouter();
const locationStore = useLocationStore();
const { showSuccess, showError } = useNotifications();

const formRef = ref();
const isFormValid = ref(false);
const isEditing = ref(false);
const saving = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const locations = computed(() => locationStore.locations);

const formData = ref<{
  name: string;
  type: DeviceType;
  location: string;
  status: DeviceStatus;
  metadata: {
    serialNumber: string;
    osVersion: string;
    lastSeen: string;
  };
}>({
  name: '',
  type: 'ipad_pro' as DeviceType,
  location: '',
  status: 'offline' as DeviceStatus,
  metadata: {
    serialNumber: '',
    osVersion: '',
    lastSeen: ''
  }
});

const deviceTypes = [
  { value: 'ipad_pro', label: 'iPad Pro' },
  { value: 'ipad_air', label: 'iPad Air' },
  { value: 'macbook_pro', label: 'MacBook Pro' },
  { value: 'iphone', label: 'iPhone' }
];

const statusOptions = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'configuring', label: 'Configuring' },
  { value: 'error', label: 'Error' }
];

const rules = {
  required: (value: string) => !!value || 'This field is required'
};

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
    offline: 'mdi-minus-circle',
    configuring: 'mdi-loading',
    error: 'mdi-alert-circle'
  };
  return icons[status] || 'mdi-help-circle';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

const loadDeviceData = () => {
  if (props.device) {
    formData.value = {
      name: props.device.name,
      type: props.device.type,
      location: props.device.location,
      status: props.device.status,
      metadata: {
        serialNumber: props.device.metadata.serialNumber,
        osVersion: props.device.metadata.osVersion,
        lastSeen: props.device.metadata.lastSeen
      }
    };
  }
};

const startEditing = () => {
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  loadDeviceData(); // Reset form data
};

const saveChanges = async () => {
  if (!props.device || !isFormValid.value) return;

  saving.value = true;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedDevice: Device = {
      ...props.device,
      name: formData.value.name,
      type: formData.value.type,
      location: formData.value.location,
      status: formData.value.status,
      metadata: {
        ...formData.value.metadata
      }
    };

    emit('device-updated', updatedDevice);
    showSuccess('Device Updated', `${formData.value.name} has been updated successfully.`);
    isEditing.value = false;
  } catch (error) {
    showError('Update Failed', 'Failed to update device. Please try again.');
  } finally {
    saving.value = false;
  }
};

const configureDevice = () => {
  closeDialog();
  // Pass device context as query parameters for better UX
  router.push({
    path: '/configure',
    query: {
      deviceId: props.device?.id,
      locationId: props.device?.location,
      deviceType: props.device?.type
    }
  });
};

const closeDialog = () => {
  isOpen.value = false;
  isEditing.value = false;
  emit('dialog-closed');
};

// Watch for device changes
watch(() => props.device, loadDeviceData, { immediate: true });

// Load locations when dialog opens
watch(isOpen, (newValue) => {
  if (newValue && locationStore.locations.length === 0) {
    locationStore.fetchLocations();
  }
});
</script>