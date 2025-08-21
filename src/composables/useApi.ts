import { ref } from 'vue';
import type { ApiResponse } from '@/types/api';

export function useApi() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const execute = async <T>(
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<T | null> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiCall();
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const clearError = () => {
    error.value = null;
  };
  
  return {
    loading,
    error,
    execute,
    clearError
  };
}