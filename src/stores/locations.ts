import { defineStore } from 'pinia';
import type { Location } from '@/types/location';
import locationApi from '@/api/locations';

interface LocationState {
  locations: Location[];
  loading: boolean;
  error: string | null;
}

export const useLocationStore = defineStore('locations', {
  state: (): LocationState => ({
    locations: [],
    loading: false,
    error: null,
  }),

  getters: {
    getLocationById: (state) => {
      return (id: string): Location | undefined => {
        return state.locations.find(loc => loc.id === id);
      };
    },

    locationsByType: (state) => {
      return state.locations.reduce((acc, location) => {
        if (!acc[location.type]) {
          acc[location.type] = [];
        }
        acc[location.type].push(location);
        return acc;
      }, {} as Record<string, Location[]>);
    },
  },

  actions: {
    async fetchLocations(): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        const response = await locationApi.getLocations();
        this.locations = response.data;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch locations';
      } finally {
        this.loading = false;
      }
    },

    async fetchLocationById(id: string): Promise<Location | null> {
      try {
        const response = await locationApi.getLocationById(id);
        return response.data;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch location';
        return null;
      }
    },

    async createLocation(location: Omit<Location, 'id'>): Promise<Location | null> {
      this.loading = true;
      this.error = null;

      try {
        const response = await locationApi.createLocation(location);
        this.locations.push(response.data);
        return response.data;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create location';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateLocation(id: string, location: Partial<Location>): Promise<Location | null> {
      this.loading = true;
      this.error = null;

      try {
        const response = await locationApi.updateLocation(id, location);
        const index = this.locations.findIndex(loc => loc.id === id);
        if (index !== -1) {
          this.locations[index] = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update location';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async deleteLocation(id: string): Promise<boolean> {
      this.loading = true;
      this.error = null;

      try {
        await locationApi.deleteLocation(id);
        const index = this.locations.findIndex(loc => loc.id === id);
        if (index !== -1) {
          this.locations.splice(index, 1);
        }
        return true;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete location';
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});