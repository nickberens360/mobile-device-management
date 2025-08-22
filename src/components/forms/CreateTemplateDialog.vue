<template>
  <v-dialog
    v-model="isOpen"
    max-width="900px"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon
          class="mr-3"
          color="primary"
        >
          mdi-plus-circle
        </v-icon>
        {{ isEditMode ? 'Edit Template' : 'Create New Template' }}
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialog"
        />
      </v-card-title>

      <v-card-text>
        <v-form
          ref="formRef"
          v-model="isFormValid"
        >
          <v-row>
            <!-- Basic Information -->
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">
                  Basic Information
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        v-model="formData.name"
                        label="Template Name"
                        variant="outlined"
                        prepend-inner-icon="mdi-tag"
                        :rules="[rules.required]"
                        placeholder="e.g., Production Crew - Universal Studios"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        v-model="formData.createdBy"
                        label="Created By"
                        variant="outlined"
                        prepend-inner-icon="mdi-account"
                        :rules="[rules.required]"
                        placeholder="your.email@nbcuni.com"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="formData.description"
                        label="Description"
                        variant="outlined"
                        prepend-inner-icon="mdi-text"
                        :rules="[rules.required]"
                        rows="3"
                        placeholder="Describe the purpose and use case for this template..."
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        v-model="formData.deviceTypes"
                        :items="deviceTypeOptions"
                        item-title="label"
                        item-value="value"
                        label="Supported Device Types"
                        variant="outlined"
                        prepend-inner-icon="mdi-devices"
                        multiple
                        chips
                        :rules="[rules.required]"
                        placeholder="Select device types this template supports"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Network Settings -->
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">
                  <v-icon class="mr-2">
                    mdi-wifi
                  </v-icon>
                  Network Settings
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-text-field
                        v-model="formData.settings.network.ssid"
                        label="WiFi SSID"
                        variant="outlined"
                        prepend-inner-icon="mdi-wifi"
                        :rules="[rules.required]"
                        placeholder="NETWORK_NAME"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-select
                        v-model="formData.settings.network.security"
                        :items="securityOptions"
                        item-title="label"
                        item-value="value"
                        label="Security Protocol"
                        variant="outlined"
                        prepend-inner-icon="mdi-shield"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-text-field
                        v-model.number="formData.settings.network.vlan"
                        label="VLAN ID"
                        variant="outlined"
                        prepend-inner-icon="mdi-network"
                        type="number"
                        :rules="[rules.required, rules.vlan]"
                        placeholder="100"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- VPN Settings -->
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">
                  <v-icon class="mr-2">
                    mdi-vpn
                  </v-icon>
                  VPN Settings
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-switch
                        v-model="formData.settings.vpn!.enabled"
                        label="Enable VPN Connection"
                        color="primary"
                        inset
                      />
                    </v-col>
                    <v-col
                      v-if="formData.settings.vpn?.enabled"
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        v-model="formData.settings.vpn!.server"
                        label="VPN Server"
                        variant="outlined"
                        prepend-inner-icon="mdi-server"
                        :rules="formData.settings.vpn?.enabled ? [rules.required] : []"
                        placeholder="vpn.nbcuni.com"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Security Settings -->
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">
                  <v-icon class="mr-2">
                    mdi-security
                  </v-icon>
                  Security Settings
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-select
                        v-model="formData.settings.security.passcode"
                        :items="passcodeOptions"
                        item-title="label"
                        item-value="value"
                        label="Passcode Requirement"
                        variant="outlined"
                        prepend-inner-icon="mdi-lock"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-switch
                        v-model="formData.settings.security.encryption"
                        label="Enable Device Encryption"
                        color="primary"
                        inset
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-switch
                        v-model="formData.settings.security.remoteWipe"
                        label="Enable Remote Wipe"
                        color="primary"
                        inset
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- App Management -->
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">
                  <v-icon class="mr-2">
                    mdi-application
                  </v-icon>
                  App Management
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-combobox
                        v-model="formData.settings.apps!.required"
                        label="Required Apps"
                        variant="outlined"
                        prepend-inner-icon="mdi-check"
                        multiple
                        chips
                        placeholder="Add required app names..."
                        hint="Apps that must be installed on devices"
                        persistent-hint
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-combobox
                        v-model="formData.settings.apps!.blocked"
                        label="Blocked Apps"
                        variant="outlined"
                        prepend-inner-icon="mdi-block-helper"
                        multiple
                        chips
                        placeholder="Add blocked app names..."
                        hint="Apps that should be blocked/removed"
                        persistent-hint
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
          prepend-icon="mdi-check"
          :loading="saving"
          :disabled="!isFormValid"
          @click="saveTemplate"
        >
          {{ isEditMode ? 'Update Template' : 'Create Template' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNotifications } from '@/composables/useNotifications';
import { useTemplateStore } from '@/stores/templates';
import type { ConfigurationTemplate, TemplateSettings } from '@/types/template';
import { DeviceType } from '@/types/device';

interface Props {
  modelValue: boolean;
  duplicateTemplate?: ConfigurationTemplate | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'template-created': [template: ConfigurationTemplate];
  'dialog-closed': [];
}>();

const route = useRoute();
const templateStore = useTemplateStore();
const { showSuccess, showError } = useNotifications();

const formRef = ref();
const isFormValid = ref(false);
const saving = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const isEditMode = computed(() => !!props.duplicateTemplate);

const formData = ref<{
  name: string;
  description: string;
  createdBy: string;
  deviceTypes: DeviceType[];
  settings: TemplateSettings;
}>({
  name: '',
  description: '',
  createdBy: '',
  deviceTypes: [],
  settings: {
    network: {
      ssid: '',
      security: 'WPA3',
      vlan: 100
    },
    vpn: {
      enabled: false,
      server: ''
    },
    apps: {
      required: [],
      blocked: []
    },
    security: {
      passcode: 'required',
      encryption: true,
      remoteWipe: true
    }
  }
});

const deviceTypeOptions = [
  { value: DeviceType.IPAD_PRO, label: 'iPad Pro' },
  { value: DeviceType.IPAD_AIR, label: 'iPad Air' },
  { value: DeviceType.MACBOOK_PRO, label: 'MacBook Pro' },
  { value: DeviceType.IPHONE, label: 'iPhone' }
];

const securityOptions = [
  { value: 'WPA2', label: 'WPA2' },
  { value: 'WPA3', label: 'WPA3 (Recommended)' }
];

const passcodeOptions = [
  { value: 'required', label: 'Required' },
  { value: 'optional', label: 'Optional' },
  { value: 'disabled', label: 'Disabled' }
];

const rules = {
  required: (value: any) => {
    if (Array.isArray(value)) {
      return value.length > 0 || 'This field is required';
    }
    return !!value || 'This field is required';
  },
  vlan: (value: number) => {
    if (!value) return 'VLAN ID is required';
    return (value >= 1 && value <= 4094) || 'VLAN ID must be between 1 and 4094';
  }
};

const loadDuplicateData = () => {
  if (props.duplicateTemplate) {
    formData.value = {
      name: `${props.duplicateTemplate.name} (Copy)`,
      description: props.duplicateTemplate.description,
      createdBy: props.duplicateTemplate.createdBy,
      deviceTypes: [...props.duplicateTemplate.deviceTypes],
      settings: {
        network: { ...props.duplicateTemplate.settings.network },
        vpn: props.duplicateTemplate.settings.vpn ? { ...props.duplicateTemplate.settings.vpn } : { enabled: false, server: '', protocol: '' },
        apps: props.duplicateTemplate.settings.apps ? {
          required: [...props.duplicateTemplate.settings.apps.required],
          blocked: [...props.duplicateTemplate.settings.apps.blocked]
        } : { required: [], blocked: [] },
        security: { ...props.duplicateTemplate.settings.security }
      }
    };
  }
};

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    createdBy: '',
    deviceTypes: [],
    settings: {
      network: {
        ssid: '',
        security: 'WPA3',
        vlan: 100
      },
      vpn: {
        enabled: false,
        server: ''
      },
      apps: {
        required: [],
        blocked: []
      },
      security: {
        passcode: 'required',
        encryption: true,
        remoteWipe: true
      }
    }
  };
};

