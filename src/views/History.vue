<template>
  <v-container fluid>
    <h1 class="text-h4 mb-6">Configuration History</h1>
    
    <v-card>
      <v-card-title>Recent Activities</v-card-title>
      <v-card-text>
        <v-timeline align="start">
          <v-timeline-item
            v-for="activity in historyItems"
            :key="activity.id"
            :dot-color="activity.color"
            size="small"
          >
            <template v-slot:icon>
              <v-icon :color="activity.color">{{ activity.icon }}</v-icon>
            </template>
            
            <v-card variant="outlined">
              <v-card-text>
                <div class="d-flex justify-space-between align-start mb-2">
                  <div>
                    <div class="text-h6">{{ activity.title }}</div>
                    <div class="text-body-2 text-medium-emphasis">{{ activity.description }}</div>
                  </div>
                  <v-chip
                    :color="activity.statusColor"
                    size="small"
                    variant="tonal"
                  >
                    {{ activity.status }}
                  </v-chip>
                </div>
                
                <div class="d-flex align-center mt-2">
                  <v-icon size="small" class="mr-1">mdi-account</v-icon>
                  <span class="text-caption mr-4">{{ activity.user }}</span>
                  
                  <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
                  <span class="text-caption">{{ activity.timestamp }}</span>
                </div>
                
                <div v-if="activity.affectedDevices" class="mt-2">
                  <v-chip size="small" variant="outlined">
                    {{ activity.affectedDevices }} devices affected
                  </v-chip>
                </div>
              </v-card-text>
              
              <v-card-actions v-if="activity.rollbackAvailable">
                <v-spacer />
                <v-btn
                  size="small"
                  variant="outlined"
                  prepend-icon="mdi-backup-restore"
                >
                  Rollback
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const historyItems = ref([
  {
    id: 1,
    title: 'Bulk Configuration Applied',
    description: 'Applied "Film Production - Crew Devices" template to Universal Studios - Stage 12',
    status: 'Success',
    statusColor: 'success',
    color: 'success',
    icon: 'mdi-check-circle',
    user: 'john.doe@nbcuni.com',
    timestamp: '2 hours ago',
    affectedDevices: 15,
    rollbackAvailable: true
  },
  {
    id: 2,
    title: 'Template Updated',
    description: 'Modified network settings in "Film Production - Crew Devices" template',
    status: 'Success',
    statusColor: 'info',
    color: 'info',
    icon: 'mdi-file-document-edit',
    user: 'jane.smith@nbcuni.com',
    timestamp: '5 hours ago',
    affectedDevices: null,
    rollbackAvailable: false
  },
  {
    id: 3,
    title: 'Configuration Failed',
    description: 'Failed to apply "Corporate - Office Devices" template to 30 Rockefeller Plaza',
    status: 'Failed',
    statusColor: 'error',
    color: 'error',
    icon: 'mdi-alert-circle',
    user: 'admin@nbcuni.com',
    timestamp: '1 day ago',
    affectedDevices: 3,
    rollbackAvailable: false
  },
  {
    id: 4,
    title: 'New Template Created',
    description: 'Created "Press Event - Media Devices" template for media events',
    status: 'Success',
    statusColor: 'success',
    color: 'primary',
    icon: 'mdi-plus-circle',
    user: 'media.admin@nbcuni.com',
    timestamp: '2 days ago',
    affectedDevices: null,
    rollbackAvailable: false
  },
  {
    id: 5,
    title: 'Mass Device Enrollment',
    description: 'Enrolled 50 new iPad devices at Universal Orlando - Islands of Adventure',
    status: 'Success',
    statusColor: 'success',
    color: 'success',
    icon: 'mdi-devices',
    user: 'park.admin@nbcuni.com',
    timestamp: '3 days ago',
    affectedDevices: 50,
    rollbackAvailable: false
  }
]);
</script>