export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BulkConfigureRequest {
  deviceIds: string[];
  templateId: string;
  customSettings?: Partial<TemplateSettings>;
}

import type { TemplateSettings } from './template';