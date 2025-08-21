import apiService from './index';
import type { Device } from '@/types/device';
import type { ApiResponse, PaginatedResponse, BulkConfigureRequest } from '@/types/api';
import { mockDevices } from '@/mocks/devices';

class DeviceApi {
  private useMock = import.meta.env.VITE_MOCK_API === 'true';

  async getDevices(params?: any): Promise<ApiResponse<PaginatedResponse<Device>>> {
    if (this.useMock) {
      return Promise.resolve({
        data: {
          data: mockDevices,
          total: mockDevices.length,
          page: params?.page || 1,
          pageSize: params?.pageSize || 20,
        },
        status: 200,
      });
    }
    return apiService.get<PaginatedResponse<Device>>('/devices', params);
  }

  async getDeviceById(id: string): Promise<ApiResponse<Device>> {
    if (this.useMock) {
      const device = mockDevices.find(d => d.id === id);
      if (!device) {
        return Promise.reject(new Error('Device not found'));
      }
      return Promise.resolve({
        data: device,
        status: 200,
      });
    }
    return apiService.get<Device>(`/devices/${id}`);
  }

  async bulkConfigure(request: BulkConfigureRequest): Promise<ApiResponse<void>> {
    if (this.useMock) {
      return Promise.resolve({
        data: undefined as any,
        status: 200,
        message: 'Configuration applied successfully',
      });
    }
    return apiService.post<void>('/devices/bulk-configure', request);
  }

  async getDevicesByLocation(locationId: string): Promise<ApiResponse<Device[]>> {
    if (this.useMock) {
      const devices = mockDevices.filter(d => d.location === locationId);
      return Promise.resolve({
        data: devices,
        status: 200,
      });
    }
    return apiService.get<Device[]>(`/locations/${locationId}/devices`);
  }
}

export default new DeviceApi();