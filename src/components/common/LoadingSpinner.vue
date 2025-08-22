<template>
  <v-container
    class="d-flex justify-center align-center"
    :style="{ minHeight }"
  >
    <v-progress-circular
      :size="size"
      :width="width"
      color="primary"
      indeterminate
    />
  </v-container>
</template>

<script setup lang="ts">
interface Props {
  size?: number;
  width?: number;
  minHeight?: string;
}

withDefaults(defineProps<Props>(), {
  size: 64,
  width: 4,
  minHeight: '300px'
});
</script>