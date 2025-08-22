<template>
  <ExampleComponentUsage
    :prop-items="propItems"
    :event-items="eventItems"
    :slot-items="slotItems"
    description="A dialog component for viewing and editing configuration template details with full settings configuration."
  >
    <div>
      <v-btn
        color="primary"
        @click="openDialog"
      >
        View Template Details
      </v-btn>
      <TemplateDetailsDialog
        :template="selectedTemplate"
        :model-value="showDialog"
        @update:model-value="showDialog = $event"
        @template-updated="handleTemplateUpdated"
        @template-deleted="handleTemplateDeleted"
      />
    </div>
    <template #[`item.actions`]="{item}">
      <v-select
        v-if="item.name === 'template'"
        v-model="selectedTemplateId"
        :items="templateOptions"
        density="compact"
        hide-details
        @update:model-value="updateSelectedTemplate"
      />
      <v-switch
        v-if="item.name === 'modelValue'"
        v-model="showDialog"
        density="compact"
        hide-details
      />
    </template>
  </ExampleComponentUsage>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TemplateDetailsDialog from '@/components/forms/TemplateDetailsDialog.vue';
import type { ConfigurationTemplate } from '@/types/template';
import { DeviceType } from '@/types/device';

const showDialog = ref(false);
const readonly = ref(false);
const selectedTemplateId = ref('tpl-1');

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
        required: ['NBC Production Suite', 'Slack', 'Microsoft Teams'],
        blocked: ['TikTok', 'Facebook', 'Instagram']
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
        required: ['Microsoft Office', 'Zoom', 'Slack', 'NBC Apps'],
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
  },
  {
    id: 'tpl-3',
    name: 'Press Event - Media Devices',
    description: 'Configuration for press and media event devices',
    deviceTypes: [DeviceType.IPAD_PRO, DeviceType.IPHONE],
    settings: {
      network: {
        ssid: 'MEDIA_WIFI',
        security: 'WPA2',
        vlan: 300
      },
      vpn: {
        enabled: false
      },
      apps: {
        required: ['NBC Press Kit', 'Media Portal'],
        blocked: []
      },
      security: {
        passcode: 'optional',
        encryption: false,
        remoteWipe: false
      }
    },
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-12T16:00:00Z',
    createdBy: 'media.admin@nbcuni.com'
  }
];

const selectedTemplate = computed(() => 
  mockTemplates.find(t => t.id === selectedTemplateId.value) || mockTemplates[0]
);

const templateOptions = mockTemplates.map(template => ({
  title: template.name,
  value: template.id
}));

const openDialog = () => {
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const updateSelectedTemplate = (templateId: string) => {
  selectedTemplateId.value = templateId;
};

const handleTemplateUpdated = (template: ConfigurationTemplate) => {
  console.log('Template updated:', template);
  closeDialog();
};

const handleTemplateDeleted = (templateId: string) => {
  console.log('Template deleted:', templateId);
  closeDialog();
};

const handleUseTemplate = (template: ConfigurationTemplate) => {
  console.log('Use template:', template);
  closeDialog();
};

const propItems = [
  {
    name: 'template',
    type: 'ConfigurationTemplate',
    default: null,
    description: 'Template to display/edit'
  },
  {
    name: 'modelValue',
    type: 'boolean',
    default: false,
    description: 'Controls dialog visibility (v-model)'
  }
];

const eventItems = [
  {
    event: 'update:model-value',
    payload: 'boolean',
    description: 'Emitted when dialog visibility changes (v-model).',
  },
  {
    event: 'template-updated',
    payload: 'ConfigurationTemplate',
    description: 'Emitted when the template is successfully updated.',
  },
  {
    event: 'template-deleted',
    payload: 'string (templateId)',
    description: 'Emitted when the template is deleted.',
  },
];

const slotItems = [
  {
    name: 'additional-actions',
    content: 'action buttons',
    description: 'Slot for additional action buttons in the dialog footer.',
  },
  {
    name: 'custom-settings',
    content: 'settings fields',
    description: 'Slot for custom template settings sections.',
  },
];
</script>