const saveTemplate = async () => {
  if (!isFormValid.value) return;

  saving.value = true;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newTemplate: ConfigurationTemplate = {
      id: `tpl-${Date.now()}`,
      name: formData.value.name,
      description: formData.value.description,
      deviceTypes: formData.value.deviceTypes,
      settings: formData.value.settings,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: formData.value.createdBy
    };

    // Add to store (in real app, this would be an API call)
    await templateStore.createTemplate({
      name: newTemplate.name,
      description: newTemplate.description,
      deviceTypes: newTemplate.deviceTypes,
      settings: newTemplate.settings,
      createdBy: newTemplate.createdBy
    });
    
    emit('template-created', newTemplate);
    showSuccess(
      'Template Created Successfully', 
      `${formData.value.name} has been created and is ready to use.`
    );
    
    closeDialog();
  } catch (error) {
    showError('Creation Failed', 'Failed to create template. Please try again.');
  } finally {
    saving.value = false;
  }
};

const closeDialog = () => {
  isOpen.value = false;
  resetForm();
  emit('dialog-closed');
};

// Load duplicate data when dialog opens
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    if (props.duplicateTemplate) {
      loadDuplicateData();
    } else {
      resetForm();
    }
  }
});

// Handle query parameters for duplicate functionality
onMounted(() => {
  const duplicateId = route.query.duplicate as string;
  if (duplicateId && templateStore.templates.length > 0) {
    const templateToDuplicate = templateStore.templates.find(t => t.id === duplicateId);
    if (templateToDuplicate) {
      loadDuplicateData();
    }
  }
});
</script>