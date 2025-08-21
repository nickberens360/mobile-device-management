<template>
  <v-dialog
    v-model="isOpen"
    max-width="800px"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-3" color="primary">
          {{ isCreating ? 'mdi-plus-circle' : 'mdi-pencil' }}
        </v-icon>
        {{ isCreating ? 'Create New Location' : 'Edit Location' }}
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
                        label="Location Name"
                        variant="outlined"
                        prepend-inner-icon="mdi-tag"
                        :rules="[rules.required]"
                        placeholder="e.g., Universal Studios - Stage 12"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="formData.type"
                        :items="locationTypeOptions"
                        item-title="label"
                        item-value="value"
                        label="Location Type"
                        variant="outlined"
                        prepend-inner-icon="mdi-domain"
                        :rules="[rules.required]"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="formData.address"
                        label="Address"
                        variant="outlined"
                        prepend-inner-icon="mdi-map-marker"
                        :rules="[rules.required]"
                        rows="2"
                        placeholder="Full address including city, state, and zip code"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Active Productions -->
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">
                  <v-icon class="mr-2">mdi-movie</v-icon>
                  Active Productions
                </v-card-title>
                <v-card-text>
                  <v-combobox
                    v-model="formData.activeProductions"
                    label="Active Productions"
                    variant="outlined"
                    prepend-inner-icon="mdi-movie-outline"
                    multiple
                    chips
                    hint="Enter production names and press Enter to add"
                    placeholder="e.g., Jurassic World: Dominion"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Network Configuration -->
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">
                  <v-icon class="mr-2">mdi-wifi</v-icon>
                  Network Configuration
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-combobox
                        v-model="formData.networkProfiles"
                        :items="commonNetworkProfiles"
                        label="Network Profiles"
                        variant="outlined"
                        prepend-inner-icon="mdi-wifi-settings"
                        multiple
                        chips
                        :rules="[rules.required]"
                        hint="Select existing profiles or add new ones"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Device Information -->
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">
                  <v-icon class="mr-2">mdi-devices</v-icon>
                  Device Information
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model.number="formData.deviceCount"
                        label="Current Device Count"
                        variant="outlined"
                        prepend-inner-icon="mdi-counter"
                        type="number"
                        min="0"
                        :rules="[rules.required, rules.nonNegative]"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model.number="formData.maxCapacity"
                        label="Maximum Device Capacity"
                        variant="outlined"
                        prepend-inner-icon="mdi-database"
                        type="number"
                        min="1"
                        :rules="[rules.required, rules.positive]"
                        hint="Maximum number of devices this location can support"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Additional Details -->
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">
                  <v-icon class="mr-2">mdi-information</v-icon>
                  Additional Details
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.contactPerson"
                        label="Contact Person"
                        variant="outlined"
                        prepend-inner-icon="mdi-account"
                        placeholder="Location manager or primary contact"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.contactEmail"
                        label="Contact Email"
                        variant="outlined"
                        prepend-inner-icon="mdi-email"
                        type="email"
                        :rules="[rules.email]"
                        placeholder="contact@nbcuni.com"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="formData.notes"
                        label="Notes"
                        variant="outlined"
                        prepend-inner-icon="mdi-note-text"
                        rows="3"
                        placeholder="Additional notes or special considerations for this location"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn
          variant="outlined"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          :loading="saving"
          :disabled="!isFormValid"
          @click="saveLocation"
        >
          {{ isCreating ? 'Create Location' : 'Update Location' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Location, LocationType } from '@/types/location';

interface Props {
  modelValue: boolean;
  location: Location | null;
  isCreating: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'location-saved': [location: Location];
  'dialog-closed': [];
}>();

const formRef = ref();
const isFormValid = ref(false);
const saving = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const locationTypeOptions = [
  { value: 'FILM_SET', label: 'Film Set' },
  { value: 'THEME_PARK', label: 'Theme Park' },
  { value: 'CORPORATE_OFFICE', label: 'Corporate Office' },
  { value: 'EVENT_VENUE', label: 'Event Venue' },
  { value: 'BROADCAST_STUDIO', label: 'Broadcast Studio' }
];

const commonNetworkProfiles = [
  'PROD_WIFI',
  'STAFF_WIFI', 
  'GUEST_WIFI',
  'CORP_WIFI',
  'SECURE_NET',
  'BROADCAST_NET',
  'PRODUCTION_WIFI',
  'PARK_WIFI',
  'MEDIA_WIFI',
  'GUEST_SERVICES',
  'EXECUTIVE_NET'
];

const formData = ref({
  name: '',
  type: '' as LocationType,
  address: '',
  activeProductions: [] as string[],
  networkProfiles: [] as string[],
  deviceCount: 0,
  maxCapacity: 100,
  contactPerson: '',
  contactEmail: '',
  notes: ''
});

const rules = {
  required: (value: any) => {
    if (Array.isArray(value)) return value.length > 0 || 'This field is required';
    return !!value || 'This field is required';
  },
  nonNegative: (value: number) => value >= 0 || 'Value must be non-negative',
  positive: (value: number) => value > 0 || 'Value must be positive',
  email: (value: string) => {
    if (!value) return true; // Optional field
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || 'Invalid email format';
  }
};

const loadLocationData = () => {
  if (props.location) {
    formData.value = {
      name: props.location.name,
      type: props.location.type,
      address: props.location.address,
      activeProductions: props.location.activeProductions || [],
      networkProfiles: props.location.networkProfiles || [],
      deviceCount: props.location.deviceCount,
      maxCapacity: (props.location as any).maxCapacity || props.location.deviceCount + 50,
      contactPerson: (props.location as any).contactPerson || '',
      contactEmail: (props.location as any).contactEmail || '',
      notes: (props.location as any).notes || ''
    };
  } else {
    formData.value = {
      name: '',
      type: '' as LocationType,
      address: '',
      activeProductions: [],
      networkProfiles: [],
      deviceCount: 0,
      maxCapacity: 100,
      contactPerson: '',
      contactEmail: '',
      notes: ''
    };
  }
};

const saveLocation = async () => {
  if (!isFormValid.value) return;

  saving.value = true;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const locationData: Location = {
      id: props.location?.id || `loc-${Date.now()}`,
      name: formData.value.name,
      type: formData.value.type,
      address: formData.value.address,
      activeProductions: formData.value.activeProductions,
      networkProfiles: formData.value.networkProfiles,
      deviceCount: formData.value.deviceCount
    };

    emit('location-saved', locationData);
  } catch (error) {
    console.error('Failed to save location:', error);
  } finally {
    saving.value = false;
  }
};

const closeDialog = () => {
  isOpen.value = false;
  emit('dialog-closed');
};

// Watch for location changes
watch(() => props.location, loadLocationData, { immediate: true });

// Watch for dialog opening to reset form
watch(isOpen, (newValue) => {
  if (newValue) {
    loadLocationData();
  }
});
</script>