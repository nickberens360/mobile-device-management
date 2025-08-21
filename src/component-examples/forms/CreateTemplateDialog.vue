<template>
  <ExampleComponentUsage
    :prop-items="propItems"
    :event-items="eventItems"
    :slot-items="slotItems"
    description="A dialog component for creating new configuration templates with form validation and device type selection."
  >
    <div>
      <v-btn @click="openDialog" color="primary">
        Create New Template
      </v-btn>
      <CreateTemplateDialog
        :model-value="showDialog"
        :duplicate-template="duplicateTemplate"
        @update:model-value="showDialog = $event"
        @template-created="handleTemplateCreated"
        @dialog-closed="closeDialog"
      />
    </div>
    <template #[`item.actions`]="{item}">
      <v-switch
        v-if="item.name === 'modelValue'"
        v-model="showDialog"
        density="compact"
        hide-details
      />
      <v-select
        v-if="item.name === 'duplicateTemplate'"
        v-model="duplicateTemplateId"
        :items="templateOptions"
        density="compact"
        hide-details
        clearable
        @update:model-value="updateDuplicateTemplate"
      />
    </template>
  </ExampleComponentUsage>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CreateTemplateDialog from '@/components/forms/CreateTemplateDialog.vue';
import type { ConfigurationTemplate } from '@/types/template';
import { DeviceType } from '@/types/device';

const showDialog = ref(false);
const duplicateTemplateId = ref('');

const mockTemplates: ConfigurationTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Film Production - Crew Devices',
    description: 'Standard configuration for crew devices on film sets',
    deviceTypes: [DeviceType.IPAD_PRO, DeviceType.IPAD_AIR],
    settings: {
      network: {
        ssid: 'PROD_WIFI',
        security: 'WPA3',
        vlan: 100
      },
      vpn: {
        enabled: true,
        server: 'vpn.nbcuni.com'
      },
      apps: {
        required: ['NBC Production Suite', 'Slack'],
        blocked: ['TikTok', 'Facebook']
      },
      security: {
        passcode: 'required',
        encryption: true,
        remoteWipe: true
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T12:00:00Z',
    createdBy: 'admin@nbcuni.com'
  },
  {
    id: 'tpl-2',
    name: 'Corporate - Office Devices',
    description: 'Standard corporate office device configuration',
    deviceTypes: [DeviceType.MACBOOK_PRO, DeviceType.IPAD_PRO],
    settings: {
      network: {
        ssid: 'CORP_WIFI',
        security: 'WPA3',
        vlan: 50
      },
      vpn: {
        enabled: true,
        server: 'corporate-vpn.nbcuni.com'
      },
      apps: {
        required: ['Microsoft Office', 'Zoom', 'Slack'],
        blocked: []
      },
      security: {
        passcode: 'required',
        encryption: true,
        remoteWipe: true
      }
    },
    createdAt: '2023-12-15T00:00:00Z',
    updatedAt: '2024-01-05T14:00:00Z',
    createdBy: 'it.admin@nbcuni.com'
  }
];

const duplicateTemplate = computed(() => 
  mockTemplates.find(t => t.id === duplicateTemplateId.value) || null
);

const templateOptions = [
  { title: 'None', value: '' },
  ...mockTemplates.map(template => ({
    title: template.name,
    value: template.id
  }))
];

const openDialog = () => {
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const updateDuplicateTemplate = (templateId: string) => {
  duplicateTemplateId.value = templateId;
};

const handleTemplateCreated = (template: ConfigurationTemplate) => {
  console.log('Template created:', template);
  closeDialog();
};

const propItems = [
  {
    name: 'modelValue',
    type: 'boolean',
    default: 'false',
    description: 'Controls dialog visibility (v-model)'
  },
  {
    name: 'duplicateTemplate',
    type: 'ConfigurationTemplate | null',
    default: 'null',
    description: 'Template to duplicate (optional)'
  }
];

const eventItems = [
  {
    event: 'update:model-value',
    payload: 'boolean',
    description: 'Emitted when dialog visibility changes (v-model).',
  },
  {
    event: 'template-created',
    payload: 'ConfigurationTemplate',
    description: 'Emitted when a new template is successfully created.',
  },
  {
    event: 'dialog-closed',
    payload: 'void',
    description: 'Emitted when the dialog is closed.',
  },
];

const slotItems = [
  {
    name: 'additional-fields',
    content: 'custom form fields',
    description: 'Slot for adding custom form fields to the template creation form.',
  },
];
</script>