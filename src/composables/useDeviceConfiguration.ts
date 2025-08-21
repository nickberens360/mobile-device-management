import { ref, computed } from 'vue';
import { useDeviceStore } from '@/stores/devices';
import { useTemplateStore } from '@/stores/templates';
import { useNotifications } from './useNotifications';
import type { DeviceType } from '@/types/device';
import type { Location } from '@/types/location';

export function useDeviceConfiguration() {
  const deviceStore = useDeviceStore();
  const templateStore = useTemplateStore();
  const { showSuccess, showError } = useNotifications();
  
  const selectedLocation = ref<Location | null>(null);
  const selectedDevices = ref<string[]>([]);
  const selectedTemplate = ref<string>('');
  const selectedDeviceType = ref<DeviceType>('ipad_pro' as DeviceType);
  const isConfiguring = ref(false);
  
  // Computed properties
  const locationDevices = computed(() => {
    if (!selectedLocation.value) return [];
    return deviceStore.devices.filter(d => 
      d.location === selectedLocation.value!.id && 
      d.type === selectedDeviceType.value
    );
  });
  
  const availableTemplates = computed(() => {
    return templateStore.templates.filter(template =>
      template.deviceTypes.includes(selectedDeviceType.value)
    );
  });
  
  const selectedTemplateData = computed(() => {
    return templateStore.templates.find(t => t.id === selectedTemplate.value);
  });
  
  const canProceed = computed(() => {
    return selectedLocation.value && 
           selectedDevices.value.length > 0 && 
           selectedTemplate.value;
  });
  
  // Methods
  const setLocation = (location: Location) => {
    selectedLocation.value = location;
    selectedDevices.value = [];
  };
  
  const setDeviceType = (type: DeviceType) => {
    selectedDeviceType.value = type;
    selectedDevices.value = [];
    selectedTemplate.value = '';
  };
  
  const toggleDevice = (deviceId: string) => {
    const index = selectedDevices.value.indexOf(deviceId);
    if (index > -1) {
      selectedDevices.value.splice(index, 1);
    } else {
      selectedDevices.value.push(deviceId);
    }
  };
  
  const selectAllDevices = () => {
    selectedDevices.value = locationDevices.value.map(d => d.id);
  };
  
  const clearDeviceSelection = () => {
    selectedDevices.value = [];
  };
  
  const applyConfiguration = async (): Promise<boolean> => {
    if (!canProceed.value) {
      showError('Invalid Configuration', 'Please complete all steps before applying configuration.');
      return false;
    }
    
    isConfiguring.value = true;
    
    try {
      await deviceStore.configureDevices(selectedTemplate.value, selectedDevices.value);
      
      const templateName = selectedTemplateData.value?.name || 'Unknown Template';
      const locationName = selectedLocation.value?.name || 'Unknown Location';
      
      showSuccess(
        'Configuration Applied Successfully',
        `Applied "${templateName}" to ${selectedDevices.value.length} devices at ${locationName}`
      );
      
      // Reset form
      resetConfiguration();
      return true;
    } catch (error) {
      showError(
        'Configuration Failed',
        error instanceof Error ? error.message : 'Failed to apply configuration'
      );
      return false;
    } finally {
      isConfiguring.value = false;
    }
  };
  
  const resetConfiguration = () => {
    selectedLocation.value = null;
    selectedDevices.value = [];
    selectedTemplate.value = '';
    selectedDeviceType.value = 'ipad_pro' as DeviceType;
  };
  
  const getDeviceStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      online: 'success',
      offline: 'error',
      configuring: 'warning',
      error: 'error'
    };
    return colors[status] || 'grey';
  };
  
  return {
    // State
    selectedLocation,
    selectedDevices,
    selectedTemplate,
    selectedDeviceType,
    isConfiguring,
    
    // Computed
    locationDevices,
    availableTemplates,
    selectedTemplateData,
    canProceed,
    
    // Methods
    setLocation,
    setDeviceType,
    toggleDevice,
    selectAllDevices,
    clearDeviceSelection,
    applyConfiguration,
    resetConfiguration,
    getDeviceStatusColor
  };
}