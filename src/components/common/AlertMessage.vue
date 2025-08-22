<template>
  <v-alert
    v-model="visible"
    :type="type"
    :title="title"
    :text="text"
    :closable="closable"
    :variant="variant"
    class="mb-4"
  >
    <slot />
  </v-alert>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  type?: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  text?: string;
  closable?: boolean;
  variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain';
  modelValue?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  closable: true,
  title: '',
  text: '',
  variant: 'tonal',
  modelValue: true
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const visible = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal;
});

watch(visible, (newVal) => {
  emit('update:modelValue', newVal);
});
</script>