import apiService from './index';
import type { ConfigurationTemplate } from '@/types/template';
import type { ApiResponse } from '@/types/api';
import { mockTemplates } from '@/mocks/templates';

class TemplateApi {
  private useMock = import.meta.env.VITE_MOCK_API === 'true';

  async getTemplates(): Promise<ApiResponse<ConfigurationTemplate[]>> {
    if (this.useMock) {
      return Promise.resolve({
        data: mockTemplates,
        status: 200,
      });
    }
    return apiService.get<ConfigurationTemplate[]>('/templates');
  }

  async getTemplateById(id: string): Promise<ApiResponse<ConfigurationTemplate>> {
    if (this.useMock) {
      const template = mockTemplates.find(t => t.id === id);
      if (!template) {
        return Promise.reject(new Error('Template not found'));
      }
      return Promise.resolve({
        data: template,
        status: 200,
      });
    }
    return apiService.get<ConfigurationTemplate>(`/templates/${id}`);
  }

  async createTemplate(template: Omit<ConfigurationTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ConfigurationTemplate>> {
    if (this.useMock) {
      const newTemplate: ConfigurationTemplate = {
        ...template,
        id: `tpl-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockTemplates.push(newTemplate);
      return Promise.resolve({
        data: newTemplate,
        status: 201,
      });
    }
    return apiService.post<ConfigurationTemplate>('/templates', template);
  }

  async updateTemplate(id: string, template: Partial<ConfigurationTemplate>): Promise<ApiResponse<ConfigurationTemplate>> {
    if (this.useMock) {
      const index = mockTemplates.findIndex(t => t.id === id);
      if (index === -1) {
        return Promise.reject(new Error('Template not found'));
      }
      mockTemplates[index] = { 
        ...mockTemplates[index], 
        ...template,
        updatedAt: new Date().toISOString(),
      };
      return Promise.resolve({
        data: mockTemplates[index],
        status: 200,
      });
    }
    return apiService.put<ConfigurationTemplate>(`/templates/${id}`, template);
  }

  async deleteTemplate(id: string): Promise<ApiResponse<void>> {
    if (this.useMock) {
      const index = mockTemplates.findIndex(t => t.id === id);
      if (index === -1) {
        return Promise.reject(new Error('Template not found'));
      }
      mockTemplates.splice(index, 1);
      return Promise.resolve({
        data: undefined as any,
        status: 204,
      });
    }
    return apiService.delete<void>(`/templates/${id}`);
  }
}

export default new TemplateApi();