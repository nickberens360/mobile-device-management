import apiService from './index';
import type { ConfigurationHistory } from '@/types/configuration';
import type { ApiResponse } from '@/types/api';

class ConfigurationApi {
  async getHistory(deviceId?: string): Promise<ApiResponse<ConfigurationHistory[]>> {
    const url = deviceId ? `/configurations/history?deviceId=${deviceId}` : '/configurations/history';
    return apiService.get<ConfigurationHistory[]>(url);
  }

  async rollback(configurationId: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(`/configurations/${configurationId}/rollback`);
  }
}

export default new ConfigurationApi();