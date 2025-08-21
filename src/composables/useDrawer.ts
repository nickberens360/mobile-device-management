import { ref } from 'vue';

const drawer = ref(true);

export const useDrawer = () => {
  const toggleDrawer = () => {
    drawer.value = !drawer.value;
  };

  return {
    drawer,
    toggleDrawer
  };
};