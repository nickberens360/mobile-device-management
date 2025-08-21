<template>
  <v-card 
    variant="outlined" 
    hover
    @click="handleClick"
    class="cursor-pointer"
  >
    <v-card-text>
      <div class="d-flex align-center mb-2">
        <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
        <div class="text-subtitle-1 font-weight-bold">{{ location.name }}</div>
      </div>
      <v-chip
        size="small"
        :color="typeColor"
        variant="tonal"
        class="mr-2"
      >
        {{ location.type }}
      </v-chip>
      <div class="mt-3">
        <v-progress-linear
          :model-value="onlinePercentage"
          height="20"
          rounded
          :color="progressColor"
        >
          <template v-slot:default>
            <span class="text-caption">{{ onlineCount }}/{{ totalCount }} online</span>
          </template>
        </v-progress-linear>
      </div>
      <div class="d-flex justify-space-between align-center mt-2" v-if="showDetails">
        <span class="text-caption text-medium-emphasis">
          {{ location.address }}
        </span>
        <v-icon size="small" color="primary">mdi-chevron-right</v-icon>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Location } from '@/types/location';

interface Props {
  location: Location;
  onlineCount?: number;
  totalCount?: number;
  showDetails?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  onlineCount: 0,
  totalCount: 0,
  showDetails: false
});

const router = useRouter();

const onlinePercentage = computed(() => {
  if (props.totalCount === 0) return 0;
  return (props.onlineCount / props.totalCount) * 100;
});

const progressColor = computed(() => {
  const percentage = onlinePercentage.value;
  if (percentage === 100) return 'success';
  if (percentage >= 75) return 'green-lighten-3';
  if (percentage >= 50) return 'warning';
  return 'error';
});

const typeColor = computed(() => {
  switch (props.location.type) {
    case 'Studio':
      return 'primary';
    case 'Corporate Office':
      return 'secondary';
    case 'Theme Park':
      return 'accent';
    case 'Production Set':
      return 'info';
    case 'Broadcast Center':
      return 'warning';
    default:
      return 'primary';
  }
});

const handleClick = () => {
  router.push(`/locations/${props.location.id}`);
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>