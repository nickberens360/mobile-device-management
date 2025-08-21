import { defineStore } from 'pinia';
import type { Device, DeviceType } from '@/types/device';
import deviceApi from '@/api/devices';

interface DeviceState {
  devices: Device[];
  selectedDevices: Set<string>;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  filters: {
    location?: string;
    type?: DeviceType;
    status?: string;
  };
}

export const useDeviceStore = defineStore('devices', {
  state: (): DeviceState => ({
    devices: [],
    selectedDevices: new Set(),
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
    },
    filters: {},
  }),

  getters: {
    selectedDevicesList: (state): Device[] => {
      return state.devices.filter(d => state.selectedDevices.has(d.id));
    },

    filteredDevices: (state): Device[] => {
      return state.devices.filter(device => {
        if (state.filters.location && device.location !== state.filters.location) {
          return false;
        }
        if (state.filters.type && device.type !== state.filters.type) {
          return false;
        }
        if (state.filters.status && device.status !== state.filters.status) {
          return false;
        }
        return true;
      });
    },
  },

  actions: {
    async fetchDevices(): Promise<void> {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await deviceApi.getDevices({
          ...this.pagination,
          ...this.filters,
        });
        
        this.devices = response.data.data;
        this.pagination.total = response.data.total;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch devices';
      } finally {
        this.loading = false;
      }
    },

    selectDevice(deviceId: string): void {
      this.selectedDevices.add(deviceId);
    },

    deselectDevice(deviceId: string): void {
      this.selectedDevices.delete(deviceId);
    },

    clearSelection(): void {
      this.selectedDevices.clear();
    },

    setFilter<K extends keyof DeviceState['filters']>(
      key: K,
      value: DeviceState['filters'][K]
    ): void {
      this.filters[key] = value;
      this.pagination.page = 1;
      this.fetchDevices();
    },

    async configureDevices(templateId: string, deviceIds: string[]): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        await deviceApi.bulkConfigure({
          templateId,
          deviceIds,
        });
        
        await this.fetchDevices();
        this.clearSelection();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Configuration failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});