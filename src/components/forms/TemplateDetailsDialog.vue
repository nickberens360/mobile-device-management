<template>
  <v-dialog
    v-model="isOpen"
    max-width="900px"
    persistent
  >
    <v-card v-if="template">
      <v-card-title class="d-flex align-center">
        <v-icon
          class="mr-3"
          color="primary"
        >
          mdi-file-document-multiple
        </v-icon>
        Template Details
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
                        :readonly="!isEditing"
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
                        :readonly="!isEditing"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="formData.description"
                        label="Description"
                        variant="outlined"
                        prepend-inner-icon="mdi-text"
                        rows="3"
                        :readonly="!isEditing"
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
                        :readonly="!isEditing"
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
                        :readonly="!isEditing"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-select
                        v-model="formData.settings.network.security"
                        :items="['WPA2', 'WPA3']"
                        label="Security Protocol"
                        variant="outlined"
                        prepend-inner-icon="mdi-shield"
                        :readonly="!isEditing"
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
                        :readonly="!isEditing"
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
                        label="Enable VPN"
                        color="primary"
                        :readonly="!isEditing"
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
                        :readonly="!isEditing"
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
                        :readonly="!isEditing"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-switch
                        v-model="formData.settings.security.encryption"
                        label="Enable Encryption"
                        color="primary"
                        :readonly="!isEditing"
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
                        :readonly="!isEditing"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- App Settings -->
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
                        :readonly="!isEditing"
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
                        :readonly="!isEditing"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Metadata -->
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">
                  Template Metadata
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        :model-value="formatDate(template.createdAt)"
                        label="Created At"
                        variant="outlined"
                        prepend-inner-icon="mdi-calendar-plus"
                        readonly
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        :model-value="formatDate(template.updatedAt)"
                        label="Last Updated"
                        variant="outlined"
                        prepend-inner-icon="mdi-calendar-edit"
                        readonly
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
          v-if="!isEditing"
          color="primary"
          prepend-icon="mdi-pencil"
          @click="startEditing"
        >
          Edit Template
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
          prepend-icon="mdi-content-duplicate"
          @click="duplicateTemplate"
        >
          Duplicate
        </v-btn>

        <v-btn
          color="error"
          variant="outlined"
          prepend-icon="mdi-delete"
          @click="deleteTemplate"
        >
          Delete
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
import { useNotifications } from '@/composables/useNotifications';
import type { ConfigurationTemplate, TemplateSettings } from '@/types/template';
import { DeviceType } from '@/types/device';

interface Props {
  template: ConfigurationTemplate | null;
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'template-updated': [template: ConfigurationTemplate];
  'template-deleted': [templateId: string];
  'dialog-closed': [];
}>();

const router = useRouter();
const { showSuccess, showError } = useNotifications();

const formRef = ref();
const isFormValid = ref(false);
const isEditing = ref(false);
const saving = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

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

const passcodeOptions = [
  { value: 'required', label: 'Required' },
  { value: 'optional', label: 'Optional' },
  { value: 'disabled', label: 'Disabled' }
];

const rules = {
  required: (value: string) => !!value || 'This field is required'
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

const loadTemplateData = () => {
  if (props.template) {
    formData.value = {
      name: props.template.name,
      description: props.template.description,
      createdBy: props.template.createdBy,
      deviceTypes: [...props.template.deviceTypes],
      settings: {
        network: { ...props.template.settings.network },
        vpn: props.template.settings.vpn ? { ...props.template.settings.vpn } : { enabled: false, server: '', protocol: '' },
        apps: props.template.settings.apps ? {
          required: [...props.template.settings.apps.required],
          blocked: [...props.template.settings.apps.blocked]
        } : { required: [], blocked: [] },
        security: { ...props.template.settings.security }
      }
    };
  }
};

const startEditing = () => {
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  loadTemplateData();
};

const saveChanges = async () => {
  if (!props.template || !isFormValid.value) return;

  saving.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedTemplate: ConfigurationTemplate = {
      ...props.template,
      name: formData.value.name,
      description: formData.value.description,
      createdBy: formData.value.createdBy,
      deviceTypes: formData.value.deviceTypes,
      settings: formData.value.settings,
      updatedAt: new Date().toISOString()
    };

    emit('template-updated', updatedTemplate);
    showSuccess('Template Updated', `${formData.value.name} has been updated successfully.`);
    isEditing.value = false;
  } catch (_error) {
    showError('Update Failed', 'Failed to update template. Please try again.');
  } finally {
    saving.value = false;
  }
};

const duplicateTemplate = () => {
  if (props.template) {
    // Navigate to create template with current template as base
    router.push({
      path: '/templates/create',
      query: { duplicate: props.template.id }
    });
    closeDialog();
  }
};

const deleteTemplate = async () => {
  if (!props.template) return;

  // In a real app, show confirmation dialog first
  if (confirm(`Are you sure you want to delete "${props.template.name}"? This action cannot be undone.`)) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      emit('template-deleted', props.template.id);
      showSuccess('Template Deleted', `${props.template.name} has been deleted.`);
      closeDialog();
    } catch (_error) {
      showError('Delete Failed', 'Failed to delete template. Please try again.');
    }
  }
};

const closeDialog = () => {
  isOpen.value = false;
  isEditing.value = false;
  emit('dialog-closed');
};

// Watch for template changes
watch(() => props.template, loadTemplateData, { immediate: true });
</script>