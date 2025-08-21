import apiService from './index';
import type { Location } from '@/types/location';
import type { ApiResponse } from '@/types/api';
import { mockLocations } from '@/mocks/locations';

class LocationApi {
  private useMock = import.meta.env.VITE_MOCK_API === 'true';

  async getLocations(): Promise<ApiResponse<Location[]>> {
    if (this.useMock) {
      return Promise.resolve({
        data: mockLocations,
        status: 200,
      });
    }
    return apiService.get<Location[]>('/locations');
  }

  async getLocationById(id: string): Promise<ApiResponse<Location>> {
    if (this.useMock) {
      const location = mockLocations.find(l => l.id === id);
      if (!location) {
        return Promise.reject(new Error('Location not found'));
      }
      return Promise.resolve({
        data: location,
        status: 200,
      });
    }
    return apiService.get<Location>(`/locations/${id}`);
  }

  async createLocation(location: Omit<Location, 'id'>): Promise<ApiResponse<Location>> {
    if (this.useMock) {
      const newLocation: Location = {
        ...location,
        id: `loc-${Date.now()}`,
      };
      mockLocations.push(newLocation);
      return Promise.resolve({
        data: newLocation,
        status: 201,
      });
    }
    return apiService.post<Location>('/locations', location);
  }

  async updateLocation(id: string, location: Partial<Location>): Promise<ApiResponse<Location>> {
    if (this.useMock) {
      const index = mockLocations.findIndex(l => l.id === id);
      if (index === -1) {
        return Promise.reject(new Error('Location not found'));
      }
      mockLocations[index] = { ...mockLocations[index], ...location };
      return Promise.resolve({
        data: mockLocations[index],
        status: 200,
      });
    }
    return apiService.put<Location>(`/locations/${id}`, location);
  }

  async deleteLocation(id: string): Promise<ApiResponse<void>> {
    if (this.useMock) {
      const index = mockLocations.findIndex(l => l.id === id);
      if (index === -1) {
        return Promise.reject(new Error('Location not found'));
      }
      mockLocations.splice(index, 1);
      return Promise.resolve({
        data: undefined,
        status: 204,
      });
    }
    return apiService.delete<void>(`/locations/${id}`);
  }
}

export default new LocationApi();