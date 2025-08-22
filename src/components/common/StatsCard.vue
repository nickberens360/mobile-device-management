<template>
  <v-card 
    :height="height"
    role="article"
    :aria-labelledby="`stats-title-${title.replace(/\s+/g, '-').toLowerCase()}`"
  >
    <v-card-text class="d-flex flex-column h-100 pa-3">
      <div 
        :id="`stats-title-${title.replace(/\s+/g, '-').toLowerCase()}`"
        class="text-overline mb-1"
      >
        {{ title }}
      </div>
      <div class="d-flex align-center">
        <div
          class="text-h4 font-weight-bold"
          :class="`text-${computedValueColor}`"
          :aria-label="`${title}: ${value}${suffix}`"
        >
          {{ value }}{{ suffix }}
        </div>
        <v-spacer />
        <v-icon
          :size="iconSize"
          :color="computedIconColor"
          aria-hidden="true"
        >
          {{ icon }}
        </v-icon>
      </div>
      <v-spacer v-if="hasAction" />
      <v-btn
        v-if="hasAction"
        size="small"
        :color="computedActionColor"
        variant="text"
        class="pa-0 align-self-start"
        :aria-label="`${actionText} for ${title}`"
        @click="$emit('action-click')"
      >
        {{ actionText }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title: string;
  value: string | number;
  icon: string;
  suffix?: string;
  height?: number;
  iconSize?: number;
  iconColor?: string;
  valueColor?: string;
  hasAction?: boolean;
  actionText?: string;
  actionColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: 140,
  iconSize: 48,
  suffix: '',
  hasAction: false,
  actionText: 'View',
  iconColor: 'primary'
});

const computedIconColor = computed(() => props.iconColor || 'primary');
const computedValueColor = computed(() => props.valueColor || props.iconColor || 'primary');
const computedActionColor = computed(() => props.actionColor || props.iconColor || 'primary');

defineEmits<{
  'action-click': [];
}>();
</script>