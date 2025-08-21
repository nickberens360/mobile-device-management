<template>
  <v-list-item 
    :title="activity.title"
    :subtitle="activity.subtitle"
    @click="handleClick"
    class="cursor-pointer"
    hover
  >
    <template v-slot:prepend>
      <v-icon :color="activity.color">{{ activity.icon }}</v-icon>
    </template>
    <template v-slot:append>
      <div class="d-flex align-center">
        <v-list-item-subtitle class="mr-2">{{ activity.time }}</v-list-item-subtitle>
        <v-icon size="small" color="primary">mdi-chevron-right</v-icon>
      </div>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

export interface ConfigurationActivity {
  id: string | number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  time: string;
  type: 'device_configuration' | 'template_update' | 'template_create' | 'configuration_failure';
  locationId?: string;
  templateId?: string;
  deviceIds?: string[];
}

interface Props {
  activity: ConfigurationActivity;
}

const props = defineProps<Props>();
const router = useRouter();

const handleClick = () => {
  switch (props.activity.type) {
    case 'device_configuration':
      // Navigate to configure with location or device filters
      if (props.activity.locationId) {
        router.push(`/configure?location=${props.activity.locationId}`);
      } else if (props.activity.deviceIds?.length) {
        router.push(`/configure?devices=${props.activity.deviceIds.join(',')}`);
      } else {
        router.push('/configure');
      }
      break;
    
    case 'template_update':
    case 'template_create':
      // Navigate to template details if templateId exists
      if (props.activity.templateId) {
        router.push(`/templates/${props.activity.templateId}`);
      } else {
        router.push('/templates');
      }
      break;
    
    case 'configuration_failure':
      // Navigate to history with filters for failed configurations
      if (props.activity.locationId) {
        router.push(`/history?location=${props.activity.locationId}&status=failed`);
      } else if (props.activity.deviceIds?.length) {
        router.push(`/history?devices=${props.activity.deviceIds.join(',')}&status=failed`);
      } else {
        router.push('/history?status=failed');
      }
      break;
    
    default:
      router.push('/configure');
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>