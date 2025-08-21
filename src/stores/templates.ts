import { defineStore } from 'pinia';
import type { ConfigurationTemplate } from '@/types/template';
import templateApi from '@/api/templates';

interface TemplateState {
  templates: ConfigurationTemplate[];
  loading: boolean;
  error: string | null;
}

export const useTemplateStore = defineStore('templates', {
  state: (): TemplateState => ({
    templates: [],
    loading: false,
    error: null,
  }),

  getters: {
    getTemplateById: (state) => {
      return (id: string): ConfigurationTemplate | undefined => {
        return state.templates.find(template => template.id === id);
      };
    },

    templatesByDeviceType: (state) => {
      return (deviceType: string): ConfigurationTemplate[] => {
        return state.templates.filter(template => 
          template.deviceTypes.includes(deviceType as any)
        );
      };
    },
  },

  actions: {
    async fetchTemplates(): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        const response = await templateApi.getTemplates();
        this.templates = response.data;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch templates';
      } finally {
        this.loading = false;
      }
    },

    async createTemplate(template: Omit<ConfigurationTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        await templateApi.createTemplate(template);
        await this.fetchTemplates();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create template';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTemplate(id: string, template: Partial<ConfigurationTemplate>): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        await templateApi.updateTemplate(id, template);
        await this.fetchTemplates();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update template';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTemplate(id: string): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        await templateApi.deleteTemplate(id);
        await this.fetchTemplates();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete template';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});