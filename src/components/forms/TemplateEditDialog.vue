<template>
  <v-dialog
    v-model="isOpen"
    max-width="900px"
    persistent
  >
    <v-card v-if="template">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-3" color="primary">mdi-pencil</v-icon>
        Edit Template
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
                        label="Template Name"
                        variant="outlined"
                        prepend-inner-icon="mdi-file-document"
                        :rules="[rules.required]"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="formData.deviceTypes"
                        :items="deviceTypeOptions"
                        item-title="label"
                        item-value="value"
                        label="Compatible Device Types"
                        variant="outlined"
                        prepend-inner-icon="mdi-devices"
                        multiple
                        chips
                        closable-chips
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="formData.description"
                        label="Description"
                        variant="outlined"
                        prepend-inner-icon="mdi-text"
                        rows="2"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Network Configuration -->
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">Network Configuration</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.settings.network.ssid"
                        label="SSID"
                        variant="outlined"
                        prepend-inner-icon="mdi-wifi"
                        :rules="[rules.required]"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="formData.settings.network.securityType"
                        :items="securityTypeOptions"
                        label="Security Type"
                        variant="outlined"
                        prepend-inner-icon="mdi-shield-wifi"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-switch
                        v-model="formData.settings.network.autoConnect"
                        label="Auto Connect"
                        color="primary"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-switch
                        v-model="formData.settings.network.hidden"
                        label="Hidden Network"
                        color="primary"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Security Settings -->
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">Security Settings</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-switch
                        v-model="formData.settings.security.encryption"
                        label="Enable Encryption"
                        color="success"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-switch
                        v-model="formData.settings.security.remoteWipe"
                        label="Enable Remote Wipe"
                        color="warning"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-switch
                        v-model="formData.settings.vpn.enabled"
                        label="Enable VPN"
                        color="info"
                      />
                    </v-col>
                  </v-row>
                  
                  <v-expand-transition>
                    <div v-if="formData.settings.vpn?.enabled" class="mt-4">
                      <v-divider class="mb-4" />
                      <h4 class="text-subtitle-1 mb-3">VPN Configuration</h4>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.settings.vpn!.server"
                            label="VPN Server"
                            variant="outlined"
                            prepend-inner-icon="mdi-server"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.settings.vpn!.protocol"
                            :items="vpnProtocolOptions"
                            label="Protocol"
                            variant="outlined"
                            prepend-inner-icon="mdi-protocol"
                          />
                        </v-col>
                      </v-row>
                    </div>
                  </v-expand-transition>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Application Settings -->
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">Application Settings</v-card-title>
                <v-card-text>
                  <v-combobox
                    v-model="formData.settings.applications"
                    label="Applications to Install"
                    variant="outlined"
                    prepend-inner-icon="mdi-apps"
                    multiple
                    chips
                    closable-chips
                    :items="commonApplications"
                    hint="Type to add custom applications or select from common ones"
                    persistent-hint
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
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
          @click="closeDialog"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useNotifications } from '@/composables/useNotifications';
import type { ConfigurationTemplate, DeviceType } from '@/types/template';

interface Props {
  template: ConfigurationTemplate | null;
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'template-updated': [template: ConfigurationTemplate];
  'dialog-closed': [];
}>();

const { showSuccess, showError } = useNotifications();

const formRef = ref();
const isFormValid = ref(false);
const saving = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const formData = ref<{
  name: string;
  description: string;
  deviceTypes: DeviceType[];
  settings: {
    network: {
      ssid: string;
      securityType: string;
      autoConnect: boolean;
      hidden: boolean;
    };
    security: {
      encryption: boolean;
      remoteWipe: boolean;
    };
    vpn: {
      enabled: boolean;
      server?: string;
      protocol?: string;
    };
    applications: string[];
  };
}>({
  name: '',
  description: '',
  deviceTypes: [],
  settings: {
    network: {
      ssid: '',
      securityType: 'WPA2',
      autoConnect: true,
      hidden: false
    },
    security: {
      encryption: true,
      remoteWipe: true,
      passcode: 'optional'
    },
    vpn: {
      enabled: false,
      server: '',
      protocol: 'OpenVPN'
    },
    applications: []
  }
});

const deviceTypeOptions = [
  { value: 'ipad_pro' as DeviceType, label: 'iPad Pro' },
  { value: 'ipad_air' as DeviceType, label: 'iPad Air' },
  { value: 'macbook_pro' as DeviceType, label: 'MacBook Pro' },
  { value: 'iphone' as DeviceType, label: 'iPhone' }
];

const securityTypeOptions = [
  'WPA2',
  'WPA3',
  'WEP',
  'Open'
];

const vpnProtocolOptions = [
  'OpenVPN',
  'IKEv2',
  'L2TP',
  'PPTP'
];

const commonApplications = [
  'Safari',
  'Chrome',
  'Microsoft Office',
  'Adobe Creative Suite',
  'Final Cut Pro',
  'Logic Pro',
  'Xcode',
  'Slack',
  'Teams',
  'Zoom',
  'Netflix',
  'YouTube'
];

const rules = {
  required: (value: string) => !!value || 'This field is required'
};

const loadTemplateData = () => {
  if (props.template) {
    formData.value = {
      name: props.template.name,
      description: props.template.description,
      deviceTypes: [...props.template.deviceTypes],
      settings: {
        network: {
          ssid: props.template.settings.network.ssid,
          securityType: props.template.settings.network.securityType || props.template.settings.network.security || 'WPA2',
          autoConnect: props.template.settings.network.autoConnect ?? true,
          hidden: props.template.settings.network.hidden ?? false
        },
        security: {
          encryption: props.template.settings.security.encryption,
          remoteWipe: props.template.settings.security.remoteWipe,
          passcode: props.template.settings.security.passcode || 'optional'
        },
        vpn: {
          enabled: props.template.settings.vpn?.enabled || false,
          server: props.template.settings.vpn?.server || '',
          protocol: props.template.settings.vpn?.protocol || 'OpenVPN'
        },
        applications: [...(props.template.settings.applications || (props.template.settings as any).apps?.required || [])]
      }
    };
  }
};

const saveChanges = async () => {
  if (!props.template || !isFormValid.value) return;

  saving.value = true;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedTemplate: ConfigurationTemplate = {
      ...props.template,
      name: formData.value.name,
      description: formData.value.description,
      deviceTypes: formData.value.deviceTypes,
      settings: {
        ...formData.value.settings,
        // Clean up VPN settings if disabled
        vpn: formData.value.settings.vpn?.enabled ? formData.value.settings.vpn : { enabled: false }
      },
      updatedAt: new Date().toISOString()
    };

    emit('template-updated', updatedTemplate);
    showSuccess('Template Updated', `${formData.value.name} has been updated successfully`);
    closeDialog();
  } catch (error) {
    showError('Update Failed', 'Failed to update template. Please try again.');
  } finally {
    saving.value = false;
  }
};

const closeDialog = () => {
  isOpen.value = false;
  emit('dialog-closed');
};

// Watch for template changes
watch(() => props.template, loadTemplateData, { immediate: true });
</script>